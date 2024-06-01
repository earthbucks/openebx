// Note that this "buffer" package is NOT the same thing as node's standard
// library. It is an API-compatible tool that does in fact "polyfill" or
// "browserify" the correct way. The reason why I'm renaming it here is
// specifically to make sure we always use this version of "Buffer" and never
// the standard node version so that it polyfills in the browser correctly.
import { Buffer } from "buffer";
import { Result, Ok, Err } from "earthbucks-opt-res/src/lib.js";
import { Option, Some, None } from "earthbucks-opt-res/src/lib.js";
import { EbxError, InvalidSizeError, InvalidHexError } from "./ebx-error.js";
import bs58 from "bs58";

const SysBuf = Buffer;
type SysBuf = Buffer;

function isValidHex(hex: string): boolean {
  return /^[0-9a-f]*$/.test(hex) && hex.length % 2 === 0;
}

function encodeHex(buffer: SysBuf): string {
  return buffer.toString("hex");
}

function decodeHex(hex: string): Result<SysBuf, EbxError> {
  if (!isValidHex(hex)) {
    return Err(new InvalidHexError(None));
  }
  const buffer = SysBuf.from(hex, "hex");
  return Ok(buffer);
}

class IsoBuf extends SysBuf {
  static fromBuf<N extends number>(
    size: N,
    buf: SysBuf,
  ): Result<IsoBuf, EbxError> {
    if (buf.length !== size) {
      return Err(new InvalidSizeError(None));
    }
    // weird roundabout prototype code to avoid calling "new" because on Buffer
    // that is actually deprecated
    const newBuf = SysBuf.alloc(size);
    newBuf.set(buf);
    Object.setPrototypeOf(newBuf, IsoBuf.prototype);
    const isoBuf = newBuf as IsoBuf;
    return Ok(isoBuf);
  }

  static alloc(size: number, fill?: number): IsoBuf {
    return IsoBuf.fromBuf(size, SysBuf.alloc(size, fill)).unwrap();
  }

  static fromStrictHex(size: number, hex: string): Result<IsoBuf, EbxError> {
    const bufRes = decodeHex(hex);
    if (bufRes.err) {
      return Err(bufRes.val);
    }
    const buf = bufRes.unwrap();
    return IsoBuf.fromBuf(size, buf);
  }

  toStrictHex(): string {
    return encodeHex(this);
  }
}

const sizeSymbol = Symbol("size");

class FixedIsoBuf<N extends number> extends IsoBuf {
  [sizeSymbol]: N;

  constructor(size: N, ...args: ConstructorParameters<typeof SysBuf>) {
    super(...args);
    if (this.length !== size) {
      throw new InvalidSizeError(None);
    }
    this[sizeSymbol] = size;
  }

  static fromBuf<N extends number>(
    size: N,
    buf: SysBuf,
  ): Result<FixedIsoBuf<N>, EbxError> {
    if (buf.length !== size) {
      return Err(new InvalidSizeError(None));
    }
    // weird roundabout prototype code to avoid calling "new" because on Buffer
    // that is actually deprecated
    const newBuf = Buffer.alloc(size);
    newBuf.set(buf);
    Object.setPrototypeOf(newBuf, FixedIsoBuf.prototype);
    const fixedIsoBufN = newBuf as FixedIsoBuf<N>;
    fixedIsoBufN[sizeSymbol] = size;
    return Ok(fixedIsoBufN);
  }

  static alloc<N extends number>(size: N, fill?: number): FixedIsoBuf<N> {
    return FixedIsoBuf.fromBuf(size, SysBuf.alloc(size, fill)).unwrap();
  }

  static fromStrictHex<N extends number>(
    size: N,
    hex: string,
  ): Result<FixedIsoBuf<N>, EbxError> {
    const bufRes = decodeHex(hex);
    if (bufRes.err) {
      return Err(bufRes.val);
    }
    const buf = bufRes.unwrap();
    return FixedIsoBuf.fromBuf(size, buf);
  }

  toStrictHex(): string {
    return encodeHex(this);
  }
}

export { SysBuf, FixedIsoBuf, IsoBuf };
