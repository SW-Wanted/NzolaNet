---
name: Nzola Heritage
colors:
  surface: '#fff8f5'
  surface-dim: '#e3d8d3'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fdf1ec'
  surface-container: '#f7ece6'
  surface-container-high: '#f1e6e1'
  surface-container-highest: '#ebe0db'
  on-surface: '#201b18'
  on-surface-variant: '#4e4637'
  inverse-surface: '#352f2c'
  inverse-on-surface: '#faeee9'
  outline: '#807665'
  outline-variant: '#d2c5b1'
  surface-tint: '#7b5900'
  primary: '#7b5900'
  on-primary: '#ffffff'
  primary-container: '#c89b3c'
  on-primary-container: '#4b3500'
  inverse-primary: '#f0bf5c'
  secondary: '#b7056b'
  on-secondary: '#ffffff'
  secondary-container: '#fe4ea2'
  on-secondary-container: '#5c0033'
  tertiary: '#87512c'
  on-tertiary: '#ffffff'
  tertiary-container: '#d59369'
  on-tertiary-container: '#592c0a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdea4'
  primary-fixed-dim: '#f0bf5c'
  on-primary-fixed: '#261900'
  on-primary-fixed-variant: '#5d4200'
  secondary-fixed: '#ffd9e4'
  secondary-fixed-dim: '#ffb0cc'
  on-secondary-fixed: '#3e0020'
  on-secondary-fixed-variant: '#8d0051'
  tertiary-fixed: '#ffdbc7'
  tertiary-fixed-dim: '#feb78a'
  on-tertiary-fixed: '#311300'
  on-tertiary-fixed-variant: '#6b3a17'
  background: '#fff8f5'
  on-background: '#201b18'
  surface-variant: '#ebe0db'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 40px
  max-width: 1200px
---

## Brand & Style
The design system is a "Light Premium" framework designed for a modern Angolan social network. It harmonizes deep African heritage with the technical precision of global social platforms. The brand personality is warm, human, and sophisticated, evoking the feeling of a sun-drenched afternoon in Luanda—stable, welcoming, and high-fidelity.

The aesthetic blends **Modern Minimalism** with **Glassmorphism**. It utilizes heavy whitespace to create a "breathable" luxury experience, while translucent layers and subtle blurs provide a sense of depth and modernity. Minimalist African patterns (inspired by Samakaka and Mwana Pwo masks) are used sparingly as low-opacity watermarks or textures to anchor the digital experience in physical culture.

## Colors
This design system uses a palette rooted in natural Angolan elements—Clay (Argila), Earth, and Sun. 

- **The Foundation:** The main background (#F6F1EA) provides a warm, paper-like warmth that is easier on the eyes than pure white, while the card surfaces (#FFFDF9) create a crisp, elevated layer.
- **The Accents:** Gold (#C89B3C) is the primary signal for wealth, premium states, and verified milestones. Instagram Pink (#FF4FA2) and Soft Orange (#FF7A59) are used for high-energy interactions: notification badges, active story rings, and Call-to-Action buttons.
- **Text:** Primary text uses an "Earth Black" (#1F1A17) to maintain high contrast without the harshness of pure #000.

## Typography
The system utilizes **Plus Jakarta Sans** for all levels. Its soft, geometric curves reflect the friendly and approachable nature of the social network while maintaining a precise, professional edge.

- **Headlines:** Use Bold (700) and SemiBold (600) weights with slightly tight letter spacing for a modern, editorial look.
- **Body:** Uses Regular (400) weight with generous line height to ensure readability in long-form posts or comments.
- **Labels:** Use Medium (500) or SemiBold (600) with increased letter spacing and uppercase styling for small metadata (e.g., timestamps, location tags) to ensure they feel distinct from the body text.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop and a **Fluid Grid** on mobile.

- **Desktop:** 12-column grid centered in a 1200px container. Large 40px outer margins create a "premium" sense of space.
- **Mobile:** 4-column grid with 16px margins and 12px gutters.
- **Rhythm:** All spacing (padding, margins, component heights) must be multiples of the 4px base unit. 
- **Content Flow:** Feed items should have a maximum width of 680px to maintain optimal reading line lengths, with supplementary info (suggestions, trending) placed in a secondary side rail.

## Elevation & Depth
Depth is achieved through **Tonal Layers** and **Ambient Shadows**.

1.  **Level 0 (Canvas):** The #F6F1EA background.
2.  **Level 1 (Cards):** Surface-white (#FFFFFF) with a very soft, diffused shadow: `0px 4px 20px rgba(60, 40, 20, 0.04)`.
3.  **Level 2 (Popovers/Modals):** Glassmorphism effect using `backdrop-filter: blur(12px)` and `background: rgba(255, 255, 255, 0.8)`. Outlined with a 1px border of `rgba(60, 40, 20, 0.08)`.
4.  **Level 3 (High-priority Overlays):** Larger shadow depth: `0px 12px 40px rgba(60, 40, 20, 0.12)`.

Avoid heavy black shadows; always tint shadows with the Earth/Neutral color to maintain the warm, organic feel.

## Shapes
The shape language is **Rounded**, reflecting human warmth and friendliness.

- **Standard Components:** Buttons, input fields, and small cards use a 0.5rem (8px) radius.
- **Large Containers:** Feed cards and profile headers use "rounded-lg" at 1rem (16px).
- **Interactive Elements:** Story rings and specific CTA buttons may use "rounded-xl" (24px) or full pill shapes to signify high interactivity.
- **Image Treatment:** Media in the feed should always carry the 12px or 16px radius to match the container.

## Components

- **Buttons:** 
  - *Primary:* Gold (#C89B3C) background with White text.
  - *Secondary:* Transparent with the Earth Black border and text.
  - *Premium:* Gradient from #FF4FA2 to #D946EF for "Nzola Market" or high-tier actions.
- **Input Fields:** Soft clay background (#EFE7DC) with no border in the resting state; moves to a white background with a Gold focus ring upon interaction.
- **Chips/Tags:** Used for "Kizomba," "ArteAngolana," etc. Use a light semi-transparent Gold or Pink background with slightly darker text for high legibility.
- **Cards:** White surfaces with 16px padding. Titles are always Earth Black (#1F1A17) in SemiBold.
- **Bazes (Likes):** A unique heart icon variant with heritage-inspired internal patterns. When active, it pulses with the Instagram Pink (#FF4FA2) glow.
- **Navigation:** Bottom bar for mobile and side rail for desktop. Icons use Earth Black with active states highlighted in Gold.