# HowItWorks Section Redesign Plan

## Overview
Redesign the HowItWorks section to display 4 steps with phone mockup UI screens, matching the reference design style.

## Current State vs Target State

### Current Implementation
- **3 steps** with icon-based cards
- Uses Lucide icons (Rocket, Users, Play)
- Card-based layout with gradient borders
- Horizontal connection line between steps
- Text descriptions only

### Target Implementation (from Reference Image)
- **4 steps** with phone mockup screens
- Actual UI screenshots displayed in phone frames
- Step numbers prominently displayed
- Clean, modern phone frame design
- Titles and descriptions below each phone mockup

## Available Assets
The project already has 4 step screen images ready:
- `/images/screens/step1_create.jpg` - Create step
- `/images/screens/step2_discover.jpg` - Discover step  
- `/images/screens/step3_book.jpg` - Book step
- `/images/screens/step4_grow.jpg` - Grow step

## Design Specifications

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│                    ┌───┐ Simple Process ┌───┐                  │
│                    How It Works                                │
│                                                                 │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐     │
│  │ Phone   │    │ Phone   │    │ Phone   │    │ Phone   │     │
│  │ Mockup  │    │ Mockup  │    │ Mockup  │    │ Mockup  │     │
│  │ Step 1  │    │ Step 2  │    │ Step 3  │    │ Step 4  │     │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘     │
│     01            02             03             04              │
│   Create        Discover         Book           Grow            │
│   Sign up      Find sports     Book slots     Track progress   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Phone Mockup Design
- Rounded rectangle frame with subtle border
- Notch/dynamic island at top
- Screen image inside the frame
- Subtle shadow for depth
- Hover animation effect

### Step Details

| Step | Number | Title | Description | Image |
|------|--------|-------|-------------|-------|
| 1 | 01 | Create | Sign up and create your sports profile | step1_create.jpg |
| 2 | 02 | Discover | Find sports activities near you | step2_discover.jpg |
| 3 | 03 | Book | Book slots and join events instantly | step3_book.jpg |
| 4 | 04 | Grow | Track progress and achieve your goals | step4_grow.jpg |

### Visual Styling

#### Phone Frame
- Border: 2px solid with subtle gradient
- Border radius: 32px (matches app design language)
- Inner screen area with rounded corners
- Optional notch/dynamic island element
- Box shadow for elevation effect

#### Step Number
- Large, bold typography
- Gradient text or accent color
- Positioned below phone mockup

#### Typography
- Step title: Bold, 18-20px
- Description: Regular, 14-16px, secondary text color
- Number: Extra bold, 48-64px, subtle/gradient

#### Colors
- Use existing CSS variables for consistency
- Accent orange for highlights
- Gradient accents matching brand colors

### Animations (GSAP)
- Staggered entrance animation for phone mockups
- Fade in + slide up effect
- ScrollTrigger for viewport-based activation
- Subtle hover scale on phone mockups

### Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| Mobile (<640px) | Single column, vertical stack |
| Tablet (640-1024px) | 2x2 grid |
| Desktop (>1024px) | 4 columns horizontal |

## Implementation Steps

1. **Update Step Data Structure**
   - Add 4th step
   - Include image path for each step
   - Update descriptions

2. **Create Phone Mockup Component**
   - Reusable phone frame component
   - Accept image source as prop
   - Include notch/dynamic island detail

3. **Redesign Layout**
   - Replace icon cards with phone mockups
   - Update grid to 4 columns on desktop
   - Implement responsive breakpoints

4. **Update Animations**
   - Adjust GSAP animations for new layout
   - Add hover effects on phone mockups

5. **Maintain CTA Section**
   - Keep existing bottom CTA
   - Update text if needed for 4 steps

## Code Changes Required

### File: `app/src/sections/HowItWorks.tsx`

```typescript
// New step structure
const steps = [
  {
    number: '01',
    title: 'Create',
    description: 'Sign up and create your sports profile in minutes',
    image: '/images/screens/step1_create.jpg',
  },
  {
    number: '02', 
    title: 'Discover',
    description: 'Find sports activities and events near you',
    image: '/images/screens/step2_discover.jpg',
  },
  {
    number: '03',
    title: 'Book',
    description: 'Book slots and join events instantly',
    image: '/images/screens/step3_book.jpg',
  },
  {
    number: '04',
    title: 'Grow',
    description: 'Track progress and achieve your sports goals',
    image: '/images/screens/step4_grow.jpg',
  },
];
```

### Phone Mockup Component (inline or separate)

```tsx
const PhoneMockup = ({ image, alt }: { image: string; alt: string }) => (
  <div className="phone-mockup">
    <div className="phone-frame">
      <div className="phone-notch" />
      <img src={image} alt={alt} className="phone-screen" />
    </div>
  </div>
);
```

## Questions for Clarification

1. Should the phone mockups have a notch/dynamic island like modern iPhones?
2. Should there be any connecting elements between steps (like the current line)?
3. Do you want to keep the bottom CTA section as-is or modify it?
4. Should the phone mockups be clickable/interactive in any way?
