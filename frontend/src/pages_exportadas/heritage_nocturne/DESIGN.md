---
name: Heritage Nocturne
colors:
  surface: '#161310'
  surface-dim: '#161310'
  surface-bright: '#3c3835'
  surface-container-lowest: '#100e0b'
  surface-container-low: '#1e1b18'
  surface-container: '#221f1c'
  surface-container-high: '#2d2926'
  surface-container-highest: '#383431'
  on-surface: '#e9e1dc'
  on-surface-variant: '#d2c5b1'
  inverse-surface: '#e9e1dc'
  inverse-on-surface: '#33302c'
  outline: '#9b8f7d'
  outline-variant: '#4e4637'
  surface-tint: '#f0bf5c'
  primary: '#f0bf5c'
  on-primary: '#412d00'
  primary-container: '#c89b3c'
  on-primary-container: '#4b3500'
  inverse-primary: '#7b5900'
  secondary: '#ffb0cc'
  on-secondary: '#640038'
  secondary-container: '#b40068'
  on-secondary-container: '#ffc5d8'
  tertiary: '#a9c7ff'
  on-tertiary: '#003063'
  tertiary-container: '#7ea3e3'
  on-tertiary-container: '#033871'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdea4'
  primary-fixed-dim: '#f0bf5c'
  on-primary-fixed: '#261900'
  on-primary-fixed-variant: '#5d4200'
  secondary-fixed: '#ffd9e4'
  secondary-fixed-dim: '#ffb0cc'
  on-secondary-fixed: '#3e0020'
  on-secondary-fixed-variant: '#8d0051'
  tertiary-fixed: '#d6e3ff'
  tertiary-fixed-dim: '#a9c7ff'
  on-tertiary-fixed: '#001b3d'
  on-tertiary-fixed-variant: '#1b4680'
  background: '#161310'
  on-background: '#e9e1dc'
  surface-variant: '#383431'
typography:
  display-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  title-md:
    fontFamily: Be Vietnam Pro
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
This design system represents a premium, high-end social media experience rooted in cultural depth and modern sophistication. The aesthetic is "Warm Minimalist Dark Mode," eschewing the cold, clinical feel of traditional tech interfaces in favor of a rich, tactile atmosphere.

The target audience consists of discerning creators and cultural curators who value heritage and premium craftsmanship. The UI should evoke a sense of "digital velvet"—smooth, deep, and inviting. We achieve this through a mixture of **Minimalism** and **Glassmorphism**, utilizing subtle background blurs and warm-toned surfaces to create layers of depth that feel physical rather than purely digital.

## Colors
The palette is centered on a deep, warm charcoal (#1A1714) that serves as the foundation, providing more soul and "heat" than a standard black. 

- **Primary (Heritage Gold):** Used for primary actions, branding, and premium status indicators.
- **Secondary (Vibrant Pulse):** Used sparingly for active states, notifications, and moments of high energy.
- **Neutral/Surface:** We use a stepped approach to dark tones. The base is clay-charcoal, while elevated surfaces move toward a lighter, warmer earth tone (#25211E).
- **Typography:** Contrast is maintained through "Antique White" (#F5F2F0) for maximum legibility and "Stone Grey" (#A8A29E) for secondary metadata.

## Typography
The typography utilizes **Be Vietnam Pro** across all levels to maintain a friendly yet contemporary and professional appearance. The weight distribution is intentional: heavy headlines provide a sense of authority and "editorial" flair, while body text remains light and airy to ensure readability against the dark background.

For mobile, large display type should scale down aggressively to prevent awkward line breaks, while body sizes remain constant to preserve accessibility. Label styles should use medium to semi-bold weights to remain legible even when rendered in the secondary text color.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a base 4px rhythm. 

- **Desktop:** A 12-column grid with generous 64px outside margins to create a high-end, gallery-like feel. 
- **Mobile:** A 4-column grid with 16px margins.
- **Philosophy:** Emphasize "Negative Space." By allowing elements to breathe, we reinforce the premium nature of the content. Content should reflow vertically on mobile, but maintain horizontal padding consistent with the 16px margin rule.

## Elevation & Depth
Depth is created through **Tonal Layering** and **Subtle Glassmorphism** rather than heavy shadows.

1.  **Base (Level 0):** The warm charcoal (#1A1714) background.
2.  **Raised (Level 1):** The primary surface color (#25211E). Use this for feed items and cards.
3.  **Overlay (Level 2):** Use a semi-transparent version of the surface color (80% opacity) with a 20px backdrop blur for navigation bars and floating menus.
4.  **Accents:** Instead of shadows, use a 1px inner stroke of a slightly lighter clay tone to "lift" elements. For active or focused states, a very soft, diffused glow in the Primary Gold color (10% opacity) may be used.

## Shapes
The shape language is **Rounded**, striking a balance between organic warmth and modern precision. 

- **Standard Elements:** Buttons, input fields, and cards use a 0.5rem (8px) radius.
- **Large Containers:** Hero sections or large gallery cards use a 1.5rem (24px) radius to emphasize a soft, approachable feel.
- **Icons:** Use rounded caps and corners for all iconography to match the UI's geometry.

## Components

- **Buttons:** 
  - *Primary:* Heritage Gold background with dark charcoal text. No border.
  - *Secondary:* Transparent background with a 1px Heritage Gold border and Gold text.
- **Cards:** Background is #25211E. No outer shadow; instead, use a 1px stroke of #332D29 for definition.
- **Inputs:** Darker than the surface (#1E1B18) with a 1px border that glows Heritage Gold upon focus.
- **Chips:** Small, pill-shaped elements with a secondary text color background (at 15% opacity) to provide a subtle "tag" look without distracting from the main content.
- **Lists:** Separated by thin, low-contrast dividers (#2D2824).
- **Interactive States:** Use the Instagram Pink (#FF4FA2) for high-action toggles (like "Heart/Like" buttons) and active tab indicators to provide a modern, social-first spark of color.