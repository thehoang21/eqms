# Responsive Design System

Hệ thống responsive design được tối ưu cho **Desktop** và **Tablet** (iPad cả chiều dọc và ngang).

## Breakpoints

```typescript
- Mobile: < 768px (không ưu tiên)
- Tablet Portrait: 768px - 1023px (iPad dọc)
- Tablet Landscape: 1024px - 1279px (iPad ngang)
- Desktop: 1280px+
- Desktop Large: 1920px+
```

### Tailwind CSS Mapping
```typescript
- md: 768px  → Tablet Portrait
- lg: 1024px → Tablet Landscape  
- xl: 1280px → Desktop
- 2xl: 1536px → Desktop Large
```

## Component Usage

### 1. Responsive Table

```tsx
import {
  ResponsiveTableContainer,
  ResponsiveTableWrapper,
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  TablePagination,
  TableEmptyState,
} from '@/components/ui/responsive';

<ResponsiveTableContainer>
  <ResponsiveTableWrapper>
    <Table>
      <TableHeader>
        <tr>
          <TableCell isHeader>Name</TableCell>
          <TableCell isHeader>Status</TableCell>
          <TableCell isHeader sticky="right">Actions</TableCell>
        </tr>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableEmptyState
            title="No data found"
            description="Try adjusting your filters"
            colSpan={3}
          />
        ) : (
          data.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell sticky="right">
                <Button size="sm">Edit</Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </ResponsiveTableWrapper>
  <TablePagination
    currentPage={1}
    totalPages={10}
    totalItems={100}
    itemsPerPage={10}
    onPageChange={handlePageChange}
  />
</ResponsiveTableContainer>
```

### 2. Responsive Form

```tsx
import {
  FormField,
  FormGrid,
  FormSection,
  FormActions,
  Input,
  Textarea,
  Button,
} from '@/components/ui/responsive';

<FormSection
  title="Document Information"
  description="Enter basic document details"
>
  <FormGrid columns={2}>
    <FormField
      label="Document Number"
      required
      error={errors.docNumber}
    >
      <Input
        value={formData.docNumber}
        onChange={handleChange}
        placeholder="DOC-2025-001"
      />
    </FormField>

    <FormField
      label="Status"
      layout="horizontal"
    >
      <Select {...} />
    </FormField>
  </FormGrid>

  <FormField label="Description" hint="Max 500 characters">
    <Textarea rows={4} />
  </FormField>

  <FormActions align="right">
    <Button variant="outline">Cancel</Button>
    <Button>Save Document</Button>
  </FormActions>
</FormSection>
```

### 3. Responsive Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardGrid,
  StatCard,
} from '@/components/ui/responsive';

// Basic Card
<Card hover padding="lg">
  <CardHeader>
    <CardTitle>Document Statistics</CardTitle>
    <CardDescription>Overview of document status</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>

// Stat Cards Grid
<CardGrid columns={4}>
  <StatCard
    title="Total Documents"
    value={1234}
    change={{ value: 12, trend: 'up' }}
    icon={<FileText className="h-6 w-6" />}
  />
  <StatCard
    title="Pending Review"
    value={45}
    change={{ value: 5, trend: 'down' }}
    icon={<Clock className="h-6 w-6" />}
  />
</CardGrid>
```

### 4. Responsive Button

```tsx
import { Button } from '@/components/ui/responsive';

<Button size="default">Save</Button>
<Button size="sm" variant="outline">Cancel</Button>
<Button size="lg" fullWidth>Submit</Button>
<Button size="icon" variant="ghost">
  <Settings className="h-5 w-5" />
</Button>
```

## Layout Components

### MainLayout
- Auto-collapse sidebar trên tablet portrait
- Auto-expand trên tablet landscape và desktop
- Responsive padding và spacing

### Header
- Responsive height: `h-16 md:h-18`
- Search bar responsive width
- Hide user name trên mobile/tablet portrait
- Touch-friendly button sizes

### Sidebar
- Icon-only mode: 80px (tablet portrait)
- Expanded mode: 280px (desktop)
- Tooltips hiển thị khi collapsed
- Smooth transitions

## CSS Variables

```css
:root {
  /* Breakpoints */
  --breakpoint-tablet: 768px;
  --breakpoint-tablet-lg: 1024px;
  --breakpoint-desktop: 1280px;
  
  /* Layout Sizes */
  --sidebar-collapsed: 80px;
  --sidebar-expanded: 280px;
  --header-height: 64px;
  --header-height-desktop: 72px;
}
```

## Best Practices

### 1. Touch Targets
- Minimum 44x44px cho touch elements trên tablet
- Sử dụng `p-2` (32px) cho icon buttons

### 2. Typography
```tsx
// Responsive font sizes
text-sm md:text-base        // Body text
text-lg md:text-xl          // Headings
text-xs md:text-sm          // Labels
```

### 3. Spacing
```tsx
// Responsive padding
p-4 md:p-6 lg:p-8          // Card padding
px-3 py-2 md:px-4 md:py-3  // Input padding
gap-2 md:gap-3 lg:gap-4    // Flex gap
```

### 4. Layout
```tsx
// Responsive grid
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

// Responsive flex direction
flex-col sm:flex-row

// Hide/Show elements
hidden md:block            // Hide on mobile
md:hidden lg:block         // Show only on tablet portrait
```

### 5. Z-Index Hierarchy
```typescript
- Overlay: z-10
- Sidebar: z-30
- Header: z-40
- Dropdown/Popover: z-50 (using Portal)
- Modal: z-50
```

## Testing Checklist

### iPad Portrait (768x1024)
- [ ] Sidebar collapsed to icon-only
- [ ] Search bar readable
- [ ] Tables scrollable horizontally
- [ ] Forms usable with touch
- [ ] Buttons minimum 44x44px

### iPad Landscape (1024x768)
- [ ] Sidebar expanded
- [ ] Full search bar visible
- [ ] Tables fit comfortably
- [ ] Cards in proper grid
- [ ] All content readable

### Desktop (1280px+)
- [ ] Full sidebar with labels
- [ ] Optimized spacing
- [ ] Multi-column layouts
- [ ] Hover states working
- [ ] Tooltips on icon buttons

## Migration Guide

### Old Component → New Component

```tsx
// Old
<table className="w-full">
  <thead>
    <tr>
      <th>Name</th>
    </tr>
  </thead>
</table>

// New
<ResponsiveTableContainer>
  <ResponsiveTableWrapper>
    <Table>
      <TableHeader>
        <tr>
          <TableCell isHeader>Name</TableCell>
        </tr>
      </TableHeader>
    </Table>
  </ResponsiveTableWrapper>
</ResponsiveTableContainer>
```

```tsx
// Old
<input className="w-full px-4 py-2 border" />

// New
<Input placeholder="Enter value" />
```

```tsx
// Old
<div className="bg-white p-6 rounded-lg border">
  <h3>Title</h3>
  <p>Content</p>
</div>

// New
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content</p>
  </CardContent>
</Card>
```

## Support

Responsive system được thiết kế cho:
- ✅ Desktop (1280px+)
- ✅ Tablet Landscape (1024px - 1279px)
- ✅ Tablet Portrait (768px - 1023px)
- ⚠️ Mobile (< 768px) - Limited support
