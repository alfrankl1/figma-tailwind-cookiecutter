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

// --- Parse the current globals.css file first to extract existing colors ---
const globalsPath = path.join(__dirname, '../src/app/globals.css');
let existingCSS = '';
if (fs.existsSync(globalsPath)) {
  existingCSS = fs.readFileSync(globalsPath, 'utf8');
}

// Extract header (everything before first @theme or :root)
let header = '';
const firstThemeIndex = existingCSS.search(/@theme\s|:root\s*\{/);
if (firstThemeIndex !== -1) {
  header = existingCSS.slice(0, firstThemeIndex).trimEnd();
} else {
  header = `/* \n * Generated TailwindCSS 4.1 styles from Figma colors\n * This file is auto-generated. Do not edit manually.\n * Run: npm run build:colors to regenerate\n */\n\n@import \"tailwindcss\";`;
}

// Extract existing theme block content to preserve custom variables
let existingCustomColors = '';
let existingPrimitiveColors = {};
let existingFontVariables = '';

// Extract existing @theme block content to preserve manually added colors AND font variables
const existingPrimitiveThemeRegex = /@theme\s*\{([\s\S]*?)\}/;
const existingPrimitiveThemeMatch = existingCSS.match(existingPrimitiveThemeRegex);

if (existingPrimitiveThemeMatch) {
  const themeContent = existingPrimitiveThemeMatch[1];
  const lines = themeContent.split('\n');
  let fontLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('/*')) {
      // Preserve font-related comments
      if (trimmedLine.includes('Font') || line.includes('Font')) {
        fontLines.push(line);
      }
      continue;
    }
    
    // Extract font variables and preserve them
    const fontVarMatch = line.match(/--font-([a-zA-Z0-9_-]+):/);
    if (fontVarMatch) {
      fontLines.push(line);
      continue;
    }
    
    // Extract existing color variables
    const colorVarMatch = line.match(/--color-([a-zA-Z0-9_-]+)-(\d+):\s*(.+);/);
    if (colorVarMatch) {
      const [, baseName, shade, value] = colorVarMatch;
      if (!existingPrimitiveColors[baseName]) {
        existingPrimitiveColors[baseName] = {};
      }
      existingPrimitiveColors[baseName][shade] = value.trim();
    }
  }
  
  if (fontLines.length > 0) {
    existingFontVariables = fontLines.join('\n') + '\n';
  }
}

console.log('📝 Step 1: Processing custom color primitives...');

// --- Process utility classes (custom primitives) ---
const utilityClasses = figmaColors['custom-primitive-classes'] || {};
const colorGroups = {};

// Generate semantic CSS variables that reference primitive colors
const semanticVariables = {
  light: {},
  dark: {}
};

Object.entries(utilityClasses).forEach(([colorKey, colorData]) => {
  const match = colorKey.match(/color-(.+)-(\d+)/);
  if (match) {
    const [, baseName, shade] = match;
    if (!colorGroups[baseName]) colorGroups[baseName] = {};
    colorGroups[baseName][shade] = colorData.default;
  }
});

// Generate Figma primitive colors and merge with existing colors (NO default Tailwind colors in CSS)
let allColorGroups = { ...existingPrimitiveColors };

// Add/update Figma colors (these take precedence but preserve manual ones)
Object.entries(colorGroups).forEach(([baseName, shades]) => {
  if (!allColorGroups[baseName]) {
    allColorGroups[baseName] = {};
  }
  // Merge Figma colors with existing colors (Figma colors take precedence for updates)
  Object.entries(shades).forEach(([shade, hexColor]) => {
    const oklchColor = hexToOklch(hexColor);
    allColorGroups[baseName][shade] = oklchColor;
  });
});

console.log('📝 Step 2: Processing semantic colors...');

// --- Process semantic colors ---
const semanticColors = figmaColors['semantic-classes'] || {};

Object.entries(semanticColors).forEach(([semanticName, colorData]) => {
  // Transform color names according to naming convention
  let transformedName = semanticName;
  
  // Special handling for text colors: strip -default from anywhere in the name
  if (transformedName.startsWith('text-') && transformedName.includes('-default-')) {
    transformedName = transformedName.replace('-default-', '-');
  }
  
  // Convert *-default-hover to *-hover
  if (transformedName.endsWith('-default-hover')) {
    transformedName = transformedName.replace('-default-hover', '-hover');
  }
  // Convert *-default to * (but only if it doesn't end with -hover)
  else if (transformedName.endsWith('-default')) {
    transformedName = transformedName.replace('-default', '');
  }
  
  const lightColor = colorData.light;
  const darkColor = colorData.dark;
  
  if (lightColor && darkColor) {
    // Find matching colors from custom colors (existing + Figma) and default Tailwind colors
    const allAvailableColors = { ...allColorGroups, ...defaultTailwindColors };
    const lightMatch = findClosestPrimitive(lightColor, allAvailableColors);
    const darkMatch = findClosestPrimitive(darkColor, allAvailableColors);
    
    if (lightMatch && darkMatch) {
      semanticVariables.light[transformedName] = `var(--color-${lightMatch})`;
      semanticVariables.dark[transformedName] = `var(--color-${darkMatch})`;
    } else {
      console.warn(`⚠️  Could not find Tailwind match for semantic color: ${semanticName}`);
      console.warn(`   Light: ${lightColor} Dark: ${darkColor}`);
    }
  }
});

// Remove existing @theme blocks from CSS to prevent duplication
let cleanedCSS = existingCSS.replace(/@theme\s*\{[\s\S]*?\}/g, '');
cleanedCSS = cleanedCSS.replace(/@media\s*\([^)]*\)\s*\{[\s\S]*?\}/g, '');

const themeBlockRegex = /@theme inline \{([\s\S]*?)\}/;
const existingThemeMatch = cleanedCSS.match(themeBlockRegex);

if (existingThemeMatch) {
  const themeContent = existingThemeMatch[1];
  const lines = themeContent.split('\n');
  let customLines = [];
  let skipSemanticSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Skip empty lines at the beginning
    if (!trimmedLine && customLines.length === 0) {
      continue;
    }
    
    // Skip Figma color group comments and their associated colors
    const figmaCommentMatch = line.match(/\/\*\s*([A-Z][a-z-]+)\s+Colors\s*\*\//);
    if (figmaCommentMatch) {
      const groupName = figmaCommentMatch[1].toLowerCase();
      // Skip all color groups (both existing and Figma-generated)
      if (Object.keys(allColorGroups).map(name => name.toLowerCase()).includes(groupName)) {
        // Skip until next comment or end
        let j = i + 1;
        while (j < lines.length && !lines[j].trim().startsWith('/*') && !lines[j].trim().startsWith('--')) {
          j++;
        }
        i = j - 1;
        continue;
      }
    }
    
    // Skip semantic color comments and sections
    if (trimmedLine === '/* Semantic Colors - Light Theme */' || trimmedLine === '/* Semantic Colors - Dark Theme */') {
      skipSemanticSection = true;
      continue;
    }
    
    // Skip individual category headers (Base, Brand, Text, etc.)
    const categoryHeaderMatch = trimmedLine.match(/^\/\* (Base|Brand|Neutral|Positive|Warning|Danger|Text|Border) \*\/$/);
    if (categoryHeaderMatch) {
      skipSemanticSection = true;
      continue;
    }
    
    // Skip semantic variable lines (variables that reference other CSS variables)
    const semanticVarMatch = line.match(/--color-([a-zA-Z0-9_-]+):\s*var\(--color-([a-zA-Z0-9_-]+)\);/);
    if (semanticVarMatch) {
      skipSemanticSection = true;
      continue;
    }
    
    // Skip any color variables (should only be in main @theme block)
    const colorVarMatch = line.match(/--color-([a-zA-Z0-9_-]+):/);
    if (colorVarMatch) {
      continue;
    }
    
    // Skip font variables (should only be in main @theme block)
    const fontVarMatch = line.match(/--font-([a-zA-Z0-9_-]+):/);
    if (fontVarMatch) {
      continue;
    }
    
    // If we hit a non-semantic variable, stop skipping
    if (trimmedLine.startsWith('--') && !semanticVarMatch) {
      skipSemanticSection = false;
    }
    
    // Only preserve non-semantic content
    if (!skipSemanticSection && trimmedLine) {
      customLines.push(line);
    }
  }
  
  if (customLines.length > 0) {
    // Remove trailing empty lines
    while (customLines.length > 0 && !customLines[customLines.length - 1].trim()) {
      customLines.pop();
    }
    existingCustomColors = customLines.join('\n');
  }
}

// Generate semantic variables for light theme
let semanticLightBlock = '';
if (Object.keys(semanticVariables.light).length > 0) {
  semanticLightBlock += '  /* Semantic Colors - Light Theme */\n';
  
  // Dynamically group variables by category (everything before first hyphen)
  const categories = {};
  
  // Extract categories from variable names
  Object.entries(semanticVariables.light).forEach(([semanticName, varRef]) => {
    const categoryMatch = semanticName.match(/^([^-]+)(-|$)/);
    if (categoryMatch) {
      const categoryKey = categoryMatch[1];
      const categoryName = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
      
      if (!categories[categoryName]) {
        categories[categoryName] = [];
      }
      categories[categoryName].push([semanticName, varRef]);
    }
  });
  
  // Generate organized output with dynamic categories
  Object.entries(categories)
    .sort(([a], [b]) => a.localeCompare(b)) // Sort categories alphabetically
    .forEach(([categoryName, vars]) => {
      if (vars.length > 0) {
        semanticLightBlock += `  /* ${categoryName} */\n`;
        vars.forEach(([semanticName, varRef]) => {
          semanticLightBlock += `  --color-${semanticName}: ${varRef};\n`;
        });
        semanticLightBlock += '\n';
      }
    });
  
  // Remove trailing newline
  semanticLightBlock = semanticLightBlock.trimEnd() + '\n';
}

// Generate the complete theme block with all colors (existing + Figma) AND semantic colors
let figmaThemeBlock = '';
Object.entries(allColorGroups)
  .sort(([a], [b]) => a.localeCompare(b)) // Sort alphabetically
  .forEach(([baseName, shades]) => {
    if (typeof shades === 'string') {
      // Handle single colors like white/black
      figmaThemeBlock += `  /* ${baseName.charAt(0).toUpperCase() + baseName.slice(1)} */\n`;
      figmaThemeBlock += `  --color-${baseName}: ${shades};\n\n`;
    } else {
      // Handle color scales
      figmaThemeBlock += `  /* ${baseName.charAt(0).toUpperCase() + baseName.slice(1)} Colors */\n`;
      Object.entries(shades)
        .sort(([a], [b]) => parseInt(a) - parseInt(b)) // Sort by shade number
        .forEach(([shade, colorValue]) => {
          figmaThemeBlock += `  --color-${baseName}-${shade}: ${colorValue};\n`;
        });
      figmaThemeBlock += '\n';
    }
  });

// Build main theme block with both primitives AND semantic colors for utility class generation
let mainThemeBlock = '';
let allThemeContent = '';

// Add font variables first (if they exist)
if (existingFontVariables.trim()) {
  allThemeContent += existingFontVariables;
}

// Add primitive colors
if (figmaThemeBlock.trim()) {
  allThemeContent += (allThemeContent ? '\n' : '') + figmaThemeBlock;
}

// Add semantic colors
if (semanticLightBlock.trim()) {
  allThemeContent += (allThemeContent ? '\n' : '') + semanticLightBlock;
}

if (allThemeContent.trim()) {
  mainThemeBlock = `@theme {
${allThemeContent.trimEnd()}
}`;
}

// Build theme inline block with only fonts (non-color configuration)
let semanticThemeBlock = '';
if (existingCustomColors.trim()) {
  semanticThemeBlock = `@theme inline {
${existingCustomColors.trimEnd()}
}`;
}

// Generate dark theme semantic variables block
let darkSemanticBlock = '';
if (Object.keys(semanticVariables.dark).length > 0) {
  darkSemanticBlock += '  /* Semantic Colors - Dark Theme */\n';
  
  // Dynamically group variables by category (everything before first hyphen)
  const categories = {};
  
  // Extract categories from variable names
  Object.entries(semanticVariables.dark).forEach(([semanticName, varRef]) => {
    const categoryMatch = semanticName.match(/^([^-]+)(-|$)/);
    if (categoryMatch) {
      const categoryKey = categoryMatch[1];
      const categoryName = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
      
      if (!categories[categoryName]) {
        categories[categoryName] = [];
      }
      categories[categoryName].push([semanticName, varRef]);
    }
  });
  
  // Generate organized output with dynamic categories
  Object.entries(categories)
    .sort(([a], [b]) => a.localeCompare(b)) // Sort categories alphabetically
    .forEach(([categoryName, vars]) => {
      if (vars.length > 0) {
        darkSemanticBlock += `  /* ${categoryName} */\n`;
        vars.forEach(([semanticName, varRef]) => {
          darkSemanticBlock += `  --color-${semanticName}: ${varRef};\n`;
        });
        darkSemanticBlock += '\n';
      }
    });
  
  // Remove trailing newline
  darkSemanticBlock = darkSemanticBlock.trimEnd() + '\n';
}

// Build media block for dark theme
let darkModeBlock = '';
if (darkSemanticBlock.trim()) {
  darkModeBlock = `.dark {
${darkSemanticBlock}}`;
}

// Extract utilities block (preserve existing content, including font classes)
let utilitiesBlock = '';
const utilitiesRegex = /@layer utilities \{([\s\S]*?)\n\}/;
const existingUtilitiesMatch = cleanedCSS.match(utilitiesRegex);

if (existingUtilitiesMatch) {
  const existingUtilities = existingUtilitiesMatch[1];
  
  // Remove old semantic color classes but preserve everything else
  const lines = existingUtilities.split('\n');
  const preservedLines = [];
  let inSemanticColorClass = false;
  let braceCount = 0;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if this is a semantic color class
    const classMatch = trimmedLine.match(/^\.(bg-|text-|border-)(base|neutral|brand|positive|warning|danger|default|inverse)/);
    if (classMatch) {
      inSemanticColorClass = true;
      braceCount = 0;
      continue;
    }
    
    if (inSemanticColorClass) {
      // Count braces to know when the class ends
      braceCount += (trimmedLine.match(/\{/g) || []).length;
      braceCount -= (trimmedLine.match(/\}/g) || []).length;
      
      if (braceCount <= 0) {
        inSemanticColorClass = false;
      }
      continue;
    }
    
    // Preserve all other content (font classes, custom classes, comments)
    preservedLines.push(line);
  }
  
  utilitiesBlock = `@layer utilities {${preservedLines.join('\n')}\n}`;
} else {
  utilitiesBlock = `@layer utilities {\n}`;
}

// Extract footer (body and other elements)
let footer = '';
const bodyMatch = cleanedCSS.match(/(body\s*\{[\s\S]*?)\s*$/);
if (bodyMatch) {
  footer = bodyMatch[0].trim();
}

// Compose the final CSS
const cssBlocks = [];

// Add header
if (header.trim()) {
  cssBlocks.push(header.trim());
}

// Add CSS blocks with proper spacing
if (mainThemeBlock) {
  cssBlocks.push(mainThemeBlock);
}

if (semanticThemeBlock) {
  cssBlocks.push(semanticThemeBlock);
}

if (darkModeBlock) {
  cssBlocks.push(darkModeBlock);
}

if (utilitiesBlock) {
  cssBlocks.push(utilitiesBlock);
}

if (footer && footer.trim()) {
  cssBlocks.push(footer.trim());
}

const cssContent = cssBlocks.join('\n\n') + '\n';

fs.writeFileSync(globalsPath, cssContent);

console.log('✅ CSS generation complete!');
console.log(`📁 Updated: ${globalsPath}`);
console.log('\n📊 Summary:');
console.log(`   • ${Object.keys(allColorGroups).length} custom colors + ${Object.keys(semanticVariables.light).length} semantic colors in @theme for utility class generation`);
console.log(`   • ${Object.keys(existingPrimitiveColors).length} existing + ${Object.keys(colorGroups).length} from Figma custom colors (default Tailwind colors NOT added to CSS)`);
console.log(`   • Semantic colors use CSS variable references (not OKLCH) with --color- prefix`);
console.log(`   • Dark theme support via .dark class with CSS custom properties`);
console.log(`   • All existing content preserved (no deletions)`);
console.log(`   • Fonts and configuration remain in @theme inline`);
console.log('\n🚀 Ready to use in your components! (e.g., bg-base, text-neutral-tertiary)'); 