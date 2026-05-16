import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import { hash } from '../src/server.js';

test('sha256 hex of empty string', () => {
  // Known: sha256("") = e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
  assert.equal(
    hash('', 'sha256'),
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  );
});

test('sha256 hex of "hello world"', () => {
  assert.equal(
    hash('hello world', 'sha256'),
    'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
  );
});

test('md5', () => {
  assert.equal(hash('hello', 'md5'), '5d41402abc4b2a76b9719d911017c592');
});

test('sha3-256', () => {
  // Known: sha3-256("") = a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a
  assert.equal(
    hash('', 'sha3-256'),
    'a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a',
  );
});

test('base64 encoding', () => {
  const out = hash('hello world', 'sha256', 'base64');
  assert.match(out, /^[A-Za-z0-9+/=]+$/);
});

test('base64url has no padding', () => {
  const out = hash('hello', 'sha256', 'base64url');
  assert.equal(out.includes('='), false);
  assert.equal(out.includes('+'), false);
  assert.equal(out.includes('/'), false);
});

test('rejects unknown algorithm', () => {
  // @ts-expect-error intentional wrong type
  assert.throws(() => hash('x', 'not-an-algo'));
});

test('deterministic across calls', () => {
  const a = hash('lorem', 'blake2b512');
  const b = hash('lorem', 'blake2b512');
  assert.equal(a, b);
});
