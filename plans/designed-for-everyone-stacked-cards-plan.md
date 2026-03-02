# Designed For Everyone - Stacked Cards Redesign Plan

## Overview

Redesign the "Designed For Everyone" section on the home page to use a stacked cards animation style similar to the provided React Native code, while preserving the existing content (text and images).

## User Requirements

1. **No Badge** - Remove the "250ML" badge entirely from cards
2. **Scroll-Based Reveal Animation** - Cards animate based on scroll direction:
   - Scroll UP → Cards rise + fade in
   - Scroll DOWN → Cards drop + fade out
   - Smooth ease-in-out transitions
   - Slight scale effect (optional)
3. **Swipe Gesture** - Implement touch swipe/drag to change cards on mobile devices

## Current Implementation Analysis

### Existing Component: [`DesignedForEveryone.tsx`](app/src/sections/DesignedForEveryone.tsx)

**Current Features:**
- Tab/pill navigation with 6 segments
- Single card display with image on left, content on right
- GSAP fade-in animations
- Benefits displayed in a 2-column grid

**Existing Content (to be preserved):**

| Segment | Image | Color | CTA |
|---------|-------|-------|-----|
| Athletes & Enthusiasts | `/images/athletes_segment_bg.jpg` | `#f97316` (orange) | Join as Athlete |
| Tournaments & Events | `/images/organizers_segment_bg.jpg` | `#3b82f6` (blue) | Book Your Event |
| Facility Owners | `/images/facilities_segment_bg.jpg` | `#10b981` (green) | List Your Facility |
| Coaches & Trainers | `/images/coaches_segment_bg.jpg` | `#8b5cf6` (purple) | Join as Coach |
| Corporate & Communities | `/images/corporate_segment_bg.jpg` | `#ec4899` (pink) | Explore Solutions |
| Brands & Sponsors | `/images/sponsors_segment_bg.jpg` | `#f43f5e` (rose) | Contact Us |

## Target Design: Stacked Cards Animation

### Visual Behavior (from provided code)

```
┌─────────────────────────────────────────────────────────────┐
│                  DESIGNED FOR EVERYONE                       │
├─────────────────────────────────────────────────────────────┤
│  [Athletes] [Tournaments] [Facility] [Coaches] [Corporate]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│     ┌───────────────────────────────────────┐               │
│     │  Card 3 (back) - scaled down, offset  │               │
│     └───────────────────────────────────────┘               │
│       ┌───────────────────────────────────────┐             │
│       │  Card 2 - slightly scaled, offset     │             │
│       └───────────────────────────────────────┘             │
│         ┌───────────────────────────────────────┐           │
│         │  Card 1 (active) - full size          │           │
│         │  ┌──────────┬──────────────────────┐  │           │
│         │  │  TEXT    │      IMAGE           │  │           │
│         │  │  SIDE    │      SIDE            │  │           │
│         │  │          │                      │  │           │
│         │  └──────────┴──────────────────────┘  │           │
│         └───────────────────────────────────────┘           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Animation Properties

| Property | Active Card | Card Behind | Further Back |
|----------|-------------|-------------|--------------|
| translateY | 0px | 40px | 80px |
| scale | 1.0 | 0.95 | 0.90 |
| opacity | 1.0 | 0.8 | 0.6 |
| zIndex | highest | middle | lowest |

## Implementation Plan

### 1. Component Structure

```
DesignedForEveryone.tsx
├── Header Section
│   └── Title: "DESIGNED FOR EVERYONE"
├── Pills Navigation
│   └── Horizontal scrollable category buttons
├── Cards Stack Container
│   └── StackedCardsCarousel
│       ├── Card (index 0 - active)
│       ├── Card (index 1 - behind)
│       └── Card (index 2 - back)
└── Navigation Controls (optional)
    ├── Prev/Next buttons
    └── Dot indicators
```

### 2. Card Layout Design

Each card will have a horizontal split layout:

```
┌─────────────────────────────────────────────────────────────┐
│  ┌─────────────────────┬─────────────────────────────────┐  │
│  │     TEXT SECTION    │         IMAGE SECTION           │  │
│  │                     │                                 │  │
│  │  [Badge: 250ML]     │                                 │  │
│  │                     │      ┌─────────────────┐        │  │
│  │  TITLE              │      │                 │        │  │
│  │  KEY BENEFITS       │      │   Background    │        │  │
│  │                     │      │   Image         │        │  │
│  │  • Feature 1        │      │                 │        │  │
│  │  • Feature 2        │      │                 │        │  │
│  │  • Feature 3        │      └─────────────────┘        │  │
│  │  • Feature 4        │                                 │  │
│  │                     │   ← Gradient overlay            │  │
│  │  [LEARN MORE →]     │                                 │  │
│  └─────────────────────┴─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 3. Web Animation Approach

Since this is a React web app (not React Native), we'll use:

- **CSS Transforms** for translateY, scale
- **CSS Transitions** for smooth animations
- **React State** for active card tracking
- **Optional: GSAP** for enhanced animations (already imported)

#### CSS Animation Properties

```css
.card {
  position: absolute;
  transition: all 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
  border-radius: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.card[data-position="0"] {
  transform: translateY(0) scale(1);
  opacity: 1;
  z-index: 3;
}

.card[data-position="1"] {
  transform: translateY(40px) scale(0.95);
  opacity: 0.8;
  z-index: 2;
}

.card[data-position="2"] {
  transform: translateY(80px) scale(0.9);
  opacity: 0.6;
  z-index: 1;
}
```

### 4. Data Mapping

Map existing segment data to new card structure:

```typescript
interface CardData {
  id: string;
  title: string;           // segment.title
  subtitle: string;        // "KEY BENEFITS"
  description: string;     // Optional tagline
  image: string;           // segment.image
  features: Feature[];     // segment.benefits
  cta: string;             // segment.cta
  bgColor: string;         // segment.color
  textColor: string;       // '#000000' or '#FFFFFF' based on bg
  link: string;            // segment.link
}

interface Feature {
  icon: LucideIcon;        // benefit.icon
  title: string;           // benefit.text
  desc: string;            // benefit.subtext
}
```

### 5. Interaction Patterns

1. **Pill Click**: Immediately switch to that card with animation
2. **Card Click**: If not active, make it active
3. **Swipe/Drag**: Optional - drag to change cards
4. **Keyboard**: Arrow keys to navigate

### 6. Responsive Design

| Breakpoint | Card Width | Layout |
|------------|------------|--------|
| Mobile (<640px) | 95vw | Stack vertically, image on top |
| Tablet (640-1024px) | 90vw | Horizontal split |
| Desktop (>1024px) | 80vw max | Horizontal split |

## Implementation Steps

### Step 1: Create Card Component
- Build individual card with horizontal layout
- Text section on left (60%), image on right (40%)
- Feature items with icons
- CTA button

### Step 2: Create Stack Container
- Position cards absolutely
- Calculate positions based on active index
- Apply transforms via CSS

### Step 3: Add Navigation
- Pills at top for category selection
- Optional prev/next buttons
- Dot indicators

### Step 4: Add Animations
- Smooth transitions between cards
- Spring-like easing
- Stagger animations for features

### Step 5: Responsive Adjustments
- Mobile-first approach
- Adjust card sizing and layout
- Touch-friendly interactions

## File Changes Required

| File | Action | Description |
|------|--------|-------------|
| `app/src/sections/DesignedForEveryone.tsx` | Rewrite | Complete redesign with stacked cards |
| `app/src/index.css` | Modify | Add card animation styles (optional) |

## Code Structure Preview

```tsx
// DesignedForEveryone.tsx
const DesignedForEveryone = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Existing segments data (preserved)
  const segments = [...];
  
  return (
    <section className="py-24 bg-[var(--bg-primary)]">
      {/* Header */}
      <h2>DESIGNED FOR EVERYONE</h2>
      
      {/* Pills Navigation */}
      <div className="flex gap-3 overflow-x-auto">
        {segments.map((segment, idx) => (
          <Pill 
            key={idx}
            active={activeIndex === idx}
            onClick={() => setActiveIndex(idx)}
          />
        ))}
      </div>
      
      {/* Stacked Cards */}
      <div className="relative h-[65vh]">
        {segments.map((segment, idx) => (
          <Card
            key={idx}
            data={segment}
            position={idx - activeIndex}
            onClick={() => setActiveIndex(idx)}
          />
        ))}
      </div>
    </section>
  );
};
```

## Visual Reference

The animation should feel like cards sliding over each other:

```
Initial State:
  Card 0 (active) ← visible
  Card 1 (behind) ← partially visible
  Card 2 (back)   ← slightly visible

After clicking "Tournaments":
  Card 0 slides down and scales down
  Card 1 slides up and becomes active
  Card 2 moves up one position
```

## User Requirements (Confirmed)

1. **Badge**: Remove entirely - no badge needed on cards
2. **Scroll-Based Animation**: Cards animate based on scroll direction:
   - Scroll UP → Cards rise + fade in
   - Scroll DOWN → Cards drop + fade out
   - Smooth ease-in-out transitions with slight scale effect
3. **Swipe Gesture**: Implement touch swipe/drag for mobile devices

## Scroll-Based Animation Implementation

### GSAP ScrollTrigger Integration

```typescript
useEffect(() => {
  const ctx = gsap.context(() => {
    // Card reveal on scroll
    gsap.fromTo('.stacked-card',
      { y: 100, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play reverse play reverse'
        }
      }
    );
  }, containerRef);
  
  return () => ctx.revert();
}, []);
```

### Animation States by Scroll Direction

| Scroll Direction | Card Action | Animation |
|------------------|-------------|-----------|
| Scrolling UP | Cards reveal | translateY: 100→0, opacity: 0→1, scale: 0.95→1 |
| Scrolling DOWN | Cards hide | translateY: 0→100, opacity: 1→0, scale: 1→0.95 |

## Touch Swipe Implementation

```typescript
// Touch handlers for mobile swipe
const touchStartY = useRef(0);

const handleTouchStart = (e: React.TouchEvent) => {
  touchStartY.current = e.touches[0].clientY;
};

const handleTouchEnd = (e: React.TouchEvent) => {
  const touchEndY = e.changedTouches[0].clientY;
  const diff = touchStartY.current - touchEndY;
  
  if (Math.abs(diff) > 50) { // 50px threshold
    if (diff > 0) {
      // Swipe up - next card
      setActiveIndex(prev => Math.min(prev + 1, segments.length - 1));
    } else {
      // Swipe down - previous card
      setActiveIndex(prev => Math.max(prev - 1, 0));
    }
  }
};
```

---

## Next Steps

1. Review and approve this plan
2. Switch to Code mode for implementation
3. Test responsive behavior
4. Fine-tune animations
