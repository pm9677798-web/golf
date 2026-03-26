// Hero Background Setup Script
// Run this after extracting images from the zip file

const fs = require('fs');
const path = require('path');

const sourceDir = 'C:\\Users\\prade\\Downloads\\Digitals hero\\assests\\herobackground';
const targetDir = './public/images/hero';

console.log('🎯 Hero Background Setup');
console.log('========================');

// Check if target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log('✅ Created target directory:', targetDir);
}

// Check if source directory exists
if (!fs.existsSync(sourceDir)) {
  console.log('❌ Source directory not found:', sourceDir);
  console.log('📋 Please extract the zip file first:');
  console.log('   1. Extract: C:\\Users\\prade\\Downloads\\Digitals hero\\assests\\herobackground.zip');
  console.log('   2. Then run this script again');
  process.exit(1);
}

// Read source directory
const files = fs.readdirSync(sourceDir);
const imageFiles = files.filter(file => 
  /\.(jpg|jpeg|png|webp)$/i.test(file)
);

if (imageFiles.length === 0) {
  console.log('❌ No image files found in source directory');
  process.exit(1);
}

console.log(`📸 Found ${imageFiles.length} image files`);

// Copy and rename files
imageFiles.forEach((file, index) => {
  const sourceFile = path.join(sourceDir, file);
  const targetFile = path.join(targetDir, `frame-${index + 1}.jpg`);
  
  try {
    fs.copyFileSync(sourceFile, targetFile);
    console.log(`✅ Copied: ${file} → frame-${index + 1}.jpg`);
  } catch (error) {
    console.log(`❌ Error copying ${file}:`, error.message);
  }
});

console.log('');
console.log('🎉 Setup complete!');
console.log(`📁 Images copied to: ${targetDir}`);
console.log(`🔢 Total frames: ${imageFiles.length}`);
console.log('');
console.log('📋 Next steps:');
console.log('1. Update totalFrames prop in AnimatedHeroBackground component');
console.log(`2. Set totalFrames={${imageFiles.length}} in app/page.tsx`);
console.log('3. Test the smooth scroll animation');