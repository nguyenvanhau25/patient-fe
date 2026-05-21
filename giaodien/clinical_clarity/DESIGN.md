---
name: Clinical Clarity
colors:
  surface: '#f8f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f6'
  surface-container: '#edeef0'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#191c1e'
  on-surface-variant: '#434654'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f3'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#0c56d0'
  primary: '#003d9b'
  on-primary: '#ffffff'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#b2c5ff'
  secondary: '#4f606f'
  on-secondary: '#ffffff'
  secondary-container: '#cfe2f3'
  on-secondary-container: '#536573'
  tertiary: '#004b58'
  on-tertiary: '#ffffff'
  tertiary-container: '#006476'
  on-tertiary-container: '#70e2ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#d2e5f6'
  secondary-fixed-dim: '#b6c9da'
  on-secondary-fixed: '#0a1d2a'
  on-secondary-fixed-variant: '#374957'
  tertiary-fixed: '#adecff'
  tertiary-fixed-dim: '#5dd6f3'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5d'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
typography:
  h1:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  h2:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  h3:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: '0'
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin: 32px
---

## Brand & Style
The design system is anchored in the principles of **Modern Corporate** aesthetics, specifically tailored for the healthcare sector. The primary goal is to foster a sense of "Clinical Trust"—a balance between rigorous professional standards and empathetic patient care. 

The visual language utilizes high-value whitespace to reduce cognitive load for medical staff, ensuring that critical patient data is never obscured by decorative elements. The style is characterized by precision, utilizing a systematic approach to density and hierarchy to ensure that the interface feels reliable, sterile (in a professional sense), and highly efficient.

## Colors
The palette is centered around "Medical Blue," a shade chosen for its associations with stability and institutional knowledge. 

- **Primary:** A deep, vibrant blue used for primary actions and brand presence.
- **Secondary:** A muted slate blue-grey for secondary UI elements and supporting icons.
- **Neutral:** A range of cool greys and off-whites that form the foundation of the interface, ensuring the "Medical Blue" stands out.
- **Status Colors:** High-saturation tones are reserved strictly for semantic feedback (Success, Warning, Error) to ensure immediate recognition of patient alerts or system statuses.

## Typography
This design system employs a dual-font strategy. **Manrope** is used for headings to provide a modern, refined, and approachable character. **Inter** is utilized for all body text, data points, and labels due to its exceptional legibility at small sizes and its systematic, utilitarian nature. 

Emphasis is placed on clear vertical rhythm. Data-heavy views like patient charts should primarily use `body-md` for legibility, while `label-caps` is reserved for table headers and section metadata to create a distinct visual anchor.

## Layout & Spacing
The layout follows a **Fixed Grid** model on large screens (1440px max-width) and transitions to a fluid model for smaller viewports. A 12-column system is used to organize complex medical dashboards.

Spacing is based on a 4px baseline grid. Generous internal padding (24px) within cards and containers is mandatory to maintain the "airy" feel and prevent information density from becoming overwhelming. Use `lg` (24px) spacing for major component grouping and `md` (16px) for internal element relationships.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** and extremely subtle **Ambient Shadows**. 

- **Level 0 (Background):** Using the Neutral-lightest color, this serves as the canvas.
- **Level 1 (Cards/Containers):** Pure white background with a 1px border of Neutral-medium and a soft, low-opacity shadow (Color: Primary-dark, Opacity: 4%, Blur: 12px, Y: 4px).
- **Level 2 (Modals/Popovers):** Higher contrast shadow to indicate temporary overlay (Opacity: 8%, Blur: 24px, Y: 12px).

This approach creates a clear hierarchy without the visual "noise" of heavy shadows, keeping the focus on the data.

## Shapes
The design system uses a **Soft** shape language. Standard components like buttons and input fields utilize a 4px (`0.25rem`) corner radius. Larger containers, such as patient information cards, use a 8px (`0.5rem`) radius. 

This subtle rounding strikes a balance: it is softer and more modern than sharp edges, yet maintains the structure and precision required for a professional medical tool.

## Components

### Tables (Data Grids)
Tables are the heart of patient management. 
- **Header:** Use `label-caps` with a subtle grey background and a 2px Primary-color bottom border on the active sorted column.
- **Rows:** Alternate row striping is discouraged; use subtle 1px dividers instead. Use a 4px left-border accent to indicate "Active" or "Selected" patients.

### Charts & Data Viz
- Use the status colors for indicators (e.g., Red for high blood pressure).
- Line charts should use a 2px stroke width with points highlighted only on hover.
- Background grid lines should be very faint (`#E1E4E8`).

### Cards
Cards are used to group related patient metrics (e.g., Vitals, Lab Results). 
- Every card must have a clear title in `h3`.
- Actions within cards (e.g., "View All") should be placed in the top right as text buttons.

### Status Indicators
- **Success (Checked-in/Healthy):** Green pill-shaped badges with low-opacity background fills.
- **Warning (Pending/Follow-up):** Amber accents for items requiring attention.
- **Error (Critical/Alert):** Red backgrounds for urgent vitals or missed dosages.

### Input Fields
Inputs use a white background with a 1px grey border. On focus, the border transitions to Primary Blue with a subtle 2px outer glow. Labels always sit above the input for maximum legibility in high-speed environments.