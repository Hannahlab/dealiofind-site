import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { httpAction } from "./_generated/server";

const http = httpRouter();

auth.addHttpRoutes(http);

/**
 * Pure JS MD5 (no Node crypto dependency for Edge runtime).
 */
function md5(str: string): string {
  function L(k: number, d: number) { return (k << d) | (k >>> (32 - d)); }
  function K(G: number, k: number) {
    let d, e, f, x, g;
    f = (G & 2147483648); x = (k & 2147483648);
    d = (G & 1073741824); e = (k & 1073741824);
    g = (G & 1073741823) + (k & 1073741823);
    if (d & e) return (g ^ 2147483648 ^ f ^ x);
    if (d | e) return (g & 1073741823) ? (g ^ 3221225472 ^ f ^ x) : (g ^ 1073741824 ^ f ^ x);
    return (g ^ f ^ x);
  }
  function aa(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = K(a, K(K(b & c | ~b & d, x), ac));
    return K(L(a, s), b);
  }
  function bb(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = K(a, K(K(b & d | c & ~d, x), ac));
    return K(L(a, s), b);
  }
  function cc(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = K(a, K(K(b ^ c ^ d, x), ac));
    return K(L(a, s), b);
  }
  function dd(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = K(a, K(K(c ^ (b | ~d), x), ac));
    return K(L(a, s), b);
  }
  function ConvertToWordArray(str: string) {
    let lWordCount;
    const lMessageLength = str.length;
    const lNumberOfWords_temp1 = lMessageLength + 8;
    const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    const lWordArray = Array(lNumberOfWords - 1);
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] || 0) | (str.charCodeAt(lByteCount) << lBytePosition);
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = (lWordArray[lWordCount] || 0) | (128 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }
  function WordToHex(lValue: number) {
    let WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValue_temp = "0" + lByte.toString(16);
      WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
    }
    return WordToHexValue;
  }
  let x = ConvertToWordArray(str);
  let a = 0x67452301, b = 0xEFCDAB89, c = 0x98BADCFE, d = 0x10325476;
  let S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  let S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  let S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  let S41 = 6, S42 = 10, S43 = 15, S44 = 21;
  for (let k = 0; k < x.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d;
    a = aa(a, b, c, d, x[k+0], S11, 0xD76AA478); d = aa(d, a, b, c, x[k+1], S12, 0xE8C7B756);
    c = aa(c, d, a, b, x[k+2], S13, 0x242070DB); b = aa(b, c, d, a, x[k+3], S14, 0xC1BDCEEE);
    a = aa(a, b, c, d, x[k+4], S11, 0xF57C0FAF); d = aa(d, a, b, c, x[k+5], S12, 0x4787C62A);
    c = aa(c, d, a, b, x[k+6], S13, 0xA8304613); b = aa(b, c, d, a, x[k+7], S14, 0xFD469501);
    a = aa(a, b, c, d, x[k+8], S11, 0x698098D8); d = aa(d, a, b, c, x[k+9], S12, 0x8B44F7AF);
    c = aa(c, d, a, b, x[k+10], S13, 0xFFFF5BB1); b = aa(b, c, d, a, x[k+11], S14, 0x895CD7BE);
    a = aa(a, b, c, d, x[k+12], S11, 0x6B901122); d = aa(d, a, b, c, x[k+13], S12, 0xFD987193);
    c = aa(c, d, a, b, x[k+14], S13, 0xA679438E); b = aa(b, c, d, a, x[k+15], S14, 0x49B40821);
    a = bb(a, b, c, d, x[k+1], S21, 0xF61E2562); d = bb(d, a, b, c, x[k+6], S22, 0xC040B340);
    c = bb(c, d, a, b, x[k+11], S23, 0x265E5A51); b = bb(b, c, d, a, x[k+0], S24, 0xE9B6C7AA);
    a = bb(a, b, c, d, x[k+5], S21, 0xD62F105D); d = bb(d, a, b, c, x[k+10], S22, 0x2441453);
    c = bb(c, d, a, b, x[k+15], S23, 0xD8A1E681); b = bb(b, c, d, a, x[k+4], S24, 0xE7D3FBC8);
    a = bb(a, b, c, d, x[k+9], S21, 0x21E1CDE6); d = bb(d, a, b, c, x[k+14], S22, 0xC33707D6);
    c = bb(c, d, a, b, x[k+3], S23, 0xF4D50D87); b = bb(b, c, d, a, x[k+8], S24, 0x455A14ED);
    a = bb(a, b, c, d, x[k+13], S21, 0xA9E3E905); d = bb(d, a, b, c, x[k+2], S22, 0xFCEFA3F8);
    c = bb(c, d, a, b, x[k+7], S23, 0x676F02D9); b = bb(b, c, d, a, x[k+12], S24, 0x8D2A4C8A);
    a = cc(a, b, c, d, x[k+5], S31, 0xFFFA3942); d = cc(d, a, b, c, x[k+8], S32, 0x8771F681);
    c = cc(c, d, a, b, x[k+11], S33, 0x6D9D6122); b = cc(b, c, d, a, x[k+14], S34, 0xFDE5380C);
    a = cc(a, b, c, d, x[k+1], S31, 0xA4BEEA44); d = cc(d, a, b, c, x[k+4], S32, 0x4BDECFA9);
    c = cc(c, d, a, b, x[k+7], S33, 0xF6BB4B60); b = cc(b, c, d, a, x[k+10], S34, 0xBEBFBC70);
    a = cc(a, b, c, d, x[k+13], S31, 0x289B7EC6); d = cc(d, a, b, c, x[k+0], S32, 0xEAA127FA);
    c = cc(c, d, a, b, x[k+3], S33, 0xD4EF3085); b = cc(b, c, d, a, x[k+6], S34, 0x4881D05);
    a = cc(a, b, c, d, x[k+9], S31, 0xD9D4D039); d = cc(d, a, b, c, x[k+12], S32, 0xE6DB99E5);
    c = cc(c, d, a, b, x[k+15], S33, 0x1FA27CF8); b = cc(b, c, d, a, x[k+2], S34, 0xC4AC5665);
    a = dd(a, b, c, d, x[k+0], S41, 0xF4292244); d = dd(d, a, b, c, x[k+7], S42, 0x432AFF97);
    c = dd(c, d, a, b, x[k+14], S43, 0xAB9423A7); b = dd(b, c, d, a, x[k+5], S44, 0xFC93A039);
    a = dd(a, b, c, d, x[k+12], S41, 0x655B59C3); d = dd(d, a, b, c, x[k+3], S42, 0x8F0CCC92);
    c = dd(c, d, a, b, x[k+10], S43, 0xFFEFF47D); b = dd(b, c, d, a, x[k+1], S44, 0x85845DD1);
    a = dd(a, b, c, d, x[k+8], S41, 0x6FA87E4F); d = dd(d, a, b, c, x[k+15], S42, 0xFE2CE6E0);
    c = dd(c, d, a, b, x[k+6], S43, 0xA3014314); b = dd(b, c, d, a, x[k+13], S44, 0x4E0811A1);
    a = dd(a, b, c, d, x[k+4], S41, 0xF7537E82); d = dd(d, a, b, c, x[k+11], S42, 0xBD3AF235);
    c = dd(c, d, a, b, x[k+2], S43, 0x2AD7D2BB); b = dd(b, c, d, a, x[k+9], S44, 0xEB86D391);
    a = K(a, AA); b = K(b, BB); c = K(c, CC); d = K(d, DD);
  }
  return (WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d)).toLowerCase();
}

/**
 * PHP-compatible URL encoding for PayFast signature verification.
 */
function phpUrlEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A")
    .replace(/~/g, "%7E")
    .replace(/%20/g, "+");
}

function generateSignature(data: Record<string, string>, passphrase?: string): string {
  let pfOutput = "";
  for (const key of Object.keys(data)) {
    if (data[key] !== "") {
      pfOutput += `${key}=${phpUrlEncode(data[key].trim())}&`;
    }
  }
  pfOutput = pfOutput.slice(0, -1);
  if (passphrase) {
    pfOutput += `&passphrase=${phpUrlEncode(passphrase.trim())}`;
  }
  return md5(pfOutput);
}

/**
 * PayFast ITN (Instant Transaction Notification) endpoint.
 * PayFast POSTs here after a successful payment.
 */
http.route({
  path: "/payment/notify",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.text();
      const params = new URLSearchParams(body);
      const postData: Record<string, string> = {};
      params.forEach((value, key) => {
        postData[key] = value;
      });

      const merchantId = process.env.PAYFAST_MERCHANT_ID || "";
      const passphrase = process.env.PAYFAST_PASSPHRASE || "";
      const sandbox = process.env.PAYFAST_SANDBOX === "true";

      // 1. Verify signature
      const receivedSignature = postData.signature;
      const dataWithoutSignature = { ...postData };
      delete dataWithoutSignature.signature;
      const expectedSignature = generateSignature(dataWithoutSignature, passphrase || undefined);

      if (receivedSignature !== expectedSignature) {
        console.error("PayFast ITN: Signature mismatch");
        return new Response("Invalid signature", { status: 400 });
      }

      // 2. Verify merchant ID
      if (postData.merchant_id !== merchantId) {
        console.error("PayFast ITN: Merchant ID mismatch");
        return new Response("Invalid merchant", { status: 400 });
      }

      // 3. Verify with PayFast server
      const verifyUrl = sandbox
        ? "https://sandbox.payfast.co.za/eng/query/validate"
        : "https://www.payfast.co.za/eng/query/validate";

      const verifyResponse = await fetch(verifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      const verifyResult = await verifyResponse.text();

      if (verifyResult.trim() !== "VALID") {
        console.error("PayFast ITN: Server verification failed");
        return new Response("Verification failed", { status: 400 });
      }

      // 4. Payment is valid — update order status
      const paymentStatus = postData.payment_status;
      const orderId = postData.custom_str1; // We'll pass order ID here

      if (orderId && paymentStatus === "COMPLETE") {
        try {
          // Import the mutation reference
          const { api } = await import("./_generated/api");
          await ctx.runMutation(api.orders.updateStatus, {
            orderId: orderId as any,
            status: "confirmed",
          });
        } catch (err) {
          console.error("Failed to update order:", err);
        }
      }

      return new Response("OK", { status: 200 });
    } catch (err) {
      console.error("PayFast ITN error:", err);
      return new Response("Error", { status: 500 });
    }
  }),
});

/**
 * Payment return URL — customer returns here after successful payment.
 */
http.route({
  path: "/payment/return",
  method: "GET",
  handler: httpAction(async (_ctx, request) => {
    const url = new URL(request.url);
    const orderId = url.searchParams.get("custom_str1");
    // Redirect to dashboard or order confirmation
    const redirectUrl = orderId ? `/dashboard` : "/";
    return new Response(null, {
      status: 302,
      headers: { Location: redirectUrl },
    });
  }),
});

/**
 * Payment cancel URL — customer returns here if they cancel.
 */
http.route({
  path: "/payment/cancel",
  method: "GET",
  handler: httpAction(async (_ctx, _request) => {
    return new Response(null, {
      status: 302,
      headers: { Location: "/checkout" },
    });
  }),
});

export default http;
