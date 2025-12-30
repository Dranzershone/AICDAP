# Theme System Documentation

This document describes how to use the common theme system throughout the AICDAP project.

## Overview

The theme system is built on Material-UI (MUI) and provides a consistent dark theme with custom colors, typography, and component styling that matches the AICDAP design aesthetic.

## Theme Colors

### Primary Colors
- **Primary**: `#7367f0` (Violet Blue) - Used for main actions, links, and brand elements
- **Secondary**: `#29c8e7` (Teal) - Used for secondary actions and accents

### Background Colors
- **Default Background**: `#171725` (Deep Blue/Charcoal)
- **Paper Background**: `#1e1e2f` (Slightly lighter for cards and elevated surfaces)

### Text Colors
- **Primary Text**: `#ffffff` (White)
- **Secondary Text**: `rgba(255,255,255,0.7)` (Semi-transparent white)
- **Disabled Text**: `rgba(255,255,255,0.5)`

## Usage

### 1. Basic Theme Provider Setup

```jsx
import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { commonTheme } from './themes';

function App() {
  return (
    <ThemeProvider theme={commonTheme}>
      <CssBaseline />
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### 2. Using Theme Colors in Components

```jsx
import { Box, Typography, Button } from '@mui/material';

// Using theme colors via sx prop
<Box sx={{ 
  backgroundColor: 'background.paper',
  color: 'text.primary',
  border: '1px solid',
  borderColor: 'divider'
}}>
  <Typography variant="h4" color="primary">
    Title with primary color
  </Typography>
  <Typography variant="body1" color="text.secondary">
    Secondary text
  </Typography>
</Box>
```

### 3. Using Theme with useTheme Hook

```jsx
import { useTheme } from '@mui/material/styles';

const MyComponent = () => {
  const theme = useTheme();
  
  const customStyle = {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  };
  
  return <div style={customStyle}>Custom styled component</div>;
};
```

### 4. Custom Gradients and Effects

The theme includes pre-configured gradients and effects:

```jsx
// Primary gradient button
<Button
  variant="contained"
  sx={{
    background: 'linear-gradient(135deg, #7367f0 0%, #5a4ed4 100%)',
    '&:hover': {
      background: 'linear-gradient(135deg, #8b7ff5 0%, #6b5dd6 100%)',
    }
  }}
>
  Gradient Button
</Button>

// Background with subtle gradient
<Box sx={{
  background: `
    radial-gradient(ellipse at top, rgba(115, 103, 240, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, rgba(41, 200, 231, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #171725 0%, #1a1a2e 50%, #16213e 100%)
  `
}}>
  Content with gradient background
</Box>
```

## Typography

The theme uses the Inter font family with the following variants:

- **h1-h6**: Headlines with bold weights (600-700)
- **body1, body2**: Body text with regular weight
- **button**: Button text with semi-bold weight (600) and no text transform
- **subtitle1, subtitle2**: Subtitle variants
- **caption, overline**: Small text variants

### Typography Usage Examples

```jsx
<Typography variant="h1">Main Heading</Typography>
<Typography variant="h4" color="primary">Section Title</Typography>
<Typography variant="body1" color="text.secondary">
  Regular body text with secondary color
</Typography>
<Typography variant="button">Button Text Style</Typography>
```

## Component Customizations

### Buttons
- Rounded corners (8px border radius)
- No box shadow by default, hover effects add subtle shadows
- Gradient backgrounds for contained buttons
- Custom hover states

### Cards
- Dark background (`#1e1e2f`)
- Rounded corners (12px)
- Subtle box shadows

### Text Fields
- Dark theme compatible
- Custom focus colors using primary theme color
- Proper contrast for labels and inputs

### App Bar
- Semi-transparent background with blur effect
- Subtle border bottom

## Responsive Design

The theme includes standard MUI breakpoints:

```jsx
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('md'));

// Or using sx prop
<Box sx={{
  display: { xs: 'block', md: 'flex' },
  padding: { xs: 2, md: 4 }
}}>
  Responsive content
</Box>
```

## File Structure

```
src/
  themes/
    theme.js        # Main theme configuration
    index.js        # Theme exports
    README.md       # This documentation
```

## Best Practices

1. **Always use theme colors**: Instead of hardcoding colors, use theme palette colors
2. **Use spacing units**: Use `theme.spacing()` or the sx prop spacing values
3. **Leverage typography variants**: Use predefined typography variants instead of custom font styles
4. **Test responsive behavior**: Always test components across different screen sizes
5. **Use semantic colors**: Use `primary`, `secondary`, `error`, `warning`, `info`, `success` for semantic meaning

## Examples

See the `ThemeDemo` component for comprehensive examples of how to use the theme system effectively.

## Contributing

When adding new theme customizations:
1. Add them to the main theme file (`theme.js`)
2. Document the changes in this README
3. Update the ThemeDemo component with usage examples
4. Test across all supported devices and browsers