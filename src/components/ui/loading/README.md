# Loading Component

Loading spinner component sử dụng `respinner` library với `BeatLoading` effect.

## Installation

```bash
npm install respinner
```

## Usage

### 1. Basic Loading (Inline)

```tsx
import { Loading } from '@/components/ui/loading/Loading';

<Loading size="default" />
<Loading text="Loading data..." />
```

### 2. Inline Loading (Small - for buttons, dropdowns)

```tsx
import { InlineLoading } from '@/components/ui/loading/Loading';

<InlineLoading size="xs" />
<InlineLoading size="sm" />
```

### 3. Full Page Loading

```tsx
import { FullPageLoading } from '@/components/ui/loading/Loading';

<FullPageLoading text="Loading application..." />
```

### 4. Button Loading

```tsx
import { ButtonLoading } from '@/components/ui/loading/Loading';

// Dark spinner (for light buttons)
<ButtonLoading text="Processing..." />

// Light spinner (for dark buttons)
<ButtonLoading text="Signing in..." light />

// Usage in button
<Button disabled={isLoading}>
  {isLoading ? <ButtonLoading text="Loading..." light /> : 'Submit'}
</Button>
```

### 5. Section/Card Loading

```tsx
import { SectionLoading } from '@/components/ui/loading/Loading';

<SectionLoading text="Loading content..." minHeight="400px" />
```

## Props

### Loading Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'default' \| 'lg' \| 'xl'` | `'default'` | Size of the spinner |
| `color` | `string` | `'#111111'` | Spinner color (hex or color name) |
| `count` | `number` | (varies by size) | Number of beat elements |
| `fullPage` | `boolean` | `false` | Display as full-page overlay |
| `text` | `string` | `undefined` | Text to display below spinner |
| `className` | `string` | `undefined` | Additional CSS classes |

### ButtonLoading Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | `'Loading...'` | Text to display |
| `light` | `boolean` | `false` | Use white spinner (for dark backgrounds) |

### SectionLoading Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | `'Loading...'` | Text to display |
| `minHeight` | `string` | `'200px'` | Minimum height of the container |

## Size Mapping

| Size | Count | Text Size | Use Case |
|------|-------|-----------|----------|
| `xs` | 3 | text-xs | Inline in small buttons |
| `sm` | 3 | text-sm | Dropdowns, small contexts |
| `default` | 4 | text-sm | Standard loading states |
| `lg` | 4 | text-base | Large containers |
| `xl` | 5 | text-lg | Full page, hero sections |

## Examples

### In Route Loading Fallback

```tsx
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Loading size="default" text="Loading..." />
  </div>
);
```

### In Modal Loading State

```tsx
<Button onClick={handleSubmit} disabled={isLoading}>
  {isLoading ? <ButtonLoading text="Processing..." /> : 'Submit'}
</Button>
```

### In Select Component Loading

```tsx
{isLoading ? (
  <div className="py-8 flex flex-col items-center justify-center gap-2">
    <InlineLoading size="sm" />
    <span className="text-sm text-slate-500">Loading options...</span>
  </div>
) : (
  // Options list
)}
```

### In File Preview Loading

```tsx
if (isLoading) {
  return (
    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200">
      <Loading size="default" text="Loading preview..." />
    </div>
  );
}
```

## Color Customization

```tsx
// Emerald spinner
<Loading color="#10b981" />

// Custom brand color
<Loading color="#3b82f6" />

// White spinner for dark backgrounds
<Loading color="#ffffff" />
```

## Migration from Custom Spinners

### Before (Custom CSS)

```tsx
<div className="h-5 w-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
```

### After (respinner)

```tsx
<InlineLoading size="xs" />
```

## Best Practices

1. **Use appropriate sizes**: 
   - `xs`/`sm` for inline contexts
   - `default` for standard loading states
   - `lg`/`xl` for full-page or large sections

2. **Provide text feedback**: Always include descriptive text for better UX

3. **Match colors to context**:
   - Use `light` prop for dark buttons
   - Use default dark spinner for light backgrounds

4. **Full page loading**: Use `FullPageLoading` for route transitions

5. **Avoid custom spinners**: Always use Loading components instead of writing custom CSS

## Component Architecture

```
components/ui/loading/
├── Loading.tsx          # Main component with variants
└── index.ts            # Exports
```

All variants are exported from a single file for easier imports and consistency.
