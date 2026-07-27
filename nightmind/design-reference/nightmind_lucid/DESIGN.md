---
name: NightMind Lucid
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363941'
  surface-container-lowest: '#0b0e15'
  surface-container-low: '#191c23'
  surface-container: '#1d2027'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e0e2ec'
  on-surface-variant: '#cec3d2'
  inverse-surface: '#e0e2ec'
  inverse-on-surface: '#2d3038'
  outline: '#978d9b'
  outline-variant: '#4b4450'
  surface-tint: '#ddb8ff'
  primary: '#ddb8ff'
  on-primary: '#461373'
  primary-container: '#b07fe0'
  on-primary-container: '#420e6f'
  inverse-primary: '#7748a5'
  secondary: '#95ccff'
  on-secondary: '#003353'
  secondary-container: '#3297de'
  on-secondary-container: '#002c48'
  tertiary: '#ffb869'
  on-tertiary: '#482900'
  tertiary-container: '#cf8422'
  on-tertiary-container: '#442700'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f0dbff'
  primary-fixed-dim: '#ddb8ff'
  on-primary-fixed: '#2c0051'
  on-primary-fixed-variant: '#5e2f8b'
  secondary-fixed: '#cee5ff'
  secondary-fixed-dim: '#95ccff'
  on-secondary-fixed: '#001d32'
  on-secondary-fixed-variant: '#004a75'
  tertiary-fixed: '#ffdcbb'
  tertiary-fixed-dim: '#ffb869'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#673d00'
  background: '#10131a'
  on-background: '#e0e2ec'
  surface-variant: '#32353c'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  stats-lg:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.1'
  stats-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style
The design system is engineered for serious practitioners of lucid dreaming, prioritizing skill acquisition over "wellness fluff." The aesthetic is **internet-native and technical**, blending high-performance utility with a nocturnal, focused atmosphere. It avoids ethereal gradients and soft-focus imagery in favor of high-contrast data visualization and structured information architecture.

The style is **Professional-Technical**, utilizing sharp execution and systematic layouts that evoke the feeling of a sophisticated laboratory tool or a developer environment. It is designed to be legible and non-distracting during late-night "WBTB" (Wake Back To Bed) sessions, using a high-contrast palette that favors clarity over aesthetics.

## Colors
The system utilizes three distinct modes to accommodate the user's circadian rhythm:
- **Dark (Default):** A deep charcoal and obsidian base with vibrant logic colors. Purple denotes "Lucidity," Blue denotes "REM/Data," and Orange denotes "State Checks/Actions."
- **Night Shift:** A specialized "Amber-only" mode designed for 3:00 AM interactions. It eliminates blue light entirely, using a monochromatic amber scale to preserve melatonin levels while maintaining high legibility.
- **Light (Opt-in):** A secondary mode for daytime review of dream journals and statistics, utilizing a clean, paper-like gray-wash.

**Functional Application:** 
- Headlines should utilize **two-tone coloring**: the primary keyword of a title should use the Primary or Secondary accent color, while the supporting text remains in the base Ink color.

## Typography
The system employs a dual-font strategy. **Plus Jakarta Sans** provides a contemporary, clean UI feel for prose, instructions, and navigational elements. **JetBrains Mono** is reserved for all "quantifiable" data—timestamps, dream duration, success percentages, and technical logs—to emphasize the skill-acquisition nature of the app.

Large headlines must be implemented with tight tracking and heavy weights. In mobile views, use `headline-md` for main page titles to ensure maximum screen real estate for data entry.

## Layout & Spacing
This design system follows a strict **4px rhythmic grid**. All padding, margins, and component heights must be multiples of 4.

**Layout Model:**
- **Phone-First:** The primary interface is a single-column fluid layout with 20px side margins. 
- **The Sheet Model:** Full-screen overlays and bottom sheets use a 32px corner radius, creating a "container-within-a-frame" look that separates active tasks (like journaling) from the background dashboard.
- **Information Density:** High density is preferred. Use 8px spacing between related items in a list and 24px between distinct logical sections.

## Elevation & Depth
Depth is conveyed through **Tonal Layering** rather than traditional shadows, ensuring clarity in high-contrast or Night Shift modes.

- **Level 0 (Background):** Pure black or `#0A0C11`. Used for the root canvas.
- **Level 1 (Surface):** `#14171E`. Used for cards, input fields, and secondary navigation.
- **Level 2 (Active):** `#1C202B`. Used for hovered states or active selection cards.
- **Outlines:** Instead of soft shadows, use 1px solid borders (color: `#232833`) to define the perimeter of interactive cards. In Night Shift mode, these borders shift to a low-opacity Amber.

## Shapes
The "Rounded-Rectangle-Everything" philosophy is core to the visual identity. While the brand is technical, the large radii prevent it from feeling aggressive or overly clinical.

- **Large Sheets:** 32px (used for main app containers and modals).
- **Cards/Modules:** 28px (the standard unit for dashboard items).
- **Small Elements:** 12px (buttons, inputs, and chips).
- **Strict Rule:** No sharp corners. Every boundary must be curved to maintain the system's "fluid-tech" signature.

## Components
- **Buttons:** Primary buttons are solid Purple or Blue with black text (JetBrains Mono, Bold). Secondary buttons use an outline style with the same 12px radius.
- **Interactive Cards:** 28px radius. Cards should include a "Two-Tone" headline and a JetBrains Mono stat in the top-right corner.
- **Input Fields:** Darker than the surface background with a 1px border that glows (Purple) when focused. Labels should use `label-caps` in JetBrains Mono.
- **State Check Chips:** Small, pill-shaped triggers with high-contrast text. Used for quick-logging reality checks.
- **Journal Lists:** High-density rows with 4px vertical spacing. Use monospaced timestamps on the left-hand margin to create a "Log" aesthetic.
- **The "Lucidity" Toggle:** A custom, oversized switch component using the 28px card radius, transitioning from Surface Gray to Primary Purple when activated.