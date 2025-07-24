#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the figma fonts JSON
const figmaFonts = JSON.parse(fs.readFileSync(path.join(__dirname, '../tools/figma-fonts.json'), 'utf8'));

// Font family mapping
const fontFamilyMap = {
  'Mukta': 'font-sans',
  'Bree Serif': 'font-serif', 
  'Menlo': 'font-mono'
};

// Font weight mapping
const fontWeightMap = {
  'Regular': 'font-normal',
  'Medium': 'font-medium',
  'SemiBold': 'font-semibold',
  'Bold': 'font-bold',
  'ExtraBold': 'font-extrabold',
  'Black': 'font-black',
  'Light': 'font-light',
  'ExtraLight': 'font-extralight',
  'Thin': 'font-thin'
};

// Tailwind font sizes (in pixels for comparison)
const tailwindFontSizes = [
  { size: 12, class: 'text-xs' },
  { size: 14, class: 'text-sm' },
  { size: 16, class: 'text-base' },
  { size: 18, class: 'text-lg' },
  { size: 20, class: 'text-xl' },
  { size: 24, class: 'text-2xl' },
  { size: 30, class: 'text-3xl' },
  { size: 36, class: 'text-4xl' },
  { size: 48, class: 'text-5xl' },
  { size: 60, class: 'text-6xl' },
  { size: 72, class: 'text-7xl' },
  { size: 96, class: 'text-8xl' },
  { size: 128, class: 'text-9xl' }
];

// Tailwind line heights
const tailwindLineHeights = [
  { value: 1, class: 'leading-none' },
  { value: 1.25, class: 'leading-tight' },
  { value: 1.375, class: 'leading-snug' },
  { value: 1.5, class: 'leading-normal' },
  { value: 1.625, class: 'leading-relaxed' },
  { value: 2, class: 'leading-loose' }
];

// Tailwind letter spacing
const tailwindLetterSpacing = [
  { value: -0.05, class: 'tracking-tighter' },
  { value: -0.025, class: 'tracking-tight' },
  { value: 0, class: 'tracking-normal' },
  { value: 0.025, class: 'tracking-wide' },
  { value: 0.05, class: 'tracking-wider' },
  { value: 0.1, class: 'tracking-widest' }
];

// Helper function to find closest match
function findClosestMatch(value, options, key) {
  return options.reduce((closest, option) => {
    const diff = Math.abs(value - option[key]);
    const closestDiff = Math.abs(value - closest[key]);
    return diff < closestDiff ? option : closest;
  });
}

// Convert Figma font style to Tailwind utilities
function convertFigmaFontToTailwind(fontStyle) {
  const utilities = [];
  
  // Font family
  const fontFamily = fontFamilyMap[fontStyle.fontFamily] || 'font-sans';
  utilities.push(fontFamily);
  
  // Font weight
  const fontWeight = fontWeightMap[fontStyle.fontWeight] || 'font-normal';
  utilities.push(fontWeight);
  
  // Font size
  const fontSize = findClosestMatch(fontStyle.fontSize, tailwindFontSizes, 'size');
  utilities.push(fontSize.class);
  
  // Line height (calculate based on font size since it's not in the JSON)
  let lineHeight;
  if (fontStyle.fontSize >= 48) {
    lineHeight = 'leading-tight';
  } else if (fontStyle.fontSize >= 24) {
    lineHeight = 'leading-snug';
  } else if (fontStyle.fontSize >= 18) {
    lineHeight = 'leading-normal';
  } else {
    lineHeight = 'leading-relaxed';
  }
  utilities.push(lineHeight);
  
  // Letter spacing
  const letterSpacingValue = fontStyle.letterSpacing ? fontStyle.letterSpacing.value : 0;
  const letterSpacing = findClosestMatch(letterSpacingValue, tailwindLetterSpacing, 'value');
  if (letterSpacing.class !== 'tracking-normal') {
    utilities.push(letterSpacing.class);
  }
  
  return utilities.join(' ');
}

console.log('🔤 Syncing Figma fonts to TailwindCSS 4.1...\n');

// Step 1: Process Figma fonts
console.log('📝 Step 1: Processing Figma text styles...');
const processedFonts = {};

// Process the textStyles array
figmaFonts.textStyles.forEach(textStyle => {
  const className = 'font-' + textStyle.name.toLowerCase().replace(/\s+/g, '-');
  const tailwindUtilities = convertFigmaFontToTailwind(textStyle);
  processedFonts[className] = tailwindUtilities;
  console.log(`   • ${className}: ${tailwindUtilities}`);
});

console.log('\n📝 Step 2: Analyzing existing CSS...');

// Read current CSS file
const cssPath = path.join(__dirname, '../src/app/globals.css');
let fileContent = fs.readFileSync(cssPath, 'utf8');

// Step 2: Parse all --font-* variables in the @theme block
const themeBlockRegex = /@theme\s+(inline\s+)?\{([\s\S]*?)\}/m;
const themeMatch = fileContent.match(themeBlockRegex);
let fontVarMap = {};
if (themeMatch) {
  const themeContent = themeMatch[2]; // Use index 2 since we added a capture group
  // Match all --font-* variables
  const fontVarRegex = /--font-([a-zA-Z0-9_-]+):\s*([^;]+);/g;
  let match;
  while ((match = fontVarRegex.exec(themeContent)) !== null) {
    const varName = match[1].trim();
    const varValue = match[2].replace(/['"]/g, '').trim(); // Remove quotes for easier matching
    fontVarMap[varName] = varValue;
  }
}

// Helper: Find the best matching font variable for a given fontFamily
function getFontClassForFamily(fontFamily) {
  // Try to find a font variable whose value contains the fontFamily
  for (const [varName, varValue] of Object.entries(fontVarMap)) {
    // Only match on the first font in the stack
    const firstFont = varValue.split(',')[0].trim();
    if (firstFont.toLowerCase() === fontFamily.toLowerCase()) {
      return `font-${varName}`;
    }
  }
  // Fallback to font-sans if no match
  return 'font-sans';
}

// Step 3: Generate semantic font classes
console.log('📝 Step 3: Generating semantic font classes...');
const fontUtilities = [];
for (const [styleName, fontStyle] of Object.entries(processedFonts)) {
  // fontStyle here is the Tailwind utility string, but we want to replace the font-* utility with the correct semantic class
  // Get the Figma fontFamily for this style
  const figmaStyle = figmaFonts.textStyles.find(s => 'font-' + s.name.toLowerCase().replace(/\s+/g, '-') === styleName);
  let fontClass = 'font-sans';
  if (figmaStyle) {
    fontClass = getFontClassForFamily(figmaStyle.fontFamily);
  }
  // Replace the font-* utility in the string with the correct semantic class
  const updatedUtilities = fontStyle.replace(/font-(sans|serif|mono)/, fontClass);
  fontUtilities.push(`  .${styleName} {\n    @apply ${updatedUtilities};\n  }`);
}

// Step 5: Update utilities block
const utilitiesRegex = /(@layer utilities \{)([\s\S]*?)(\n\})/;
const utilitiesMatch = fileContent.match(utilitiesRegex);

if (utilitiesMatch) {
  const existingUtilities = utilitiesMatch[2];
  
  // Extract only color classes and preserve them exactly
  const colorClasses = [];
  const colorClassRegex = /(\s*\.(?:bg-|text-|border-)[a-zA-Z0-9_-]+(?::[a-zA-Z0-9_-]+)?\s*\{[^}]*\})/g;
  let colorMatch;
  
  while ((colorMatch = colorClassRegex.exec(existingUtilities)) !== null) {
    colorClasses.push(colorMatch[1].trim());
  }
  
  // Extract ALL custom classes that aren't color classes or Figma font classes
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
    
    // Skip if it's a color class (bg-, text-, border-)
    if (/^(bg-|text-|border-)/.test(className)) {
      continue;
    }
    
    // Skip if it's a Figma font class that we're regenerating
    if (processedFonts[className]) {
      continue;
    }
    
    // This is a custom class (possibly with preceding comments) - preserve it
    customClasses.push(fullMatch);
  }
  
  // Build new utilities content
  const newUtilitiesContent = [];
  
  // Add color classes
  if (colorClasses.length > 0) {
    newUtilitiesContent.push(colorClasses.map(cls => '  ' + cls).join('\n\n'));
  }
  
  // Add font classes
  if (fontUtilities.length > 0) {
    newUtilitiesContent.push(fontUtilities.join('\n\n'));
  }
  
  // Add custom classes
  if (customClasses.length > 0) {
    newUtilitiesContent.push(customClasses.map(cls => '  ' + cls).join('\n\n'));
  }
  
  // Build the complete new utilities block
  const finalUtilitiesContent = newUtilitiesContent.join('\n\n');
  const newUtilitiesBlock = `@layer utilities {\n${finalUtilitiesContent}\n}`;
  
  // Replace the entire utilities block
  fileContent = fileContent.replace(utilitiesRegex, newUtilitiesBlock);
}

// Write the updated CSS
fs.writeFileSync(cssPath, fileContent);

console.log('\n✅ Font sync complete!');
console.log(`📁 Updated: ${cssPath}`);

console.log('\n📊 Summary:');
console.log(`   • ${Object.keys(processedFonts).length} semantic font classes processed`);
console.log('   • Font classes use semantic variables from @theme');
console.log('   • All font classes use @apply directive');
console.log('   • Custom font classes preserved');

console.log('\n🚀 Ready to use semantic font classes in your components!'); 