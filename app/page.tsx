---
name: Lava & Cobalt Technical
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#e7bdb2'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#ad887e'
  outline-variant: '#5d4038'
  surface-tint: '#ffb5a0'
  primary: '#ffb5a0'
  on-primary: '#601400'
  primary-container: '#ff5625'
  on-primary-container: '#541100'
  inverse-primary: '#b12d00'
  secondary: '#b1c5ff'
  on-secondary: '#002c70'
  secondary-container: '#0148ab'
  on-secondary-container: '#a6beff'
  tertiary: '#b9c8de'
  on-tertiary: '#233143'
  tertiary-container: '#8392a6'
  on-tertiary-container: '#1c2b3c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbd1'
  primary-fixed-dim: '#ffb5a0'
  on-primary-fixed: '#3b0900'
  on-primary-fixed-variant: '#872000'
  secondary-fixed: '#dae2ff'
  secondary-fixed-dim: '#b1c5ff'
  on-secondary-fixed: '#001946'
  on-secondary-fixed-variant: '#00419e'
  tertiary-fixed: '#d4e4fa'
  tertiary-fixed-dim: '#b9c8de'
  on-tertiary-fixed: '#0d1c2d'
  on-tertiary-fixed-variant: '#39485a'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.08em
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1440px
---

## Brand & Style

This design system is engineered for high-performance environments where speed, precision, and clarity are paramount. The aesthetic merges **Industrial Minimalism** with **High-Contrast Digital Accents**, creating a high-energy "Lava & Cobalt" workspace. 

The target audience consists of power users—developers, data scientists, and engineers—who require a UI that feels like a sophisticated instrument. The emotional response is one of controlled intensity: the "Lava" orange provides urgent focus, while the "Cobalt" and slate foundation offer a stable, professional environment for deep work. The style utilizes sharp edges, technical monospaced details, and a strict adherence to a "form-follows-function" philosophy.

## Colors

The palette is built on a "Thermal & Cold" contrast strategy. 

- **Primary (Lava):** A high-energy `#FF4500` used exclusively for primary actions, critical alerts, and active state indicators. It should be used sparingly to maintain its psychological impact.
- **Secondary (Cobalt):** A deep `#0047AB` used for secondary interactions, structural branding, and informative highlights. It provides a professional anchor to the heat of the primary orange.
- **Accents (Silver/Grey):** High-clarity greys (`#E2E8F0` and `#94A3B8`) are used for iconography, borders, and secondary text, ensuring legibility against the dark background.
- **Foundation (Deep Slate):** The surface colors use a near-black slate (`#020617`) to minimize eye strain and maximize the vibrance of the functional colors.

## Typography

The typography system is split between two high-performance typefaces. **Geist** handles the structural hierarchy, providing a clean, neo-grotesque look that excels in legibility. **JetBrains Mono** is utilized for labels, metadata, and data-heavy strings to reinforce the technical, developer-centric nature of the interface.

All headings use tight tracking and bold weights to command attention. Labels are consistently uppercase or monospaced to differentiate them from prose. Line heights are kept tight to allow for high information density without sacrificing vertical rhythm.

## Layout & Spacing

This design system employs a **Modular Grid** based on a 4px base unit. This allows for the high-density layouts required in technical dashboards.

- **Desktop:** 12-column fluid grid with 16px gutters. Margins are fixed at 32px to create a contained, professional frame.
- **Tablet:** 8-column fluid grid with 16px gutters and 24px margins.
- **Mobile:** 4-column fluid grid with 12px gutters and 16px margins.

Spacing between functional groups should be aggressive and consistent. Use 16px (4 units) for standard padding and 32px (8 units) for section separation.

## Elevation & Depth

To maintain a "technical tool" feel, this design system avoids soft ambient shadows. Instead, it uses **Tonal Layering** and **High-Contrast Outlines**.

1.  **Level 0 (Base):** `#020617` — The deepest background.
2.  **Level 1 (Surface):** `#0F172A` — Used for cards and main containers.
3.  **Level 2 (Overlay):** `#1E293B` — Used for modals, menus, and hover states.

Hierarchy is reinforced with 1px borders using `#334155` (Slate 700). When an element is active or focused, the border transitions to the Primary Lava or Secondary Cobalt color to provide immediate visual feedback without the need for depth-based shadows.

## Shapes

The shape language is strictly **Sharp (0px)**. 

Every UI element—from buttons and input fields to cards and modals—features 90-degree corners. This evokes a sense of industrial precision and digital architecture. The lack of rounding allows for seamless alignment and "tiled" layouts that are common in sophisticated monitoring and IDE-style interfaces.

## Components

- **Buttons:** Primary buttons use a solid Lava (#FF4500) background with white or near-black text. Secondary buttons use a 1px Silver accent border with no fill. All buttons are rectangular with zero radius.
- **Inputs:** Text inputs feature a dark slate background with a 1px Slate-700 border. Upon focus, the border changes to Cobalt (#0047AB) with a subtle 2px solid offset ring of the same color.
- **Chips/Badges:** Small, monospaced labels using JetBrains Mono. Status badges use a "hollow" style: 1px border of the status color (Lava for error, Cobalt for info) with matching text color.
- **Lists:** High-density rows with 1px bottom borders. Hover states utilize a subtle background shift to `#1E293B`.
- **Cards:** No shadows. Cards are defined by their `#0F172A` surface color and 1px `#334155` border.
- **Data Tables:** Use JetBrains Mono for all cell data. Header cells use a slightly lighter slate background (`#1E293B`) to distinguish from the data rows.
- **Progress Indicators:** Linear only. Use a Cobalt track with a Lava indicator bar for high-visibility progress.
