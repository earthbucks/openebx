import secp256k1 from "secp256k1";
import { Buffer } from "buffer";
import StrictHex, { isValid } from "./strict-hex";
import bs58 from "bs58";
import PrivKey from "./priv-key";
import { blake3Hash } from "./blake3";

export default class PubKey {
  buf: Buffer;

  constructor(buf: Buffer) {
    this.buf = buf;
  }

  static fromPrivKey(privKey: PrivKey): PubKey {
    return new PubKey(privKey.toPubKeyBuffer());
  }

  static fromIsoBuf(buf: Buffer): PubKey {
    if (buf.length !== 33) {
      throw new Error("Invalid public key length");
    }
    return new PubKey(buf);
  }

  toIsoBuf(): Buffer {
    return this.buf;
  }

  toIsoHex(): string {
    return this.buf.toString("hex");
  }

  static fromIsoHex(hex: string): PubKey {
    return PubKey.fromIsoBuf(StrictHex.decode(hex));
  }

  toIsoStr(): string {
    let checkHash = blake3Hash(this.buf);
    let checkSum = checkHash.subarray(0, 4);
    let checkHex = checkSum.toString("hex");
    return "ebxpub" + checkHex + bs58.encode(this.buf);
  }

  static fromIsoStr(str: string): PubKey {
    if (!str.startsWith("ebxpub")) {
      throw new Error("Invalid public key format");
    }
    let checkHex = str.slice(6, 14);
    let checkBuf = StrictHex.decode(checkHex);
    let decoded: Buffer;
    try {
      decoded = Buffer.from(bs58.decode(str.slice(14)));
    } catch (e) {
      throw new Error("Invalid base58 encoding");
    }
    let checkHash = blake3Hash(decoded);
    let checkSum = checkHash.subarray(0, 4);
    if (!checkBuf.equals(checkSum)) {
      throw new Error("Invalid checksum");
    }
    return PubKey.fromIsoBuf(decoded);
  }

  static isValidStringFmt(str: string): boolean {
    let pubKey: PubKey;
    try {
      pubKey = PubKey.fromIsoStr(str);
    } catch (e) {
      return false;
    }
    return true;
  }
}
