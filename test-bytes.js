const assert = require('assert');
const { bytes } = require('./index');

// Sub-byte magnitudes stay in the smallest advertised unit for both scales.
assert.strictEqual(bytes(0.5), '0.5 B');
assert.strictEqual(bytes(0.1), '0.1 B');
assert.strictEqual(bytes(-0.5), '-0.5 B');
assert.strictEqual(bytes(-0.1), '-0.1 B');
assert.strictEqual(bytes(0.5, { decimals: 2 }), '0.50 B');
assert.strictEqual(bytes(-0.5, { decimals: 0 }), '-1 B');

assert.strictEqual(bytes(0.5, { binary: true }), '0.5 B');
assert.strictEqual(bytes(0.1, { binary: true }), '0.1 B');
assert.strictEqual(bytes(-0.5, { binary: true }), '-0.5 B');
assert.strictEqual(bytes(0.5, { binary: true, decimals: 2 }), '0.50 B');
assert.strictEqual(bytes(-0.5, { binary: true, decimals: 0 }), '-1 B');

// Preserve zero's special case and existing unit/rounding behavior.
assert.strictEqual(bytes(0), '0 B');
assert.strictEqual(bytes(0, { decimals: 3, binary: true }), '0 B');
assert.strictEqual(bytes(1), '1.0 B');
assert.strictEqual(bytes(1, { binary: true }), '1.0 B');
assert.strictEqual(bytes(1000), '1.0 KB');
assert.strictEqual(bytes(1024), '1.0 KB');
assert.strictEqual(bytes(1024, { binary: true }), '1.0 KiB');
assert.strictEqual(bytes(1000000), '1.0 MB');
assert.strictEqual(bytes(1048576, { binary: true }), '1.0 MiB');
assert.strictEqual(bytes(1000000000), '1.0 GB');
assert.strictEqual(bytes(1073741824, { binary: true }), '1.0 GiB');

console.log('bytes regression assertions passed');
