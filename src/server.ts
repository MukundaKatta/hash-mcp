#!/usr/bin/env node
/**
 * hash MCP server. One tool: `hash`.
 *
 * Hash a string with any of the algorithms Node's OpenSSL build exposes:
 * sha256, sha384, sha512, sha3-256, sha3-384, sha3-512, blake2b512,
 * blake2s256, md5 (legacy), sha1 (legacy). Output in hex, base64, or
 * base64url.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { createHash } from 'node:crypto';

const VERSION = '0.1.0';

export type Algo =
  | 'sha256' | 'sha384' | 'sha512'
  | 'sha3-256' | 'sha3-384' | 'sha3-512'
  | 'blake2b512' | 'blake2s256'
  | 'md5' | 'sha1';
export type Encoding = 'hex' | 'base64' | 'base64url';

const ALGOS: Algo[] = [
  'sha256', 'sha384', 'sha512',
  'sha3-256', 'sha3-384', 'sha3-512',
  'blake2b512', 'blake2s256',
  'md5', 'sha1',
];
const ENCODINGS: Encoding[] = ['hex', 'base64', 'base64url'];

export function hash(text: string, algo: Algo, encoding: Encoding = 'hex'): string {
  if (!ALGOS.includes(algo)) throw new Error('unsupported algo: ' + algo);
  if (!ENCODINGS.includes(encoding)) throw new Error('unsupported encoding: ' + encoding);
  return createHash(algo).update(text, 'utf8').digest(encoding);
}

const server = new Server({ name: 'hash', version: VERSION }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'hash',
    description:
      'Hash a string with sha256/sha384/sha512, sha3-{256,384,512}, blake2b512, blake2s256, md5, or sha1. Output as hex (default), base64, or base64url.',
    inputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        algo: { type: 'string', enum: ALGOS, default: 'sha256' },
        encoding: { type: 'string', enum: ENCODINGS, default: 'hex' },
      },
      required: ['text'],
    },
  },
] as const;

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  try {
    if (name !== 'hash') return errorResult('unknown tool: ' + name);
    const a = args as unknown as { text: string; algo?: Algo; encoding?: Encoding };
    return jsonResult({
      algo: a.algo ?? 'sha256',
      encoding: a.encoding ?? 'hex',
      hash: hash(a.text, a.algo ?? 'sha256', a.encoding ?? 'hex'),
    });
  } catch (err) {
    return errorResult('hash failed: ' + (err as Error).message);
  }
});

function jsonResult(value: unknown) {
  return { content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] };
}
function errorResult(message: string) {
  return { isError: true, content: [{ type: 'text', text: message }] };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(`hash MCP server v${VERSION} ready on stdio\n`);
}
