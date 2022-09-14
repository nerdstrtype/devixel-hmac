Devixel HMAC
===

Simple no-dependency HMAC Signature generator for browser

```js
const hmacSecretKey = await devixelHmac.genHMACSecretKey('YOUR_SECRET')
const hmacSignature2 = await devixelHmac.genHMACSignature('YOUR_PAYLOAD_STRING', hmacSecretKey)

// or generate using array payload
const hmacSignature = await devixelHmac.genHMACSignature(['DATA','DATA','DATA'], hmacSecretKey, {
	encode: 'hex',
	separator: ':'
})

```
