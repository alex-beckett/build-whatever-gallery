const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(process.cwd(), 'Images');
const TARGET_DIR = path.join(process.cwd(), 'public', 'images');

// Ensure the target directory exists
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Copy images from source to target directory
async function copyImages() {
  try {
    // Read all files from source directory
    const files = fs.readdirSync(SOURCE_DIR);
    
    // Filter for image files
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    // Copy each image file
    imageFiles.forEach((file, index) => {
      const sourcePath = path.join(SOURCE_DIR, file);
      const targetPath = path.join(TARGET_DIR, `image${index + 1}${path.extname(file)}`);
      
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied ${file} to image${index + 1}${path.extname(file)}`);
    });

    console.log('All images copied successfully!');
    console.log(`Total images: ${imageFiles.length}`);
  } catch (error) {
    console.error('Error copying images:', error);
  }
}

copyImages(); 