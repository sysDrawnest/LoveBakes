# 🎨 LoveBakes Design System

## 🎨 Color Palette

| Role | Hex Code | Usage |
|------|----------|-------|
| **Sweet Pink** | `#E85D75` | Primary actions, brand accents, highlights, error states |
| **Bitter Chocolate** | `#3B2A25` | Primary text, headings, dark elements |
| **Soft Terracotta** | `#D4705A` | Secondary buttons, focus states, hover effects |
| **Golden Tan** | `#C9A27E` | Input borders, icons, subtle dividers |
| **Champagne Cream** | `#FFF7F2` | Page backgrounds, card surfaces, form backgrounds |
| **Burnt Sienna** | `#A07060` | Labels, secondary metadata, placeholders |
| **White** | `#FFFFFF` | Tab backgrounds, card highlights |
| **Error Red** | `#C0392B` | Error messages, validation borders |

### Gradient Variations

```css
/* Primary Button Gradient */
linear-gradient(135deg, #E8866A 0%, #D4605A 100%)

/* Tab Active Gradient */
linear-gradient(135deg, #E8866A, #D4605A)
```

---

## 🖋️ Typography

### Font Pairing

| Role | Font Family | Style | Usage |
|------|-------------|-------|-------|
| **Headings & Brand** | `Playfair Display` | Serif, high-contrast | Logo, main titles, elegant accents |
| **UI & Body** | `DM Sans` | Sans-serif, geometric | Inputs, buttons, body text, labels |
| **Fallback** | `Public Sans` | Sans-serif | Global default body text |

### Font Sizes

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Logo | 30px | 700 | 1.2 |
| Section Title | 13.5px | 400 | 1.5 |
| Label | 11px | 700 | 1.2 |
| Input Text | 14px | 400 | 1.5 |
| Button Text | 14.5px | 700 | 1.5 |
| Error Message | 11-13px | 400 | 1.4 |

### Letter Spacing

- Labels: `0.14em` (uppercase)
- Buttons: `0.01em`

---

## ✨ Visual Effects

### Glassmorphism (Frosted Glass)

```css
background: rgba(255, 251, 248, 0.82);
backdrop-filter: blur(22px) saturate(1.4);
border: 1px solid rgba(255, 235, 220, 0.7);
```

### Shadows

```css
/* Card Shadow */
box-shadow: 
  0 8px 48px rgba(160, 100, 70, 0.13),
  0 2px 12px rgba(160, 100, 70, 0.08),
  inset 0 1px 0 rgba(255, 255, 255, 0.9);

/* Button Shadow */
box-shadow: 0 6px 24px rgba(212, 96, 90, 0.38);
```

### Borders & Radius

| Element | Border Radius | Border Style |
|---------|---------------|--------------|
| Card | 32px | 1px solid rgba(255,235,220,0.7) |
| Input | 12px | 1.5px solid #E8D0C4 |
| Button | 14px | None |
| Tab Pills | 50px | None |

### Focus States

```css
input:focus {
  border-color: #D4785A !important;
  box-shadow: 0 0 0 3px rgba(212, 120, 90, 0.13) !important;
  background: rgba(255, 255, 255, 0.98) !important;
}
```

---

## 🎭 Animation & Motion

### Framer Motion Variants

| Animation | Duration | Easing |
|-----------|----------|--------|
| Card Entrance | 0.55s | `[0.22, 1, 0.36, 1]` |
| Tab Switch | Spring | stiffness 420, damping 32 |
| Button Hover | 0.2s | `scale(1.02)` |
| Button Tap | 0.2s | `scale(0.97)` |

### Keyframe Animations

```css
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(8deg); }
}
```

### Transition Defaults

- Standard: `all 0.2s`
- Tab Background: `transform 0.25s`

---

## 📐 Spacing & Layout

### Component Spacing

| Element | Value |
|---------|-------|
| Card Padding | 36px 34px 32px |
| Input Padding | 14px (vertical), 44px (left) |
| Button Padding | 16px |
| Field Margin Bottom | 18px |
| Tab Container Margin | 26px |
| Divider Margin | 22px 0 |

### Maximum Widths

- Card: `420px`
- Tab Container: `320px`
- Buttons: `100%`

### Responsive Margins

- Card Margin: `20px`

---

## 🧩 Component Styles

### Input Fields

```css
background: rgba(255, 252, 250, 0.85);
backdrop-filter: blur(4px);
border-radius: 12px;
padding: 14px 42px 14px 44px;
```

### Icons

- Size: `16px` (standard), `20px` (material)
- Positioning: Absolute, left: 14px, top: 50%
- Colors: `#C9A27E` (default), `#E85D75` (error)

### Buttons

| State | Opacity/Effect |
|-------|----------------|
| Default | 100% |
| Hover | `scale(1.02)`, y: -2px |
| Active | `scale(0.97)` |
| Disabled | `opacity: 0.45`, cursor: not-allowed |

### Dividers

```css
background: linear-gradient(90deg, transparent, #E8CABB);
height: 1px;
```

---

## 🌐 3D Background (Hearts)

### Physics Properties

| Property | Value |
|----------|-------|
| Heart Count | 158 |
| Gravity | 0.32 |
| Friction | 0.993 |
| Wall Bounce | 0.94 |
| Max Velocity | 0.21 |

### Heart Colors

```javascript
[0xcc7b8c, 0xb85c6f, 0xdd9bb0, 0xc97e92, 0xaa5e72, 0xe6aabb, 0xffb7c5]
```

### Material Properties

```javascript
{
  metalness: 0.55,
  roughness: 0.28,
  clearcoat: 0.85,
  clearcoatRoughness: 0.2,
  emissiveIntensity: 0.18
}
```

---

## 📦 Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-primary: #E85D75;
  --color-secondary: #D4705A;
  --color-text-primary: #3B2A25;
  --color-text-secondary: #A07060;
  --color-border: #E8D0C4;
  --color-background: #FFF7F2;
  
  /* Spacing */
  --spacing-xs: 8px;
  --spacing-sm: 16px;
  --spacing-md: 24px;
  --spacing-lg: 32px;
  --spacing-xl: 48px;
  
  /* Border Radius */
  --radius-sm: 12px;
  --radius-md: 14px;
  --radius-lg: 32px;
  --radius-full: 50px;
  
  /* Shadows */
  --shadow-card: 0 8px 48px rgba(160,100,70,0.13);
  --shadow-button: 0 6px 24px rgba(212,96,90,0.38);
}
```

---
