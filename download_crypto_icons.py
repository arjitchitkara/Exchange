import os
import time
import logging
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# List of cryptocurrency symbols
symbols = [
    "AAVE_USDC", "ACT_USDC", "ANIME_USDC", "BOME_USDC", "BONK_USDC", "BTC_USDC",
    "BTC_USDC_PERP", "CLOUD_USDC", "DOGE_USDC_PERP", "DRIFT_USDC", "ENA_USDC",
    "ETH_USDC", "ETH_USDC_PERP", "GOAT_USDC", "HNT_USDC", "HONEY_USDC", "IO_USDC",
    "JTO_USDC", "JUP_USDC", "J_USDC", "KMNO_USDC", "LDO_USDC", "LINK_USDC",
    "MELANIA_USDC", "MEW_USDC", "ME_USDC", "MOBILE_USDC", "MOODENG_USDC",
    "MOTHER_USDC", "ONDO_USDC", "PENGU_USDC", "PEPE_USDC", "POL_USDC",
    "PRCL_USDC", "PYTH_USDC", "RAY_USDC", "RENDER_USDC", "SHFL_USDC",
    "SHIB_USDC", "SOL_USDC", "SOL_USDC_PERP", "SONIC_USDC", "STRK_USDC",
    "SUI_USDC_PERP", "TNSR_USDC", "TRUMP_USDC", "UNI_USDC", "USDT_USDC",
    "WEN_USDC", "WIF_USDC", "WLD_USDC", "W_USDC", "XRP_USDC_PERP", "ZEX_USDC", "ZRO_USDC"
]

try:
    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920x1080")

    logging.info("Setting up Chrome WebDriver...")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    # Directory to store icons
    icons_dir = "icons"
    os.makedirs(icons_dir, exist_ok=True)
    logging.info(f"Created icons directory at: {os.path.abspath(icons_dir)}")

    # Google Images search URL template
    google_search_url = "https://www.google.com/search?tbm=isch&q={query}"

    for symbol in symbols:
        try:
            base_symbol = symbol.split("_")[0]
            query = f"{base_symbol} cryptocurrency logo png"
            search_url = google_search_url.format(query=query.replace(" ", "+"))
            
            logging.info(f"Searching for {symbol} logo...")
            driver.get(search_url)
            time.sleep(2)  # Wait for the page to load
            
            # Get page source and parse it
            soup = BeautifulSoup(driver.page_source, "html.parser")
            img_tags = soup.find_all("img")
            
            # Attempt to download the first valid image
            downloaded = False
            for img_tag in img_tags[1:]:  # Skip the first image as it's usually a thumbnail
                img_url = img_tag.get("src") or img_tag.get("data-src")
                if img_url and "http" in img_url and not img_url.endswith(".gif"):
                    try:
                        response = requests.get(img_url, stream=True, timeout=10)
                        if response.status_code == 200 and response.headers.get('content-type', '').startswith('image/'):
                            file_path = os.path.join(icons_dir, f"{symbol}.png")
                            with open(file_path, "wb") as file:
                                for chunk in response.iter_content(1024):
                                    file.write(chunk)
                            logging.info(f"Successfully downloaded: {symbol}.png")
                            downloaded = True
                            break
                    except Exception as e:
                        logging.warning(f"Failed to download image for {symbol}: {str(e)}")
                        continue
            
            if not downloaded:
                logging.error(f"Could not find a valid image for {symbol}")
            
            time.sleep(1)  # Add delay between requests
            
        except Exception as e:
            logging.error(f"Error processing {symbol}: {str(e)}")
            continue

except Exception as e:
    logging.error(f"Critical error: {str(e)}")
finally:
    try:
        driver.quit()
        logging.info("Chrome WebDriver closed successfully")
    except:
        pass

logging.info("Script completed!") 