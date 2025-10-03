# Pharmacy Management System - Design Guidelines

## Design Approach
**Design System**: Material Design-inspired approach
**Rationale**: Healthcare utility application requiring clarity, data density, and trust. Material Design's emphasis on clear hierarchy, feedback systems, and structured layouts aligns perfectly with pharmacy management needs.

## Core Design Elements

### Color Palette

**Light Mode:**
- Primary: 219 95% 50% (Medical Blue - trust and professionalism)
- Primary Light: 219 95% 95% (Backgrounds, hover states)
- Success: 142 76% 36% (Stock OK indicators)
- Warning: 38 92% 50% (Low stock alerts)
- Error: 0 84% 60% (Expiry alerts)
- Neutral Gray: 220 9% 46% (Text, borders)
- Background: 0 0% 98%
- Surface: 0 0% 100%

**Dark Mode:**
- Primary: 219 95% 60%
- Background: 220 18% 12%
- Surface: 220 18% 16%
- Text: 0 0% 95%

### Typography
**Font Family**: Inter (Google Fonts) for exceptional readability in data-heavy contexts
- Headings: 600-700 weight, sizes from text-2xl to text-4xl
- Body: 400 weight, text-sm to text-base
- Data/Numbers: 500-600 weight for emphasis, tabular-nums for alignment
- Labels: 500 weight, text-xs to text-sm, uppercase tracking-wide for form labels

### Layout System
**Spacing Scale**: Use Tailwind units of 2, 4, 6, 8, 12, 16 for consistency
- Component padding: p-4 to p-6
- Section spacing: mb-6 to mb-8
- Card gaps: gap-4 to gap-6
- Form elements: space-y-4

**Grid System:**
- Dashboard: 12-column responsive grid
- Desktop: 3-4 column cards for metrics, 2-column for detailed views
- Tablet: 2-column layouts
- Mobile: Single column stack

### Component Library

**Navigation:**
- Sidebar navigation (240px wide) with collapsible menu
- Top app bar with user profile, notifications, role badge
- Breadcrumbs for nested views
- Active states with left border accent (4px primary color)

**Dashboard Cards:**
- Elevated cards (shadow-md) with rounded corners (rounded-lg)
- Metric cards: Large number display (text-3xl font-bold), icon, label, trend indicator
- Alert cards: Colored left border (border-l-4), icon, title, count badge
- Quick action cards with icon buttons

**Data Tables:**
- Zebra striping for row readability (alternate row backgrounds)
- Sticky headers with subtle shadow on scroll
- Action column (right-aligned) with icon buttons
- Status badges (rounded-full px-3 py-1) with appropriate colors
- Pagination controls at bottom-right
- Search and filter bar above table

**Forms:**
- Grouped sections with clear labels (font-medium text-sm)
- Input fields: border-2 with focus ring (ring-2 ring-primary)
- Date pickers for expiry dates with calendar icon
- Number inputs with increment/decrement buttons
- Select dropdowns with search capability
- Required field indicators (asterisk, red)
- Validation messages inline below inputs

**Alerts & Notifications:**
- Toast notifications (top-right corner) with auto-dismiss
- Inline alerts within cards (colored background, icon, message)
- Badge counters on navigation items
- Alert color coding: Warning (amber), Error (red), Info (blue), Success (green)

**Billing Interface:**
- Split view: Product search/add (left 60%), Cart summary (right 40%)
- Cart items list with quantity adjusters, remove button
- Live total calculation display (prominent, large text)
- Customer info capture form at top
- Print/Email invoice buttons after generation

**Modal Dialogs:**
- Overlay with backdrop (bg-black/50)
- Centered dialog with max-w-2xl
- Header with title and close button
- Scrollable content area
- Footer with action buttons (right-aligned)

**Buttons:**
- Primary: Solid primary color, white text, shadow-sm
- Secondary: Outline with primary border
- Danger: Solid red for delete actions
- Icon buttons: p-2 rounded-full hover:bg-gray-100
- Sizes: text-sm to text-base with appropriate padding

### Role-Based Visual Indicators
- Admin badge: Blue with shield icon
- Cashier badge: Green with user icon
- Role-specific navigation items visibility
- Restricted action buttons with lock icon (disabled state)

### Status Indicators
- Stock Level: Progress bars (green/yellow/red based on quantity)
- Expiry Status: Color-coded date displays with calendar icon
- Sale Status: Checkmark icon for completed, clock for pending

### Responsive Behavior
- Desktop (lg): Full sidebar, multi-column dashboard
- Tablet (md): Collapsible sidebar, 2-column layouts
- Mobile: Bottom nav bar, single column, drawer menu

### Animations
**Minimal, Purposeful Only:**
- Page transitions: None (instant for utility)
- Modal entry: Fade in backdrop, scale up dialog (duration-200)
- Toast notifications: Slide in from top-right
- Loading states: Subtle spinner for data fetching
- No decorative animations

## Images
**Icons Only - No Hero Images**: This is a utility dashboard, not a marketing site. Use icon libraries (Heroicons or Material Icons via CDN) for:
- Medicine bottle icons in inventory
- Alert/warning icons for notifications  
- User/role icons in navigation
- Chart/graph icons for dashboard metrics
- Calendar icons for expiry dates