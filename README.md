# hash-mcp

[![npm](https://img.shields.io/npm/v/@mukundakatta/hash-mcp.svg)](https://www.npmjs.com/package/@mukundakatta/hash-mcp)
[![mcp](https://img.shields.io/badge/protocol-MCP-blue.svg)](https://modelcontextprotocol.io)

MCP server: hash text with one of ten algorithms. Uses Node's built-in
`crypto` — no external dependencies.

## Tool

### `hash`

```json
{ "text": "hello world", "algo": "sha256", "encoding": "hex" }
```

→ `{ "algo": "sha256", "encoding": "hex", "hash": "b94d27b9..." }`

Algorithms: `sha256`, `sha384`, `sha512`, `sha3-256`, `sha3-384`, `sha3-512`,
`blake2b512`, `blake2s256`, plus legacy `md5` and `sha1`.

Encodings: `hex` (default), `base64`, `base64url` (no padding).

Note: this is a sibling to `fingerprint-mcp`. `fingerprint-mcp` is the
recommended choice for the common case (sha256 + variants); `hash-mcp`
adds sha-3 and blake2 for callers who need them.

## Configure

```json
{ "mcpServers": { "hash": { "command": "npx", "args": ["-y", "@mukundakatta/hash-mcp"] } } }
```

## License

MIT.
