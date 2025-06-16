const fs = require('fs');
const path = require('path');
const https = require('https');

// Ensure the target directory exists
const targetDir = path.join(__dirname, '../public/official-tech-logos');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// List of logos to download with their URLs
const logos = [
  {
    name: 'openai.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg'
  },
  {
    name: 'langchain.png',
    url: 'https://github.com/langchain-ai/langchain/raw/master/docs/static/img/icon.png'
  },
  {
    name: 'nlp.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg'
  },
  {
    name: 'neural.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg'
  },
  {
    name: 'pinecone.svg',
    url: 'https://storage.googleapis.com/pinecone-docs/Pinecone-logo-notext.svg'
  },
  {
    name: 'adaptive.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Tensorflow_logo.svg'
  },
  {
    name: 'gpt4.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg'
  },
  {
    name: 'speech.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Google_mic.svg'
  },
  {
    name: 'studybud.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'
  }
];

// Function to download a file
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

// Download all logos
async function downloadAllLogos() {
  for (const logo of logos) {
    const filePath = path.join(targetDir, logo.name);
    try {
      await downloadFile(logo.url, filePath);
      console.log(`Downloaded ${logo.name} successfully`);
    } catch (error) {
      console.error(`Error downloading ${logo.name}:`, error.message);
    }
  }
}

// Run the download
console.log('Starting logo downloads...');
downloadAllLogos().then(() => {
  console.log('All downloads completed!');
}).catch(error => {
  console.error('Error during downloads:', error);
  process.exit(1);
});
