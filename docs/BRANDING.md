# xNAT Car Wash Services - Brand Guidelines

## 🎨 Brand Identity

### Logo
The xNAT logo features a water droplet symbol representing cleanliness and freshness, combined with modern typography. The droplet includes sparkle effects to convey shine and quality.

**Logo Files:**
- `logo.svg` - Full color logo with text
- `favicon.svg` - Icon-only version for browser tabs

### Brand Name
**xNAT Car Wash Services**
- Primary: xNAT Car Wash
- Full: xNAT Car Wash Services
- Tagline: "Premium Car Care, Every Time"

## 🎨 Color Palette

### Primary Colors
- **Primary Blue**: `#2563eb` - Main brand color, trust and professionalism
- **Primary Dark**: `#1e40af` - Hover states and emphasis
- **Primary Light**: `#60a5fa` - Accents and highlights

### Secondary Colors
- **Secondary Blue**: `#0ea5e9` - Gradients and secondary actions
- **Accent Cyan**: `#06b6d4` - Special highlights

### Status Colors
- **Success Green**: `#10b981` - Completed, success states
- **Warning Orange**: `#f59e0b` - Pending, warnings
- **Error Red**: `#ef4444` - Cancelled, errors
- **Info Blue**: `#3b82f6` - In-progress, information

### Neutral Colors
- **Text Primary**: `#1e293b` - Main text
- **Text Secondary**: `#64748b` - Secondary text
- **Text Light**: `#94a3b8` - Disabled, placeholders
- **Background**: `#ffffff` - Main background
- **Background Secondary**: `#f8fafc` - Cards, sections
- **Border**: `#e2e8f0` - Borders, dividers

## 📐 Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
```

### Font Sizes
- **Headings**: 2em - 2.5em (32px - 40px)
- **Subheadings**: 1.5em - 2em (24px - 32px)
- **Body**: 14px - 16px
- **Small**: 12px - 14px
- **Tiny**: 11px - 12px

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## 🎭 Design Principles

### 1. Clean & Modern
- Minimalist design with ample white space
- Rounded corners (8px - 16px)
- Subtle shadows for depth
- Smooth transitions and animations

### 2. Interactive
- Hover effects on all clickable elements
- Smooth transitions (0.3s cubic-bezier)
- Visual feedback on interactions
- Animated gradients and effects

### 3. Professional
- Consistent spacing and alignment
- Clear visual hierarchy
- Professional color scheme
- High-quality iconography

### 4. Accessible
- High contrast ratios
- Clear focus states
- Readable font sizes
- Touch-friendly targets (44px minimum)

## 🎨 UI Components

### Buttons
```css
Primary: Linear gradient blue (#2563eb to #0ea5e9)
Secondary: Light gray (#f1f5f9)
Success: Green (#10b981)
Danger: Red (#ef4444)
Warning: Orange (#f59e0b)
```

### Cards
- Background: White
- Border radius: 12px
- Shadow: 0 4px 6px rgba(0,0,0,0.1)
- Hover: Elevated shadow

### Status Badges
- Rounded: 20px border radius
- Semi-transparent backgrounds
- Colored borders
- Uppercase text

### Inputs
- Border: 2px solid #e2e8f0
- Focus: Blue border with glow
- Border radius: 8px
- Padding: 14px 16px

## 🌊 Visual Effects

### Gradients
```css
Primary: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)
Background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

### Shadows
```css
Small: 0 1px 2px rgba(0,0,0,0.05)
Medium: 0 4px 6px rgba(0,0,0,0.1)
Large: 0 10px 15px rgba(0,0,0,0.1)
XLarge: 0 20px 25px rgba(0,0,0,0.1)
```

### Animations
- Fade in: 0.5s ease-out
- Slide in: 0.5s ease-out
- Hover lift: translateY(-2px)
- Button ripple effect
- Pulse animation for loading

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile-First Approach
- Start with mobile layout
- Progressive enhancement for larger screens
- Touch-friendly interactions
- Optimized performance

## 🎯 Brand Voice

### Tone
- Professional yet friendly
- Trustworthy and reliable
- Modern and innovative
- Customer-focused

### Messaging
- "Premium Car Care, Every Time"
- "Your Car Deserves the Best"
- "Shine Bright, Drive Happy"
- "Quality Service, Guaranteed"

## 📋 Usage Guidelines

### Logo Usage
✅ DO:
- Use on white or light backgrounds
- Maintain clear space around logo
- Use provided color versions
- Scale proportionally

❌ DON'T:
- Distort or stretch
- Change colors
- Add effects or shadows
- Place on busy backgrounds

### Color Usage
✅ DO:
- Use primary blue for main actions
- Use status colors consistently
- Maintain contrast ratios
- Test on different backgrounds

❌ DON'T:
- Mix too many colors
- Use low contrast combinations
- Override status color meanings
- Use colors inconsistently

## 🚀 Implementation

### CSS Variables
All colors and values are defined as CSS custom properties in `theme.css`:
```css
:root {
    --primary-color: #2563eb;
    --primary-dark: #1e40af;
    /* ... more variables */
}
```

### Component Classes
Reusable component classes available:
- `.btn`, `.btn-primary`, `.btn-secondary`
- `.card`, `.badge`
- `.input`, `.interactive`
- `.gradient-text`, `.glass`

### Animations
Pre-defined animations:
- `fadeIn`, `slideIn`, `pulse`, `shimmer`
- Apply with class: `.fade-in`, `.slide-in`

## 📞 Brand Applications

### Website
- Clean, modern interface
- Blue gradient headers
- White content areas
- Interactive elements

### Marketing
- Use logo prominently
- Emphasize water droplet symbol
- Highlight "xNAT" brand name
- Professional photography

### Customer Communications
- Email templates with brand colors
- SMS notifications with brand name
- Professional tone
- Clear call-to-actions

## 🎨 Design Assets

### Files Included
- `logo.svg` - Main logo
- `favicon.svg` - Browser icon
- `theme.css` - Theme variables and utilities
- `styles.css` - Component styles
- `admin.css` - Admin dashboard styles

### Future Assets Needed
- Social media graphics
- Email templates
- Business cards
- Vehicle wraps
- Signage designs
- Marketing materials

---

**Brand Version**: 1.0
**Last Updated**: 2026
**Contact**: xNAT Car Wash Services
