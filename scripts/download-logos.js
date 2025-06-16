const https = require('https');
const fs = require('fs');
const path = require('path');

const LOGOS_DIR = path.join(__dirname, '../public/official-tech-logos');

// Ensure the directory exists
if (!fs.existsSync(LOGOS_DIR)) {
    fs.mkdirSync(LOGOS_DIR, { recursive: true });
}

const logosToDownload = [
    // {
    //     name: 'nextjs',
    //     url: 'https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png',
    //     filename: 'nextjs.png'
    // },
    {
        name: 'react',
        url: 'https://raw.githubusercontent.com/reactjs/reactjs.org/main/src/icons/logo.svg',
        filename: 'react.svg'
    },
    // {
    //     name: 'typescript',
    //     url: 'https://raw.githubusercontent.com/microsoft/TypeScript-Website/v2/packages/typescriptlang-org/static/branding/ts-logo-512.svg',
    //     filename: 'typescript.svg'
    // },
    // {
    //     name: 'tailwind',
    //     url: 'https://raw.githubusercontent.com/tailwindlabs/tailwindcss.com/master/src/img/brand/tailwindcss-mark.svg',
    //     filename: 'tailwind.svg'
    // },
    // {
    //     name: 'prisma',
    //     url: 'https://raw.githubusercontent.com/prisma/presskit/main/Assets/Prisma-DarkSymbol.svg',
    //     filename: 'prisma.svg'
    // },
    // {
    //     name: 'stripe',
    //     url: 'https://b.stripecdn.com/site-srv/assets/img/v3/home/stripe-logo-slate-57dcb7f5fb667b68662001789db95152.svg',
    //     filename: 'stripe.svg'
    // },
    // {
    //     name: 'auth',
    //     url: 'https://authjs.dev/img/logo/logo-sm.png',
    //     filename: 'auth.png'
    // },
    {
        name: 'framer',
        url: 'https://raw.githubusercontent.com/framer/motion/main/website/public/images/icon.svg',
        filename: 'framer.svg'
    },
    // {
    //     name: 'vercel',
    //     url: 'https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png',
    //     filename: 'vercel.png'
    // }
];

function downloadFile(url, filename) {
    return new Promise((resolve, reject) => {
        const filepath = path.join(LOGOS_DIR, filename);
        const file = fs.createWriteStream(filepath);

        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
}

async function downloadSelectedLogos() {
    console.log('Starting selected logo downloads...');

    for (const logo of logosToDownload) {
        try {
            // Delete existing file before downloading new one
            const filepath = path.join(LOGOS_DIR, logo.filename);
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
                console.log(`Deleted existing: ${logo.filename}`);
            }
            await downloadFile(logo.url, logo.filename);
        } catch (error) {
            console.error(`Error downloading ${logo.name}:`, error.message);
        }
    }

    console.log('Finished downloading selected logos!');
}

downloadSelectedLogos(); 