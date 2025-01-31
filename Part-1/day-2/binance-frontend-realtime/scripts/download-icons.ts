const fs = require('fs');
const path = require('path');
const https = require('https');

const symbols = [
  '1INCH', 'AAVE', 'ADA', 'ALGO', 'ALPHA', 'AMP', 'AR', 'ATOM', 'AVAX', 'AXS',
  'BADGER', 'BAL', 'BAND', 'BAT', 'BCH', 'BNB', 'BNT', 'BTC', 'BUSD', 'CAKE',
  'CEL', 'CHZ', 'COMP', 'CRV', 'CVC', 'DAI', 'DASH', 'DOGE', 'DOT', 'EGLD',
  'ENJ', 'EOS', 'ETC', 'ETH', 'FIL', 'FTT', 'GRT', 'HBAR', 'HNT', 'HOT',
  'HT', 'ICP', 'ICX', 'KAVA', 'KNC', 'KSM', 'LINK', 'LRC', 'LTC', 'LUNA',
  'MANA', 'MATIC', 'MKR', 'NANO', 'NEAR', 'NEO', 'NEXO', 'NMR', 'NU', 'OCEAN',
  'OMG', 'ONT', 'OXT', 'PAX', 'PAXG', 'QTUM', 'REN', 'REP', 'RSR', 'RUNE',
  'SAND', 'SC', 'SNX', 'SOL', 'SRM', 'STMX', 'STORJ', 'SUSHI', 'THETA', 'TOMO',
  'TRX', 'TUSD', 'UMA', 'UNI', 'USDC', 'USDT', 'VET', 'WAVES', 'WBTC', 'XEM',
  'XLM', 'XMR', 'XRP', 'XTZ', 'YFI', 'ZEC', 'ZIL', 'ZRX'
];

const iconBaseUrl = 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/';
const outputDir = path.join(process.cwd(), 'public', 'icons');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadIcon(symbol) {
  return new Promise((resolve, reject) => {
    const fileName = `${symbol.toLowerCase()}.svg`;
    const filePath = path.join(outputDir, fileName);
    const url = `${iconBaseUrl}${fileName}`;

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filePath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded ${fileName}`);
          resolve();
        });
      } else {
        console.error(`Failed to download ${fileName}: ${response.statusCode}`);
        resolve(); // Continue with next icon even if this one fails
      }
    }).on('error', (err) => {
      console.error(`Error downloading ${fileName}:`, err.message);
      resolve(); // Continue with next icon even if this one fails
    });
  });
}

async function downloadAllIcons() {
  console.log('Starting icon downloads...');
  await Promise.all(symbols.map(downloadIcon));
  console.log('Finished downloading icons');
}

downloadAllIcons(); 