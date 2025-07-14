# shadcn/ui Setup Guide

This project uses [shadcn/ui](https://ui.shadcn.com/) components with utility classes (not CSS variables) as requested.

## ✅ Installation Complete

The following have been set up:

- **Dependencies**: class-variance-authority, clsx, tailwind-merge, lucide-react, @radix-ui/react-slot
- **Configuration**: `components.json` with utility classes enabled (`cssVariables: false`)
- **Utils**: `src/lib/utils.ts` with the `cn()` function for merging classes
- **Components**: `src/components/ui/` directory structure

## 🎨 Integration with Your Design System

Your existing color system and typography classes are preserved and enhanced:

### Color Integration
```tsx
// Your semantic colors work seamlessly
<Button className="bg-brand-600 hover:bg-brand-700">
  Brand Button
</Button>

// Or use the custom variants that map to your colors
<Button variant="brand">Brand Button</Button>
```

### Typography Integration
```tsx
// Your font classes work with shadcn components  
<Button className="font-button">
  Button with your typography
</Button>
```

## 🔧 Customization Approach

### 1. Wrap shadcn Components (Recommended)

Create custom components that wrap shadcn components:

```tsx
// src/components/Button.tsx
import { Button as ShadcnButton } from "./ui/button"
import { cva } from "class-variance-authority"

const customButtonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        brand: "bg-brand-600 hover:bg-brand-700", // Your colors
        positive: "bg-green-500 hover:bg-green-600",
      },
      // Add your own variants
    }
  }
)

export function Button({ variant, ...props }) {
  return (
    <ShadcnButton 
      className={customButtonVariants({ variant })}
      {...props}
    />
  )
}
```

### 2. Modify shadcn Components Directly

Edit files in `src/components/ui/` to match your design system:

```tsx
// src/components/ui/button.tsx
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "bg-brand-600 text-white hover:bg-brand-700", // Your brand colors
        // ... other variants
      }
    }
  }
)
```

## 📦 Adding New Components

### Install Components
```bash
# Add individual components
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card

# Add multiple components
npx shadcn@latest add button input card badge
```

### Available Components
Common components you might want:
- `button` - Button component
- `input` - Input field
- `card` - Card container
- `badge` - Badge/chip component
- `dialog` - Modal dialog
- `dropdown-menu` - Dropdown menus
- `form` - Form components
- `table` - Data tables
- `toast` - Toast notifications
- `tooltip` - Tooltips

[See full component list](https://ui.shadcn.com/docs/components)

## 🎯 Example Usage

### Basic Usage
```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Form</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Enter text..." />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  )
}
```

### Custom Component Usage
```tsx
import { Button } from "@/components/Button" // Your custom wrapper

export function MyComponent() {
  return (
    <div className="space-y-4">
      <Button variant="brand">Brand Button</Button>
      <Button variant="positive">Success Button</Button>
      <Button variant="brand-secondary" size="lg">
        Large Secondary Button
      </Button>
    </div>
  )
}
```

## 🔍 Live Demo

Check `src/components/ButtonDemo.tsx` for a comprehensive example showing:
- All button variants (including custom ones)
- Different sizes and states
- Loading states and icons
- Integration with your color system

## 🛠️ Next Steps

1. **Add more components** as needed using `npx shadcn@latest add [component]`
2. **Customize components** by either wrapping them or editing the ui files directly
3. **Create custom variants** that use your design tokens
4. **Build component documentation** similar to the ButtonDemo

## 📚 Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Component Examples](https://ui.shadcn.com/examples)
- [Customization Guide](https://ui.shadcn.com/docs/customization)
- [Theming Guide](https://ui.shadcn.com/docs/theming) 