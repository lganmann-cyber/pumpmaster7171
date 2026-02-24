/**
 * Express server for Site Cloner API
 */

// Puppeteer by default for hero images. Disable on Vercel (no Chromium) or with --no-puppeteer.
if (process.argv.includes('--no-puppeteer') || process.env.VERCEL) {
  process.env.PUPPETEER_DISABLE = '1';
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const { runCloneJob, createJob, OUTPUT_BASE } = require('./src/cloner');
const { createZipFromDir } = require('./src/utils/zip');
const jobStore = require('./src/job-store');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * POST /api/clone - Start a clone job
 */
app.post('/api/clone', async (req, res) => {
  try {
    const { url, options = {} } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const jobId = createJob();
    const normalizedOptions = {
      css: options.css !== false,
      images: options.images !== false,
      fonts: options.fonts !== false,
      content: options.content !== false
    };

    const initialJob = {
      jobId,
      status: 'started',
      progress: 0,
      currentStep: 'Starting...',
      log: [],
      stats: { pages: 0, images: 0, fonts: 0, cssFiles: 0 },
      createdAt: new Date().toISOString()
    };
    await jobStore.set(jobId, initialJob);

    // Run clone in background
    runCloneJob(jobId, url, normalizedOptions, async (update) => {
      await jobStore.update(jobId, {
        status: update.status,
        progress: update.progress,
        currentStep: update.currentStep,
        ...(update.log && { log: update.log }),
        ...(update.stats && { stats: update.stats })
      });
    })
      .then(async (result) => {
        await jobStore.update(jobId, {
          status: 'completed',
          progress: 100,
          currentStep: 'Complete',
          outputDir: result.outputDir,
          stats: result.stats
        });
      })
      .catch(async (err) => {
        await jobStore.update(jobId, {
          status: 'error',
          currentStep: `Error: ${err.message}`,
          error: err.message
        });
      });

    res.json({ jobId, status: 'started' });
  } catch (err) {
    console.error('Clone start error:', err);
    res.status(500).json({ error: err.message || 'Failed to start clone' });
  }
});

/**
 * GET /api/status/:jobId - Get job progress
 */
app.get('/api/status/:jobId', async (req, res) => {
  const { jobId } = req.params;
  const job = await jobStore.get(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.json({
    jobId,
    status: job.status,
    progress: job.progress ?? 0,
    currentStep: job.currentStep,
    log: job.log || [],
    stats: job.stats || {},
    error: job.error
  });
});

/**
 * GET /api/download/:jobId/:type - Download result (wordpress | all)
 */
app.get('/api/download/:jobId/:type', async (req, res) => {
  const { jobId, type } = req.params;
  const job = await jobStore.get(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  if (job.status !== 'completed') {
    return res.status(400).json({ error: 'Job not yet completed' });
  }

  const outputDir = job.outputDir;
  if (!outputDir || !fs.existsSync(outputDir)) {
    return res.status(404).json({ error: 'Output not found' });
  }

  try {
    const zipPath = path.join(OUTPUT_BASE, `${jobId}-${type}.zip`);

    if (type === 'wordpress') {
      const themeDir = path.join(outputDir, 'wordpress-theme');
      if (!fs.existsSync(themeDir)) {
        return res.status(404).json({ error: 'WordPress theme not found' });
      }
      await createZipFromDir(themeDir, zipPath);
    } else if (type === 'all') {
      await createZipFromDir(outputDir, zipPath);
    } else if (type === 'css') {
      const { createZipFromItems } = require('./src/utils/zip');
      const cssPath = path.join(outputDir, 'style.css');
      const assetsDir = path.join(outputDir, 'assets');
      const items = [];
      if (fs.existsSync(cssPath)) items.push({ path: cssPath, name: 'style.css' });
      if (fs.existsSync(assetsDir)) items.push({ path: assetsDir, name: 'assets' });
      if (items.length === 0) {
        return res.status(404).json({ error: 'No CSS or assets found' });
      }
      await createZipFromItems(items, zipPath);
    } else {
      return res.status(400).json({ error: 'Invalid download type. Use "wordpress", "all", or "css"' });
    }

    const domain = job.stats?.pages ? 'clone' : 'site';
    res.download(zipPath, `${domain}-${jobId}.zip`, (err) => {
      if (err && !res.headersSent) {
        console.error('Download error:', err);
      }
      fs.remove(zipPath).catch(() => {});
    });
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: err.message || 'Download failed' });
  }
});

// Ensure output directory exists (use /tmp on Vercel - read-only filesystem)
if (!process.env.VERCEL) {
  fs.ensureDirSync(OUTPUT_BASE);
}

function startServer(port) {
  if (port > 3010) {
    console.error('No available ports between 3000-3010. Kill the process using port 3000 or set PORT=3011');
    process.exit(1);
  }
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Site Cloner running at http://localhost:${port}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      throw err;
    }
  });
}

if (require.main === module) {
  startServer(PORT);
}

module.exports = app;
