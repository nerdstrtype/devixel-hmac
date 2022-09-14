const encoder = new TextEncoder();

const isString = (data: any): boolean =>
	data !== undefined && data !== null && typeof data === "string";

const isObject = (data: any): boolean =>
	typeof data === "object" &&
	!Array.isArray(data) &&
	data !== null &&
	data !== undefined;

const isArray = (data: any): boolean => Array.isArray(data);
const ArrayBufferToHex = (data: ArrayBuffer): string => {
	return [...new Uint8Array(data)]
		.map((x) => x.toString(16).padStart(2, "0"))
		.join("");
};
const ArrayBufferToBase64 = (data: ArrayBuffer): string => {
	return btoa(String.fromCharCode.apply(null, [...new Uint8Array(data)]));
};

interface genHMACSecretKeyOptions {
	hash: HashAlgorithmIdentifier;
}
interface genHMACSignatureOptions {
	encode: "hex" | "base64";
	separator: string;
}

const genHMACSecretKey = (
	HMACSecret: string,
	options: genHMACSecretKeyOptions | undefined
): Promise<CryptoKey> =>
	new Promise(async (resolve, reject) => {
		if (!isString(HMACSecret)) return reject("HMAC secret must be a string");

		const HMACOptions: HmacImportParams = {
			name: "HMAC",
			hash: "SHA-256",
		};
		if (isObject(options)) {
			if (options.hash) HMACOptions.hash = options.hash;
		}

		try {
			resolve(
				await crypto.subtle.importKey(
					"raw",
					encoder.encode(HMACSecret),
					HMACOptions,
					false,
					["sign"]
				)
			);
		} catch (exception) {
			reject("Error generating HMAC key");
		}
	});

const genHMACSignature = (
	payload: string | Array<string>,
	secretKey: CryptoKey,
	options: genHMACSignatureOptions | undefined
): Promise<string> =>
	new Promise(async (resolve, reject) => {
		if (secretKey === undefined)
			return reject(
				"Invalid secret key please generate using genHMACSecretKey"
			);
		if (!isString(payload) && !isArray(payload))
			return reject("HMAC payload must be a string or an array of string");

		let HMACPayload: Uint8Array | undefined;
		const signatureOptions: genHMACSignatureOptions = {
			encode: "hex",
			separator: ":",
		};
		if (isObject(options)) {
			if (options.encode) signatureOptions.encode = options.encode;
			if (options.separator) signatureOptions.separator = options.separator;
		}

		if (isArray(payload)) {
			HMACPayload = encoder.encode(
				(payload as Array<string>).join(signatureOptions.separator)
			);
		}
		if (isString(payload)) {
			HMACPayload = encoder.encode(payload as string);
		}

		try {
			const HMACSignature: ArrayBuffer = await crypto.subtle.sign(
				{
					name: "HMAC",
				},
				secretKey,
				HMACPayload
			);
			if (signatureOptions.encode === "hex")
				resolve(ArrayBufferToHex(HMACSignature));
			else resolve(ArrayBufferToBase64(HMACSignature));
		} catch (exception) {
			reject("Error generating HMAC signature");
		}
	});

export default {
	genHMACSecretKey,
	genHMACSignature,
};
