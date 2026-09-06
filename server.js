// Hostinger-compatible Node entrypoint.
// The production server is compiled to CommonJS in dist/server.cjs.
// This ESM wrapper keeps the repository's "type": "module" contract intact.
import './dist/server.cjs';
