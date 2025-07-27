#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔤 Syncing Figma fonts to TailwindCSS 4.1...\n');

// Helper function to parse CSS and extract content from specific blocks
function parseCSSBlock(cssContent, blockType) {
  let startPattern;
  
  if (blockType === '@theme') {
    startPattern = /@theme\s*\{/;
  } else if (blockType === '@layer utilities') {
    startPattern = /@layer\s+utilities\s*\{/;
  }
  
  console.log(`   • Debug: Parsing ${blockType}`);
  
  const startMatch = cssContent.match(startPattern);
  if (!startMatch) {
    console.log(`   • Debug: No start pattern found for ${blockType}`);
    return null;
  }
  
  const startIndex = startMatch.index + startMatch[0].length;
  let braceCount = 1;
  let currentIndex = startIndex;
  
  // Find the matching closing brace by counting braces
  while (currentIndex < cssContent.length && braceCount > 0) {
    const char = cssContent[currentIndex];
    if (char === '{') {
      braceCount++;
    } else if (char === '}') {
      braceCount--;
    }
    currentIndex++;
  }
  
  if (braceCount === 0) {
    const content = cssContent.substring(startIndex, currentIndex - 1);
    console.log(`   • Debug: Successfully extracted ${blockType}, content length: ${content.length}`);
    console.log(`   • Debug: First 100 chars: "${content.substring(0, 100)}"`);
    return content;
  } else {
    console.log(`   • Debug: Unmatched braces for ${blockType}`);
    return null;
  }
}

// Helper function to extract font variables from @theme block
function extractFontVariables(themeContent) {
  const fontVarMap = {};
  const fontVarRegex = /--font-([a-zA-Z0-9_-]+):\s*([^;]+);/g;
  let match;
  
  while ((match = fontVarRegex.exec(themeContent)) !== null) {
    const varName = match[1].trim();
    const varValue = match[2].replace(/['"]/g, '').trim(); // Remove quotes
    fontVarMap[varName] = varValue;
  }
  
  return fontVarMap;
}

// Helper function to extract font utilities from @layer utilities block
function extractFontUtilities(utilitiesContent) {
  const fontUtilities = {};
  
  console.log('   • Debug: extractFontUtilities called with content length:', utilitiesContent.length);
  
  // Match font utility classes (including multiline)
  const fontClassRegex = /\.font-([a-zA-Z0-9_-]+)\s*\{([^}]+)\}/gs;
  let match;
  let matchCount = 0;
  
  while ((match = fontClassRegex.exec(utilitiesContent)) !== null) {
    matchCount++;
    const className = `font-${match[1]}`;
    const applyRule = match[2].trim();
    
    console.log(`   • Debug: Found class ${className}, content: "${applyRule.substring(0, 50)}..."`);
    
    // Extract the @apply directive
    const applyMatch = applyRule.match(/@apply\s+([^;]+);?/s);
    if (applyMatch) {
      fontUtilities[className] = applyMatch[1].trim();
      console.log(`   • Debug: Extracted utility: ${className} = "${applyMatch[1].trim()}"`);
    } else {
      console.log(`   • Debug: No @apply found in: "${applyRule}"`);
    }
  }
  
  console.log(`   • Debug: Total matches found: ${matchCount}`);
  
  return fontUtilities;
}

// Helper function to find semantic font class for a given font family
function getFontClassForFamily(fontFamily, semanticFontVarMap) {
  // Try to find a font variable whose value contains the fontFamily
  for (const [varName, varValue] of Object.entries(semanticFontVarMap)) {
    // Only match on the first font in the stack
    const firstFont = varValue.split(',')[0].trim();
    if (firstFont.toLowerCase() === fontFamily.toLowerCase()) {
      return `font-${varName}`;
    }
  }
  // Fallback to font-sans if no match
  return 'font-sans';
}

// Helper function to replace font family in utility string
function replaceFontFamily(utilityString, newFontClass) {
  // Replace any font-* class with the new semantic font class
  return utilityString.replace(/font-[a-zA-Z0-9_-]+/, newFontClass);
}

// Step 1: Read the Figma fonts CSS file
console.log('📝 Step 1: Reading Figma fonts CSS file...');
const figmaFontsPath = path.join(__dirname, '../tools/figma-fonts.css');

if (!fs.existsSync(figmaFontsPath)) {
  console.error(`❌ Error: figma-fonts.css not found at ${figmaFontsPath}`);
  console.log('Please ensure you have exported your Figma text styles to tools/figma-fonts.css');
  process.exit(1);
}

const figmaFontsContent = fs.readFileSync(figmaFontsPath, 'utf8');

// Step 2: Parse the Figma fonts CSS
console.log('📝 Step 2: Parsing Figma fonts CSS...');

// Extract @theme block from Figma CSS (contains font variable definitions)
const figmaThemeContent = parseCSSBlock(figmaFontsContent, '@theme');
const figmaFontVarMap = figmaThemeContent ? extractFontVariables(figmaThemeContent) : {};

// Extract @layer utilities block from Figma CSS (contains font utility classes)
const figmaUtilitiesContent = parseCSSBlock(figmaFontsContent, '@layer utilities');

// Debug: Show what we extracted
console.log('   • Debug: @layer utilities content found:', !!figmaUtilitiesContent);
if (figmaUtilitiesContent) {
  console.log('   • Debug: First 200 chars of utilities content:', figmaUtilitiesContent.substring(0, 200));
} else {
  console.log('   • Debug: Full CSS file preview:');
  console.log(figmaFontsContent.substring(0, 500));
}

const figmaFontUtilities = figmaUtilitiesContent ? extractFontUtilities(figmaUtilitiesContent) : {};

console.log(`   • Found ${Object.keys(figmaFontVarMap).length} font variables in Figma CSS`);
console.log(`   • Found ${Object.keys(figmaFontUtilities).length} font utilities in Figma CSS`);

// Debug: Show what we found
if (Object.keys(figmaFontVarMap).length > 0) {
  console.log('   • Figma font variables:');
  for (const [key, value] of Object.entries(figmaFontVarMap)) {
    console.log(`     --font-${key}: ${value}`);
  }
}

if (Object.keys(figmaFontUtilities).length > 0) {
  console.log('   • Figma font utilities:');
  for (const [key, value] of Object.entries(figmaFontUtilities)) {
    console.log(`     .${key}: ${value}`);
  }
}

if (Object.keys(figmaFontUtilities).length === 0) {
  console.error('❌ No font utilities found in figma-fonts.css');
  console.log('Please check that your figma-fonts.css file contains @layer utilities with .font-* classes');
  process.exit(1);
}

// Step 3: Read and parse the existing globals.css
console.log('📝 Step 3: Analyzing existing globals.css...');

const cssPath = path.join(__dirname, '../src/app/globals.css');
let fileContent = fs.readFileSync(cssPath, 'utf8');

// Parse all --font-* variables in the @theme block of globals.css
const themeBlockRegex = /@theme\s*\{([\s\S]*?)\}/m;
const themeMatch = fileContent.match(themeBlockRegex);
let semanticFontVarMap = {};

if (themeMatch) {
  const themeContent = themeMatch[1];
  semanticFontVarMap = extractFontVariables(themeContent);
}

console.log(`   • Found ${Object.keys(semanticFontVarMap).length} semantic font variables in globals.css`);

// Debug: Show semantic font variables
if (Object.keys(semanticFontVarMap).length > 0) {
  console.log('   • Semantic font variables:');
  for (const [key, value] of Object.entries(semanticFontVarMap)) {
    console.log(`     --font-${key}: ${value}`);
  }
}

// Step 4: Convert Figma font utilities to use semantic font families
console.log('📝 Step 4: Converting to semantic font classes...');

const convertedFontUtilities = [];

for (const [fullClassName, utilityString] of Object.entries(figmaFontUtilities)) {
  // Extract the font family class from the utility string (e.g., "font-cabin" from the @apply directive)
  const fontClassMatch = utilityString.match(/font-([a-zA-Z0-9_-]+)/);
  
  if (fontClassMatch) {
    const figmaFontVar = fontClassMatch[1]; // e.g., "cabin"
    
    // Look up the actual font family from Figma's @theme block
    const fontFamily = figmaFontVarMap[figmaFontVar];
    
    if (fontFamily) {
      // Get the first font name from the font stack
      const firstFont = fontFamily.split(',')[0].trim().replace(/['"]/g, '');
      
      // Find the corresponding semantic font class
      const semanticFontClass = getFontClassForFamily(firstFont, semanticFontVarMap);
      
      // Replace the specific font class with the semantic one
      const updatedUtilityString = replaceFontFamily(utilityString, semanticFontClass);
      
      convertedFontUtilities.push(`  .${fullClassName} {\n    @apply ${updatedUtilityString};\n  }`);
      
      console.log(`   • ${fullClassName}: font-${figmaFontVar} → ${semanticFontClass} (${firstFont})`);
    } else {
      // If we can't find the font family, keep the original but convert to font-sans
      const updatedUtilityString = replaceFontFamily(utilityString, 'font-sans');
      convertedFontUtilities.push(`  .${fullClassName} {\n    @apply ${updatedUtilityString};\n  }`);
      console.log(`   • ${fullClassName}: ${utilityString} → ${updatedUtilityString} (fallback)`);
    }
  } else {
    // If no font class found, add as-is
    convertedFontUtilities.push(`  .${fullClassName} {\n    @apply ${utilityString};\n  }`);
    console.log(`   • ${fullClassName}: ${utilityString} (no font family detected)`);
  }
}

// Step 5: Update the utilities block in globals.css
console.log('📝 Step 5: Updating globals.css...');

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
    
    // Skip if it's a font class that we're regenerating
    if (className.startsWith('font-') && figmaFontUtilities[className]) {
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
  
  // Add converted font classes
  if (convertedFontUtilities.length > 0) {
    newUtilitiesContent.push(convertedFontUtilities.join('\n\n'));
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
console.log(`   • ${Object.keys(figmaFontUtilities).length} font classes processed from figma-fonts.css`);
console.log('   • Font classes converted to use semantic variables from @theme');
console.log('   • All font classes use @apply directive');
console.log('   • Custom font classes preserved');

console.log('\n🚀 Ready to use semantic font classes in your components!');