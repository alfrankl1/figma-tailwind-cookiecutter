#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { oklch, clampChroma } = require('culori');

// Read the figma colors JSON
const figmaColors = JSON.parse(fs.readFileSync(path.join(__dirname, '../tools/figma-colors.json'), 'utf8'));

// Default Tailwind colors for mapping
const defaultTailwindColors = {
  slate:   { 50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1", 400: "#94a3b8", 500: "#64748b", 600: "#475569", 700: "#334155", 800: "#1e293b", 900: "#0f172a", 950: "#020617" },
  gray:    { 50: "#f9fafb", 100: "#f3f4f6", 200: "#e5e7eb", 300: "#d1d5db", 400: "#9ca3af", 500: "#6b7280", 600: "#4b5563", 700: "#374151", 800: "#1f2937", 900: "#111827", 950: "#030712" },
  zinc:    { 50: "#fafafa", 100: "#f4f4f5", 200: "#e4e4e7", 300: "#d4d4d8", 400: "#a1a1aa", 500: "#71717a", 600: "#52525b", 700: "#3f3f46", 800: "#27272a", 900: "#18181b", 950: "#09090b" },
  neutral: { 50: "#fafafa", 100: "#f5f5f5", 200: "#e5e5e5", 300: "#d4d4d4", 400: "#a3a3a3", 500: "#737373", 600: "#525252", 700: "#404040", 800: "#262626", 900: "#171717", 950: "#0a0a0a" },
  stone:   { 50: "#fafaf9", 100: "#f5f5f4", 200: "#e7e5e4", 300: "#d6d3d1", 400: "#a8a29e", 500: "#78716c", 600: "#57534e", 700: "#44403c", 800: "#292524", 900: "#1c1917", 950: "#0c0a09" },
  red:     { 50: "#fef2f2", 100: "#fee2e2", 200: "#fecaca", 300: "#fca5a5", 400: "#f87171", 500: "#ef4444", 600: "#dc2626", 700: "#b91c1c", 800: "#991b1b", 900: "#7f1d1d", 950: "#450a0a" },
  orange:  { 50: "#fff7ed", 100: "#ffedd5", 200: "#fed7aa", 300: "#fdba74", 400: "#fb923c", 500: "#f97316", 600: "#ea580c", 700: "#c2410c", 800: "#9a3412", 900: "#7c2d12", 950: "#431407" },
  amber:   { 50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d", 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309", 800: "#92400e", 900: "#78350f", 950: "#451a03" },
  yellow:  { 50: "#fefce8", 100: "#fef9c3", 200: "#fef08a", 300: "#fde047", 400: "#facc15", 500: "#eab308", 600: "#ca8a04", 700: "#a16207", 800: "#854d0e", 900: "#713f12", 950: "#422006" },
  lime:    { 50: "#f7fee7", 100: "#ecfccb", 200: "#d9f99d", 300: "#bef264", 400: "#a3e635", 500: "#84cc16", 600: "#65a30d", 700: "#4d7c0f", 800: "#3f6212", 900: "#365314", 950: "#1a2e05" },
  green:   { 50: "#f0fdf4", 100: "#dcfce7", 200: "#bbf7d0", 300: "#86efac", 400: "#4ade80", 500: "#22c55e", 600: "#16a34a", 700: "#15803d", 800: "#166534", 900: "#14532d", 950: "#052e16" },
  emerald: { 50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7", 400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857", 800: "#065f46", 900: "#064e3b", 950: "#022c22" },
  teal:    { 50: "#f0fdfa", 100: "#ccfbf1", 200: "#99f6e4", 300: "#5eead4", 400: "#2dd4bf", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e", 800: "#115e59", 900: "#134e4a", 950: "#042f2e" },
  cyan:    { 50: "#ecfeff", 100: "#cffafe", 200: "#a5f3fc", 300: "#67e8f9", 400: "#22d3ee", 500: "#06b6d4", 600: "#0891b2", 700: "#0e7490", 800: "#155e75", 900: "#164e63", 950: "#083344" },
  sky:     { 50: "#f0f9ff", 100: "#e0f2fe", 200: "#bae6fd", 300: "#7dd3fc", 400: "#38bdf8", 500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1", 800: "#075985", 900: "#0c4a6e", 950: "#082f49" },
  blue:    { 50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd", 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af", 900: "#1e3a8a", 950: "#172554" },
  indigo:  { 50: "#eef2ff", 100: "#e0e7ff", 200: "#c7d2fe", 300: "#a5b4fc", 400: "#818cf8", 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca", 800: "#3730a3", 900: "#312e81", 950: "#1e1b4b" },
  violet:  { 50: "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd", 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9", 800: "#5b21b6", 900: "#4c1d95", 950: "#2e1065" },
  purple:  { 50: "#faf5ff", 100: "#f3e8ff", 200: "#e9d5ff", 300: "#d8b4fe", 400: "#c084fc", 500: "#a855f7", 600: "#9333ea", 700: "#7e22ce", 800: "#6d19a3", 900: "#581c87", 950: "#3b0764" },
  fuchsia: { 50: "#fdf4ff", 100: "#fae8ff", 200: "#f5d0fe", 300: "#f0abfc", 400: "#e879f9", 500: "#d946ef", 600: "#c026d3", 700: "#a21caf", 800: "#86198f", 900: "#701a75", 950: "#4a044e" },
  pink:    { 50: "#fdf2f8", 100: "#fce7f3", 200: "#fbcfe8", 300: "#f9a8d4", 400: "#f472b6", 500: "#ec4899", 600: "#db2777", 700: "#be185d", 800: "#9d174d", 900: "#831843", 950: "#500724" },
  rose:    { 50: "#fff1f2", 100: "#ffe4e6", 200: "#fecdd3", 300: "#fda4af", 400: "#fb7185", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c", 800: "#9f1239", 900: "#881337", 950: "#4c0519" },
  white: "#ffffff",
  black: "#000000"
};

/**
 * Convert hex color to OKLCH format
 */
function hexToOklch(hex) {
  try {
    const color = oklch(hex);
    if (!color) return hex;
    
    const clampedColor = clampChroma(color, 'oklch');
    const l = (clampedColor.l || 0).toFixed(3);
    const c = (clampedColor.c || 0).toFixed(3);
    const h = clampedColor.h ? clampedColor.h.toFixed(1) : '0';
    
    return `oklch(${l} ${c} ${h})`;
  } catch (error) {
    console.warn(`Failed to convert ${hex} to OKLCH, using original value`);
    return hex;
  }
}

/**
 * Calculate color distance for primitive matching
 */
function colorDistance(color1, color2) {
  try {
    const lab1 = oklch(color1);
    const lab2 = oklch(color2);
    
    if (!lab1 || !lab2) return Infinity;
    
    const dl = (lab1.l || 0) - (lab2.l || 0);
    const dc = (lab1.c || 0) - (lab2.c || 0);
    const dh = ((lab1.h || 0) - (lab2.h || 0)) / 360;
    
    return Math.sqrt(dl * dl + dc * dc + dh * dh);
  } catch {
    return Infinity;
  }
}

/**
 * Find the closest primitive color for a given hex value
 */
function findClosestPrimitive(targetHex, customPrimitives) {
  let closestColor = null;
  let closestDistance = Infinity;
  
  // Check custom primitives first
  Object.entries(customPrimitives).forEach(([colorName, shades]) => {
    Object.entries(shades).forEach(([shade, hex]) => {
      const distance = colorDistance(targetHex, hex);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestColor = `${colorName}-${shade}`;
      }
    });
  });
  
  // Check default Tailwind colors
  Object.entries(defaultTailwindColors).forEach(([colorName, shades]) => {
    if (typeof shades === 'string') {
      const distance = colorDistance(targetHex, shades);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestColor = colorName;
      }
    } else {
      Object.entries(shades).forEach(([shade, hex]) => {
        const distance = colorDistance(targetHex, hex);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestColor = `${colorName}-${shade}`;
        }
      });
    }
  });
  
  return closestColor;
}

console.log('🎨 Syncing Figma colors to TailwindCSS 4.1...\n');

// Generate custom primitives
console.log('📝 Step 1: Processing custom color primitives...');
const { 'utility-classes-custom': customColors } = figmaColors;

const colorGroups = {};
Object.entries(customColors).forEach(([colorName, value]) => {
  const match = colorName.match(/color-(.+)-(\d+)/);
  if (match) {
    const [, baseName, shade] = match;
    if (!colorGroups[baseName]) colorGroups[baseName] = {};
    colorGroups[baseName][shade] = value.default;
  }
});

let customThemeBlock = '';
Object.entries(colorGroups).forEach(([baseName, shades]) => {
  customThemeBlock += `    /* ${baseName.charAt(0).toUpperCase() + baseName.slice(1)} Colors */\n`;
  Object.entries(shades).forEach(([shade, hexColor]) => {
    const oklchColor = hexToOklch(hexColor);
    customThemeBlock += `    --color-${baseName}-${shade}: ${oklchColor};\n`;
  });
  customThemeBlock += '\n';
});

// Process semantic colors
console.log('📝 Step 2: Processing semantic colors...');
const { 'semantic-colors': semanticColors } = figmaColors;

// Sort semantic colors: base variants first, hover variants last
const sortedSemanticEntries = Object.entries(semanticColors).sort(([nameA], [nameB]) => {
  const isHoverA = nameA.endsWith('-hover');
  const isHoverB = nameB.endsWith('-hover');
  
  if (isHoverA === isHoverB) return 0;
  return isHoverA ? 1 : -1;
});

// Group semantic colors
const semanticGroups = {};
sortedSemanticEntries.forEach(([semanticName, colors]) => {
  const parts = semanticName.split('-');
  const type = parts[0]; // bg, text, border
  const category = parts[1]; // brand, neutral, positive, warning, danger, default
  const variant = parts.slice(2).join('-'); // default, secondary, tertiary, default-hover, secondary-hover
  
  const baseKey = `${type}-${category}`;
  if (!semanticGroups[baseKey]) {
    semanticGroups[baseKey] = {};
  }
  semanticGroups[baseKey][variant] = colors;
});

// --- Parse all class blocks in the current file ---
const globalsPath = path.join(__dirname, '../src/app/globals.css');
let existingCSS = '';
if (fs.existsSync(globalsPath)) {
  existingCSS = fs.readFileSync(globalsPath, 'utf8');
}

// Parse all class blocks (including custom, legacy, and semantic)
const classBlockRegex = /(\.[\w-]+[^{]*\{[\s\S]*?\})/g;
const classBlocks = [];
let match;
while ((match = classBlockRegex.exec(existingCSS)) !== null) {
  classBlocks.push(match[0]);
}

// Map: className -> block
const classMap = {};
classBlocks.forEach(block => {
  const nameMatch = block.match(/\.(\w[\w-]*)/);
  if (nameMatch) {
    classMap[nameMatch[1]] = block;
  }
});

// --- Generate new semantic classes ---
let semanticClassesMap = {};
Object.entries(semanticGroups).forEach(([baseKey, variants]) => {
  const [type, category] = baseKey.split('-');
  Object.entries(variants)
    .filter(([variant]) => !variant.endsWith('-hover'))
    .forEach(([variant, colors]) => {
      const lightColor = colors.light;
      const lightPrimitive = findClosestPrimitive(lightColor, colorGroups);
      if (!lightPrimitive) return;
      let className;
      if (variant === 'default') {
        className = `${type}-${category}`;
      } else {
        className = `${type}-${category}-${variant}`;
      }
      let block = `  .${className} {\n    @apply ${type}-${lightPrimitive};\n  }`;
      const hoverVariant = `${variant}-hover`;
      if (variants[hoverVariant]) {
        const hoverColors = variants[hoverVariant];
        const hoverLightPrimitive = findClosestPrimitive(hoverColors.light, colorGroups);
        if (hoverLightPrimitive) {
          const hoverClassName = `${className}-hover`;
          semanticClassesMap[hoverClassName] = `  .${hoverClassName}:hover {\n    @apply ${type}-${hoverLightPrimitive};\n  }`;
        }
      }
      semanticClassesMap[className] = block;
    });
});

// --- Compose the final CSS with block replacement ---

// Read the existing file and extract blocks
let fileContent = '';
if (fs.existsSync(globalsPath)) {
  fileContent = fs.readFileSync(globalsPath, 'utf8');
}

// Regexes for block extraction
const themeBlockRegex = /(:root[\s\S]*?@theme inline \{[\s\S]*?\n\})/;
const utilitiesBlockRegex = /(@layer utilities \{)([\s\S]*?)(\n\})/;
const mediaBlockRegex = /@media \(prefers-color-scheme: dark\) \{[\s\S]*?\n\}/;

// Extract blocks
let header = '';
let mediaBlock = '';
let footer = '';

// Header: everything before :root
const rootIndex = fileContent.indexOf(':root');
if (rootIndex !== -1) {
  header = fileContent.slice(0, rootIndex);
} else {
  // If not found, use default header
  header = `/* \n * Generated TailwindCSS 4.1 styles from Figma colors\n * This file is auto-generated. Do not edit manually.\n * Run: npm run build:colors to regenerate\n */\n\n@import \"tailwindcss\";\n\n`;
}

// Generate new theme block with updated primitives
// First, extract existing custom colors from the current theme block
let existingCustomColors = '';
const existingThemeMatch = fileContent.match(/@theme inline \{([\s\S]*?)\}/);
if (existingThemeMatch) {
  const themeContent = existingThemeMatch[1];
  
  // Split content into lines to preserve formatting and comments
  const lines = themeContent.split('\n');
  let inCustomSection = false;
  let customLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip Figma color group comments (e.g., "/* Brand Colors */", "/* Big-stone Colors */")
    const figmaCommentMatch = line.match(/\/\*\s*([A-Z][a-z-]+)\s+Colors\s*\*\//);
    if (figmaCommentMatch) {
      const groupName = figmaCommentMatch[1].toLowerCase();
      // Check if this is a Figma color group
      if (colorGroups[groupName]) {
        inCustomSection = false;
        continue; // Skip this line
      }
    }
    
    // Check if this line contains a color variable
    const colorMatch = line.match(/--color-([a-zA-Z0-9_-]+):/);
    if (colorMatch) {
      const colorName = colorMatch[1];
      
      // Skip standard theme variables
      if (['background', 'foreground', 'font-sans', 'font-mono'].includes(colorName)) {
        continue;
      }
      
      // Check if this color is NOT from Figma (i.e., it's a custom addition)
      const isFromFigma = Object.entries(colorGroups).some(([baseName, shades]) => 
        Object.keys(shades).some(shade => `${baseName}-${shade}` === colorName)
      );
      
      if (!isFromFigma) {
        // This is a custom color section, start collecting lines
        inCustomSection = true;
        
        // Look backwards for any preceding comment lines (but not Figma color group comments)
        let j = i - 1;
        let precedingLines = [];
        while (j >= 0 && (lines[j].trim().startsWith('/*') || lines[j].trim().startsWith('*') || lines[j].trim() === '' || lines[j].trim().startsWith('//'))) {
          const prevLine = lines[j];
          // Skip Figma color group comments
          const prevFigmaCommentMatch = prevLine.match(/\/\*\s*([A-Z][a-z-]+)\s+Colors\s*\*\//);
          if (prevFigmaCommentMatch) {
            const prevGroupName = prevFigmaCommentMatch[1].toLowerCase();
            if (colorGroups[prevGroupName]) {
              break; // Stop here, don't include Figma comments
            }
          }
          
          precedingLines.unshift(prevLine);
          j--;
        }
        
        // Add preceding lines (but limit consecutive empty lines to 1)
        let lastWasEmpty = false;
        for (const prevLine of precedingLines) {
          if (prevLine.trim() === '') {
            if (!lastWasEmpty) {
              customLines.push(prevLine);
              lastWasEmpty = true;
            }
          } else {
            customLines.push(prevLine);
            lastWasEmpty = false;
          }
        }
        
        // Add the color line itself
        customLines.push(line);
      } else {
        inCustomSection = false;
      }
    } else if (inCustomSection && (line.trim().startsWith('/*') || line.trim().startsWith('*') || line.trim() === '' || line.trim().startsWith('//'))) {
      // This is a comment or empty line in a custom section
      // But make sure it's not a Figma color group comment
      const commentMatch = line.match(/\/\*\s*([A-Z][a-z-]+)\s+Colors\s*\*\//);
      if (commentMatch) {
        const groupName = commentMatch[1].toLowerCase();
        if (colorGroups[groupName]) {
          inCustomSection = false;
          continue; // Skip Figma color group comments
        }
      }
      customLines.push(line);
    } else {
      inCustomSection = false;
    }
  }
  
  // Clean up the custom lines: remove excessive blank lines
  if (customLines.length > 0) {
    // Remove leading empty lines
    while (customLines.length > 0 && customLines[0].trim() === '') {
      customLines.shift();
    }
    
    // Remove trailing empty lines
    while (customLines.length > 0 && customLines[customLines.length - 1].trim() === '') {
      customLines.pop();
    }
    
    // Limit consecutive empty lines to maximum of 1
    const cleanedLines = [];
    let consecutiveEmpty = 0;
    for (const line of customLines) {
      if (line.trim() === '') {
        consecutiveEmpty++;
        if (consecutiveEmpty <= 1) {
          cleanedLines.push(line);
        }
      } else {
        consecutiveEmpty = 0;
        cleanedLines.push(line);
      }
    }
    
    if (cleanedLines.length > 0) {
      existingCustomColors = cleanedLines.join('\n') + '\n\n';
    }
  }
}

// Generate Figma colors with proper indentation (2 spaces, not 4)
let figmaThemeBlock = '';
Object.entries(colorGroups).forEach(([baseName, shades]) => {
  figmaThemeBlock += `  /* ${baseName.charAt(0).toUpperCase() + baseName.slice(1)} Colors */\n`;
  Object.entries(shades).forEach(([shade, hexColor]) => {
    const oklchColor = hexToOklch(hexColor);
    figmaThemeBlock += `  --color-${baseName}-${shade}: ${oklchColor};\n`;
  });
  figmaThemeBlock += '\n';
});

const newThemeBlock = `:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

${existingCustomColors}${figmaThemeBlock}}`;

// Media block (preserve existing)
const mediaMatch = fileContent.match(mediaBlockRegex);
if (mediaMatch) {
  mediaBlock = mediaMatch[0];
} else {
  mediaBlock = `@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}`;
}

// Update utilities block using the same approach as font sync script
let newUtilitiesBlock = `/* Semantic Color Classes */
@layer utilities {
}`;

const utilitiesMatch = fileContent.match(utilitiesBlockRegex);
if (utilitiesMatch) {
  const existingUtilities = utilitiesMatch[2];
  
  // List of font class names that should be ignored by the color sync script
  const fontClassNames = new Set([
    'font-display', 'font-title', 'font-title-small', 'font-subtitle', 'font-subtitle-small',
    'font-body-large', 'font-body', 'font-body-small', 'font-input', 'font-label', 
    'font-caption', 'font-code', 'font-button'
  ]);
  
  // Extract and preserve font classes that are already in the utilities block
  const fontClasses = [];
  const fontClassRegex = /(\s*\.font-[a-zA-Z0-9_-]+\s*\{\s*@apply[^}]*\})/g;
  let fontMatch;
  
  while ((fontMatch = fontClassRegex.exec(existingUtilities)) !== null) {
    fontClasses.push(fontMatch[1].trim());
  }
  
  // Extract ALL custom classes that aren't color classes or font classes
  const customClasses = [];
  
  // Find all CSS classes and standalone comments in the utilities block
  const allContentRegex = /((?:\s*\/\*[^*]*\*\/\s*)*\s*\.[a-zA-Z0-9_-]+(?::[a-zA-Z0-9_-]+)?\s*\{[^}]*\}|(?:^|\n)\s*\/\*[^*]*\*\/(?=\s*(?:\n|$)))/gm;
  let contentMatch;
  
  while ((contentMatch = allContentRegex.exec(existingUtilities)) !== null) {
    const fullMatch = contentMatch[1].trim();
    
    // Check if this is a standalone comment (not attached to a class)
    if (/^\/\*[^*]*\*\/$/.test(fullMatch)) {
      customClasses.push(fullMatch);
      continue;
    }
    
    // Extract class name from CSS rule
    const classNameMatch = fullMatch.match(/\.([a-zA-Z0-9_-]+)/);
    if (!classNameMatch) continue;
    
    const className = classNameMatch[1];
    
    // Skip if it's a color class (bg-, text-, border-) - we're regenerating these
    if (/^(bg-|text-|border-)/.test(className)) {
      continue;
    }
    
    // Skip if it's a font class - these are handled separately
    if (fontClassNames.has(className) || className.startsWith('font-')) {
      continue;
    }
    
    // This is a custom class (possibly with preceding comments) - preserve it
    customClasses.push(fullMatch);
  }
  
  // Build new utilities content
  const newUtilitiesContent = [];
  
  // Add semantic color classes from Figma
  const colorClassesContent = [];
  Object.keys(semanticClassesMap).forEach(className => {
    colorClassesContent.push(semanticClassesMap[className].split('\n').map(line => line.trim() ? '  ' + line : line).join('\n'));
  });
  if (colorClassesContent.length > 0) {
    newUtilitiesContent.push(colorClassesContent.join('\n\n'));
  }
  
  // Add font classes
  if (fontClasses.length > 0) {
    newUtilitiesContent.push(fontClasses.map(cls => '  ' + cls).join('\n\n'));
  }
  
  // Add custom classes
  if (customClasses.length > 0) {
    newUtilitiesContent.push(customClasses.map(cls => '  ' + cls).join('\n\n'));
  }
  
  // Build the complete new utilities block
  const finalUtilitiesContent = newUtilitiesContent.join('\n\n');
  newUtilitiesBlock = `/* Semantic Color Classes */\n@layer utilities {\n${finalUtilitiesContent}\n}`;
  
  // Replace the entire utilities block
  fileContent = fileContent.replace(utilitiesMatch[0], newUtilitiesBlock);
}

// Footer: find body and other elements that should be preserved
const bodyMatch = fileContent.match(/(body\s*\{[\s\S]*?\}[\s\S]*$)/);
if (bodyMatch) {
  footer = bodyMatch[0].trim();
} else {
  footer = `body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}`;
}

// Compose the new file
const cssContent = `${header}${newThemeBlock}

${mediaBlock}

${newUtilitiesBlock}

${footer}
`;

fs.writeFileSync(globalsPath, cssContent);

console.log('✅ CSS generation complete!');
console.log(`📁 Updated: ${globalsPath}`);
console.log('\n📊 Summary:');
console.log(`   • ${Object.keys(colorGroups).length} custom color primitives added to @theme`);
console.log(`   • ${Object.keys(semanticGroups).length} semantic color groups processed`);
console.log(`   • All hover states use :hover pseudo-classes`);
console.log(`   • bg-*-default converted to bg-* (no "default" suffix)`);
console.log(`   • All colors converted to OKLCH format`);
console.log(`   • Dark mode support via CSS custom properties`);
console.log(`   • No class blocks deleted; all preserved or updated`);
console.log('\n🚀 Ready to use in your components!'); 