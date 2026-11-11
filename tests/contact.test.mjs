import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = ts.transpileModule(readFileSync('src/app/api/contact/route.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { POST } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const valid = { name: 'Test Person', email: 'test@example.com', subject: 'Test inquiry', message: 'This is a local test message, never transmitted.', website: '' };
const request = (body = valid, origin = 'http://localhost:3000') => new Request('http://localhost:3000/api/contact', { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify(body) });
test('contact handler validates input, limits spam and reports provider failures honestly', async () => {
  const savedEnv = { ...process.env }; const originalFetch = globalThis.fetch;
  try {
    delete process.env.RESEND_API_KEY;
    assert.equal((await POST(request())).status, 503);
    Object.assign(process.env, { RESEND_API_KEY: 'test', CONTACT_FROM: 'test@example.com', CONTACT_TO: 'test@example.com', CONTACT_ORIGIN: 'http://localhost:3000', UPSTASH_REDIS_REST_URL: 'https://redis.example.com', UPSTASH_REDIS_REST_TOKEN: 'test' });
    let calls = 0;
    globalThis.fetch = async () => { calls++; throw Error('Unexpected request'); };
    assert.equal((await POST(request(valid, 'https://other.example.com'))).status, 403);
    assert.equal((await POST(request({ ...valid, email: 'invalid' }))).status, 400);
    assert.equal((await POST(request({ ...valid, website: 'spam' }))).status, 400);
    assert.equal((await POST(request({ ...valid, message: 'x'.repeat(17000) }))).status, 413);
    assert.equal(calls, 0);
    globalThis.fetch = async () => Response.json({ result: 0 });
    assert.equal((await POST(request())).status, 429);
    globalThis.fetch = async () => Response.json({ error: 'storage unavailable' });
    assert.equal((await POST(request())).status, 503);
    globalThis.fetch = async url => String(url).includes('redis') ? Response.json({ result: 1 }) : Response.json({ error: 'rejected' }, { status: 502 });
    assert.equal((await POST(request())).status, 502);
    globalThis.fetch = async url => String(url).includes('redis') ? Response.json({ result: 1 }) : Response.json({ id: 'mock-accepted' });
    const success = await POST(request()); assert.equal(success.status, 200); assert.deepEqual(await success.json(), { accepted: true });
  } finally { globalThis.fetch = originalFetch; for (const key of Object.keys(process.env)) if (!(key in savedEnv)) delete process.env[key]; Object.assign(process.env, savedEnv); }
});
