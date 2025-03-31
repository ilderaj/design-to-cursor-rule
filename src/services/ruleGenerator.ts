import { DesignElements } from '../utils/types';

/**
 * Generate CSS styles for UI components based on design elements
 * @param elements Design elements extracted from image
 * @returns CSS styles as a string
 */
const generateComponentStyles = (elements: DesignElements): string => {
  const { colors, typography, borderRadius, spacing } = elements;
  
  // Extract primary, secondary, and neutral colors
  const [primary = '#3498db', secondary = '#2ecc71', danger = '#e74c3c', warning = '#f39c12', ...neutrals] = colors;
  
  // Extract font information
  const [mainFont = 'Roboto', ...altFonts] = typography.fontFamily;
  
  // Generate component styles
  return `
  // Button styles
  .button {
    background-color: ${primary};
    color: #ffffff;
    padding: ${spacing[1]}px ${spacing[2]}px;
    border-radius: ${borderRadius[1]}px;
    font-family: ${mainFont}, sans-serif;
    font-weight: ${typography.fontWeights[1]};
    font-size: ${typography.fontSizes[2]}px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .button:hover {
    background-color: ${adjustColorBrightness(primary, -15)};
  }
  
  .button.secondary {
    background-color: ${secondary};
  }
  
  .button.secondary:hover {
    background-color: ${adjustColorBrightness(secondary, -15)};
  }
  
  // Card styles
  .card {
    background-color: #ffffff;
    border-radius: ${borderRadius[2]}px;
    padding: ${spacing[3]}px;
    box-shadow: 0 ${spacing[0]}px ${spacing[2]}px rgba(0, 0, 0, 0.1);
  }
  
  // Input styles
  .input {
    padding: ${spacing[1]}px ${spacing[2]}px;
    border-radius: ${borderRadius[1]}px;
    border: 1px solid ${neutrals[0] || '#ddd'};
    font-family: ${mainFont}, sans-serif;
    font-size: ${typography.fontSizes[1]}px;
  }
  
  .input:focus {
    border-color: ${primary};
    outline: none;
  }
  
  // Typography styles
  h1, h2, h3, h4, h5, h6 {
    font-family: ${mainFont}, sans-serif;
    font-weight: ${typography.fontWeights[2]};
    margin-bottom: ${spacing[2]}px;
  }
  
  h1 { font-size: ${typography.fontSizes[6]}px; }
  h2 { font-size: ${typography.fontSizes[5]}px; }
  h3 { font-size: ${typography.fontSizes[4]}px; }
  
  p {
    font-family: ${mainFont}, sans-serif;
    font-size: ${typography.fontSizes[2]}px;
    line-height: 1.5;
  }`;
};

/**
 * Utility function to adjust color brightness
 * @param hex Hex color code
 * @param percent Percentage to adjust (-100 to 100)
 * @returns Adjusted hex color
 */
const adjustColorBrightness = (hex: string, percent: number): string => {
  // Convert hex to RGB
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);
  
  // Adjust brightness
  r = Math.max(0, Math.min(255, r + (r * percent / 100)));
  g = Math.max(0, Math.min(255, g + (g * percent / 100)));
  b = Math.max(0, Math.min(255, b + (b * percent / 100)));
  
  // Convert back to hex
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
};

/**
 * Generate design system object from design elements
 * @param elements Design elements extracted from image
 * @returns Design system as a string
 */
const generateDesignSystem = (elements: DesignElements): string => {
  const { colors, typography, spacing, borderRadius } = elements;
  
  // Extract primary, secondary, and neutral colors
  const [primary = '#3498db', secondary = '#2ecc71', danger = '#e74c3c', warning = '#f39c12', ...neutrals] = colors;
  
  // Generate design system object
  return `{
  "colors": {
    "primary": "${primary}",
    "secondary": "${secondary}",
    "danger": "${danger}",
    "warning": "${warning}",
    "neutrals": [${neutrals.map(c => `"${c}"`).join(', ')}]
  },
  "typography": {
    "fontFamily": [${typography.fontFamily.map(f => `"${f}"`).join(', ')}],
    "fontSizes": [${typography.fontSizes.join(', ')}],
    "fontWeights": [${typography.fontWeights.join(', ')}]
  },
  "spacing": [${spacing.join(', ')}],
  "borderRadius": [${borderRadius.join(', ')}]
}`;
};

/**
 * Generate a Cursor rule based on design elements
 * @param elements Design elements extracted from image
 * @returns Cursor rule as a string
 */
export const generateCursorRule = (elements: DesignElements): string => {
  // Generate component styles
  const styles = generateComponentStyles(elements);
  
  // Generate design system
  const designSystem = generateDesignSystem(elements);
  
  // Generate Cursor rule
  return `# Cursor Design Rule
# Generated from design image analysis

## Design System
\`\`\`json
${designSystem}
\`\`\`

## Component Styles
\`\`\`css
${styles}
\`\`\`

## Design Guidelines
1. Use the color palette consistently across the UI
2. Maintain spacing rhythm using the specified spacing values
3. Use the font families and font sizes from the typography system
4. Maintain consistent border radius for components
5. Use the component styles as a reference for UI implementation

## Component Usage
- Buttons: Use primary color for main actions, secondary for alternative actions
- Inputs: Maintain consistent padding and border radius
- Typography: Follow the heading hierarchy and font sizes
- Cards: Use consistent shadow and border radius

## Implementation Notes
- Use responsive design principles while maintaining the design language
- Ensure adequate contrast for accessibility
- Maintain consistent component spacing throughout the UI
`;
}; 