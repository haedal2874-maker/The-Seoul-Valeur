import assert from 'node:assert/strict';
import { test } from 'node:test';
import { onRequestPost } from '../functions/api/inquiry.ts';

test('contact validation, Sheets compatibility and service failures', async () => {
  const originalFetch = globalThis.fetch;
  const env = { TURNSTILE_SECRET_KEY:'test', GOOGLE_APPS_SCRIPT_WEBHOOK_URL:'https://example.test/sheet', FORM_SHARED_SECRET:'test' };
  const base = { formVersion:2, inquiryType:'clinic', country:'Australia', language:'English', visitPlan:'exploring', name:'Test', contact:'test@example.com', interest:'not-sure', question:'A planning question', consent:true, turnstileToken:'test-token', article:'pdrn-skincare-and-clinic-treatments' };
  let stored;
  let captcha = true;
  let storage = true;
  const send = (body, overrides = {}) => onRequestPost({env:{...env,...overrides}, request:new Request('https://example.test/api/inquiry',{method:'POST',body:JSON.stringify(body)})});
  globalThis.fetch = async (url, options) => {
    if (String(url).includes('siteverify')) return Response.json({success:captcha});
    stored = JSON.parse(options.body);
    return Response.json({ok:storage});
  };
  try {
    for (const body of [null, [], {...base,consent:false}, {...base,contact:'bad'}, {...base,country:''}, {...base,language:''}, {...base,interest:'invalid'}, {...base,visitPlan:'dates-set'}, {...base,inquiryType:'invalid'}, {...base,formVersion:3}]) {
      assert.equal((await send(body)).status,400);
    }
    assert.equal((await send({...base,turnstileToken:''})).status,403);
    assert.equal((await send(base,{FORM_SHARED_SECRET:''})).status,503);
    assert.equal((await send(base)).status,200);
    assert.match(stored.question,/Country of residence: Australia/);
    assert.match(stored.question,/Article: \/articles\/pdrn-skincare-and-clinic-treatments/);
    assert.match(stored.question,/Message:\nA planning question$/);
    assert.equal(stored.travelTiming,'exploring');
    assert.equal((await send({...base,visitPlan:'dates-set',travelTiming:'March 8 to 15',budget:'USD 2000'})).status,200);
    assert.match(stored.question,/Budget \(optional\): USD 2000/);
    assert.equal(stored.travelTiming,'dates-set: March 8 to 15');
    assert.equal((await send({...base,inquiryType:'general',interest:'general',travelTiming:'stale',budget:'stale',article:'invalid/?secret=x'})).status,200);
    assert.equal(stored.interest,'general');
    assert.equal(stored.travelTiming,'');
    assert.doesNotMatch(stored.question,/Article:|Budget/);
    assert.equal((await send({...base,formVersion:undefined,contact:'@legacy',interest:'clinic-booking'})).status,200);
    assert.equal(stored.question,base.question);
    captcha = false;
    assert.equal((await send(base)).status,403);
    captcha = true; storage = false;
    assert.equal((await send(base)).status,502);
    globalThis.fetch = async () => { throw Error('network'); };
    assert.equal((await send(base)).status,502);
  } finally { globalThis.fetch = originalFetch; }
});
