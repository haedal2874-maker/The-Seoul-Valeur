const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '../out');
const screenshots = path.join(root, 'contact-checks');
fs.mkdirSync(screenshots, {recursive:true});
const server = http.createServer((req,res) => {
  let file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (file !== root && !file.startsWith(root + path.sep)) {res.writeHead(403).end();return;}
  if(fs.existsSync(file) && fs.statSync(file).isDirectory()) file=path.join(file,'index.html');
  if(!fs.existsSync(file) && fs.existsSync(file+'.html')) file+='.html';
  if(!fs.existsSync(file)){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.webp':'image/webp'})[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const base=process.env.LIVE_URL || `http://127.0.0.1:${server.address().port}`;
  try {
    for(const width of [1280,390,320]) {
      const page=await browser.newPage({viewport:{width,height:950}});
      const errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      await page.route('https://challenges.cloudflare.com/**',route=>route.fulfill({contentType:'application/javascript',body:`window.turnstile={render(host,options){window.checkOptions=options;options.callback('test-token');return 'test-widget';},reset(){window.securityResets=(window.securityResets||0)+1;window.checkOptions.callback('retry-token');}};`}));
      let submissions=[];
      let fail=true;
      // Never send synthetic inquiries to the production API or spreadsheet.
      await page.route('**/api/inquiry', async route=>{
        submissions.push(route.request().postDataJSON());
        await route.fulfill({status:fail?502:200,json:fail?{ok:false,message:'Test service failure. Please retry.'}:{ok:true,submissionId:'test'}});
      });
      await page.goto(base+'/contact?article=pdrn-skincare-and-clinic-treatments',{waitUntil:'networkidle'});
      await page.waitForFunction(()=>!!window.checkOptions);
      const reject=page.getByRole('button',{name:'Reject analytics'});
      if(await reject.count()) await reject.click();
      assert.equal(await page.getByRole('heading',{name:'Plan Your Korea Clinic Visit',exact:true}).count(),1);
      assert.equal(await page.locator('[name=travelTiming]').count(),0);
      await page.locator('[name=interest]').selectOption('not-sure');
      await page.locator('[name=visitPlan]').selectOption('dates-set');
      await page.locator('[name=travelTiming]').fill('March 8 to 15');
      await page.locator('[name=question]').fill('Test planning question');
      await page.locator('[name=name]').fill('Test User');
      await page.locator('[name=contact]').fill('invalid');
      await page.locator('[name=country]').fill('Australia');
      await page.locator('[name=language]').fill('English');
      await page.locator('[name=consent]').check();
      await page.getByRole('button',{name:'Submit inquiry'}).click();
      assert.equal(submissions.length,0);
      await page.locator('[name=contact]').fill('test@example.com');
      await page.locator('[name=consent]').uncheck();
      await page.getByRole('button',{name:'Submit inquiry'}).click();
      assert.equal(submissions.length,0);
      await page.locator('[name=consent]').check();
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.screenshot({path:path.join(screenshots,`clinic-${width}.png`),fullPage:true});
      await page.evaluate(()=>scrollTo(0,0));
      await page.screenshot({path:path.join(screenshots,`top-${width}.png`)});
      await page.getByRole('button',{name:'Submit inquiry'}).click();
      await page.locator('.formMessage-error').waitFor();
      await page.waitForFunction(()=>window.securityResets===1);
      assert.equal(await page.locator('[name=question]').inputValue(),'Test planning question');
      assert.equal(await page.evaluate(()=>window.securityResets),1);
      fail=false;
      await page.getByRole('button',{name:'Submit inquiry'}).click();
      await page.getByRole('heading',{name:'Your inquiry has been received.'}).waitFor();
      assert.equal(submissions.at(-1).inquiryType,'clinic');
      assert.equal(submissions.at(-1).article,'pdrn-skincare-and-clinic-treatments');
      assert.equal(await page.locator('form').count(),0);
      await page.goto(base+'/contact?type=general',{waitUntil:'networkidle'});
      await page.waitForFunction(()=>!!window.checkOptions);
      assert.equal(await page.getByRole('radio',{name:'General inquiry',exact:true}).isChecked(),true);
      assert.equal(await page.locator('[name=interest]').count(),0);
      await page.getByRole('radio',{name:'Clinic visit',exact:true}).check();
      await page.locator('[name=visitPlan]').selectOption('approximate');
      await page.locator('[name=travelTiming]').fill('Should not be sent');
      await page.getByRole('radio',{name:'General inquiry',exact:true}).check();
      for(const [name,value] of Object.entries({question:'Article question',name:'Test User',contact:'test@example.com',country:'UK',language:'English'})) await page.locator(`[name=${name}]`).fill(value);
      await page.locator('[name=consent]').check();
      await page.screenshot({path:path.join(screenshots,`general-${width}.png`),fullPage:true});
      await page.getByRole('button',{name:'Submit inquiry'}).click();
      await page.getByRole('heading',{name:'Your inquiry has been received.'}).waitFor();
      assert.equal(submissions.at(-1).interest,'general');
      assert.equal(submissions.at(-1).travelTiming,'');
      assert.equal(submissions.at(-1).visitPlan,'');
      assert.deepEqual(errors,[]);
      console.log(`${width}px: layout, validation, branch switching, failure/retry and success passed (mocked submission).`);
      await page.close();
    }
  } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
