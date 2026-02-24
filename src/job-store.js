/**
 * Job store - in-memory by default, Redis when KV/Upstash env vars are set (Vercel)
 */
const JOB_PREFIX = 'siteclone:job:';
const JOB_TTL = 3600; // 1 hour

let redis = null;
function getRedis() {
  if (redis) return redis;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    try {
      const { Redis } = require('@upstash/redis');
      redis = new Redis({ url, token });
      return redis;
    } catch (e) {
      console.warn('Redis init failed:', e.message);
    }
  }
  return null;
}

const memoryStore = new Map();

async function get(jobId) {
  const r = getRedis();
  if (r) {
    try {
      const raw = await r.get(JOB_PREFIX + jobId);
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch (e) {
      console.warn('Redis get failed:', e.message);
    }
  }
  return memoryStore.get(jobId);
}

async function set(jobId, data) {
  const r = getRedis();
  if (r) {
    try {
      await r.setex(JOB_PREFIX + jobId, JOB_TTL, JSON.stringify(data));
      return;
    } catch (e) {
      console.warn('Redis set failed:', e.message);
    }
  }
  memoryStore.set(jobId, data);
}

async function update(jobId, updates) {
  const current = await get(jobId);
  if (!current) return;
  const next = { ...current, ...updates };
  await set(jobId, next);
}

module.exports = { get, set, update };
