const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  console.log('Navigating to https://ironhill.au/ ...');
  await page.goto('https://ironhill.au/', { waitUntil: 'networkidle0', timeout: 60000 });
  
  console.log('Extracting data...');
  const data = await page.evaluate(() => {
    // 提取文本和基础样式
    const textElements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, p, a, button, span, div'));
    const texts = [];
    textElements.forEach(el => {
      // 避免重复收集子元素的文本如果父元素已经包含并且只是简单文本
      if(el.children.length > 0) return; 
      const text = el.innerText ? el.innerText.trim() : '';
      if(text.length > 0) {
        const styles = window.getComputedStyle(el);
        texts.push({
          tag: el.tagName,
          text: text,
          color: styles.color,
          fontSize: styles.fontSize,
          fontFamily: styles.fontFamily,
          fontWeight: styles.fontWeight
        });
      }
    });

    // 提取带有背景的元素
    const allElements = Array.from(document.querySelectorAll('*'));
    const backgrounds = [];
    allElements.forEach(el => {
      const styles = window.getComputedStyle(el);
      if (styles.backgroundImage !== 'none' || (styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent')) {
        backgrounds.push({
          tag: el.tagName,
          id: el.id,
          className: el.className,
          bgImage: styles.backgroundImage,
          bgColor: styles.backgroundColor,
          width: styles.width,
          height: styles.height
        });
      }
    });
    
    // 提取页面整体颜色
    const bodyStyles = window.getComputedStyle(document.body);

    return { 
      texts, 
      backgrounds, 
      body: { 
        bgColor: bodyStyles.backgroundColor, 
        color: bodyStyles.color,
        fontFamily: bodyStyles.fontFamily
      } 
    };
  });

  fs.writeFileSync('scraped_data.json', JSON.stringify(data, null, 2));
  console.log('Scraping finished. Data saved to scraped_data.json');
  await browser.close();
})();
