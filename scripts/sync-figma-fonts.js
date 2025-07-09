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

// Step 3: Add Google Fonts import if not present
if (!fileContent.includes('@import url(\'https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&family=Mukta:wght@200;300;400;500;600;700;800&display=swap\');')) {
  fileContent = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&family=Mukta:wght@200;300;400;500;600;700;800&display=swap');\n@import url('https://fonts.googleapis.com/css2?family=Bree+Serif&family=DM+Serif+Text:ital@0;1&family=Mukta:wght@200;300;400;500;600;700;800&display=swap');\n\n${fileContent}`;
}

// Step 4: Update theme block with font families
const themeBlockRegex = /@theme inline \{([^}]*)\}/;
const themeMatch = fileContent.match(themeBlockRegex);

if (themeMatch) {
  let themeContent = themeMatch[1];
  
  // Update font-sans definition
  if (themeContent.includes('--font-sans: var(--font-geist-sans)')) {
    themeContent = themeContent.replace(
      '--font-sans: var(--font-geist-sans)',
      '--font-sans: "Mukta", ui-sans-serif, system-ui, sans-serif'
    );
  } else if (!themeContent.includes('--font-sans: "Mukta"')) {
    // Find the right place to insert font-sans
    const foregroundIndex = themeContent.indexOf('--color-foreground:');
    if (foregroundIndex !== -1) {
      const lineEnd = themeContent.indexOf(';', foregroundIndex) + 1;
      const insertPoint = themeContent.indexOf('\n', lineEnd) + 1;
      themeContent = themeContent.slice(0, insertPoint) + 
        '  --font-sans: "Mukta", ui-sans-serif, system-ui, sans-serif;\n' + 
        themeContent.slice(insertPoint);
    }
  }
  
  // Add font-serif if not present
  if (!themeContent.includes('--font-serif:')) {
    const fontSansIndex = themeContent.indexOf('--font-sans:');
    if (fontSansIndex !== -1) {
      const lineEnd = themeContent.indexOf(';', fontSansIndex) + 1;
      const insertPoint = themeContent.indexOf('\n', lineEnd) + 1;
      themeContent = themeContent.slice(0, insertPoint) + 
        '  --font-serif: "Bree Serif", ui-serif, Georgia, serif;\n' + 
        themeContent.slice(insertPoint);
    }
  }
  
  const newThemeBlock = `@theme inline {${themeContent}}`;
  fileContent = fileContent.replace(themeBlockRegex, newThemeBlock);
}

console.log('📝 Step 3: Generating semantic font classes...');

// Step 5: Generate font utilities
const fontUtilities = [];

for (const [styleName, utilities] of Object.entries(processedFonts)) {
  fontUtilities.push(`  .${styleName} {`);
  fontUtilities.push(`    @apply ${utilities};`);
  fontUtilities.push(`  }`);
}

// Step 7: Update utilities block
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
  const fontClassesContent = [];
  for (const [styleName, utilities] of Object.entries(processedFonts)) {
    fontClassesContent.push(`  .${styleName} {\n    @apply ${utilities};\n  }`);
  }
  if (fontClassesContent.length > 0) {
    newUtilitiesContent.push(fontClassesContent.join('\n\n'));
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
console.log('   • Font families added to @theme block');
console.log('   • Google Fonts imports added');
console.log('   • All font classes use @apply directive');
console.log('   • Custom font classes preserved with warnings');

console.log('\n🚀 Ready to use semantic font classes in your components!'); 