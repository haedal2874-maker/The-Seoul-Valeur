import assert from 'node:assert/strict';
import { test } from 'node:test';
import { inquiryCampaignHref } from '../lib/campaign.ts';

test('article-to-inquiry campaign labels survive without carrying personal query data', () => {
  const source = 'https://example.test/articles/guide/?utm_source=threads&utm_medium=social&utm_campaign=tsv_d01&utm_content=choice&email=private@example.com';
  const result = new URL(inquiryCampaignHref('/contact?type=clinic&article=guide', source), source);
  assert.equal(result.searchParams.get('utm_campaign'), 'tsv_d01');
  assert.equal(result.searchParams.get('utm_content'), 'choice');
  assert.equal(result.searchParams.get('article'), 'guide');
  assert.equal(result.searchParams.has('email'), false);
  assert.equal(inquiryCampaignHref('https://other.test/contact', source), 'https://other.test/contact');
  assert.equal(inquiryCampaignHref('/category/travel', source), '/category/travel');
  assert.equal(new URL(inquiryCampaignHref('/contact/?utm_source=existing', source), source).searchParams.get('utm_source'), 'existing');
  assert.equal(inquiryCampaignHref('/contact', 'https://example.test/?utm_content=private%40example.com'), '/contact');
});
