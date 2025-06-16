const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { promisify } = require('util');
const stream = require('stream');

const pipeline = promisify(stream.pipeline);

const logos = [
  {
    name: 'openai.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  },
  {
    name: 'langchain.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/LangChain_logo.png',
  },
  {
    name: 'nlp.svg',
    url: 'https://www.vectorlogo.zone/logos/tensorflow/tensorflow-icon.svg', // Placeholder
  },
  {
    name: 'neural.svg',
    url: 'https://www.vectorlogo.zone/logos/tensorflow/tensorflow-icon.svg',
  },
  {
    name: 'pinecone.svg',
    url: 'https://www.vectorlogo.zone/logos/pinecone-io/pinecone-io-ar21.svg',
  },
  {
    name: 'adaptive.svg',
    url: 'https://www.svgrepo.com/show/533621/artificial-intelligence-ai.svg',
  },
  {
    name: 'gpt4.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  },
  {
    name: 'speech.svg',
    url: 'https://www.vectorlogo.zone/logos/amazon/amazon-icon.svg', // Placeholder
  },
  {
    name: 'studybud.svg',
    url: 'https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg', // Placeholder
  },
];

const downloadLogo = async (logo: { name: string; url: string }) => {
  const outputPath = path.join(__dirname, '../../public/official-tech-logos', logo.name);
  
  try {
    const response = await axios({
      method: 'GET',
      url: logo.url,
      responseType: 'stream',
    });
    
    await pipeline(
      response.data,
      fs.createWriteStream(outputPath)
    );
    
    console.log(`Downloaded ${logo.name} successfully`);
  } catch (error) {
    console.error(`Error downloading ${logo.name}:`, error.message);
  }
};

const downloadAllLogos = async () => {
  // Create directory if it doesn't exist
  const dir = path.join(__dirname, '../../public/official-tech-logos');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Download all logos
  for (const logo of logos) {
    await downloadLogo(logo);
  }
};

downloadAllLogos();
