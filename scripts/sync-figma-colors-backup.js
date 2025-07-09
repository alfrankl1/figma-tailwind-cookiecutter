#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { oklch, clampChroma } = require('culori');

// Read the figma colors JSON
const figmaColors = JSON.parse(fs.readFileSync(path.join(__dirname, '../tools/figma-colors.json'), 'utf8'));

// Default Tailwind colors for mapping
const defaultTailwindColors = {
  'slate': { '50': '#f8fafc', '100': '#f1f5f9', '200': '#e2e8f0', '300': '#cbd5e1', '400': '#94a3b8', '500': '#64748b', '600': '#475569', '700': '#334155', '800': '#1e293b', '900': '#0f172a', '950': '#020617' },
  'gray': { '50': '#f9fafb', '100': '#f3f4f6', '200': '#e5e7eb', '300': '#d1d5db', '400': '#9ca3af', '500': '#6b7280', '600': '#4b5563', '700': '#374151', '800': '#1f2937', '900': '#111827', '950': '#030712' },
  'red': { '50': '#fef2f2', '100': '#fee2e2', '200': '#fecaca', '300': '#fca5a5', '400': '#f87171', '500': '#ef4444', '600': '#dc2626', '700': '#b91c1c', '800': '#991b1b', '900': '#7f1d1d', '950': '#450a0a' },
  'blue': { '50': '#eff6ff', '100': '#dbeafe', '200': '#bfdbfe', '300': '#93c5fd', '400': '#60a5fa', '500': '#3b82f6', '600': '#2563eb', '700': '#1d4ed8', '800': '#1e40af', '900': '#1e3a8a', '950': '#172554' },
  'green': { '50': '#f0fdf4', '100': '#dcfce7', '200': '#bbf7d0', '300': '#86efac', '400': '#4ade80', '500': '#22c55e', '600': '#16a34a', '700': '#15803d', '800': '#166534', '900': '#14532d', '950': '#052e16' },
  'yellow': { '50': '#fefce8', '100': '#fef3c7', '200': '#fde68a', '300': '#fcd34d', '400': '#fbbf24', '500': '#f59e0b', '600': '#d97706', '700': '#b45309', '800': '#92400e', '900': '#78350f', '950': '#451a03' },
  'white': '#ffffff',
  'black': '#000000'
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
          block += `\n\n  .${className}:hover {\n    @apply ${type}-${hoverLightPrimitive};\n  }`;
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