import { describe, it, expect } from "vitest";
import {
  U8,
  I8,
  U16,
  I16,
  U32,
  I32,
  U64,
  I64,
  U128,
  I128,
  U256,
  I256,
} from "../src/numbers.js";

describe("Numbers", () => {
  it("test U8", () => {
    const a = new U8(10n);
    const b = new U8(20n);
    expect(a.add(b).bn).toBe(30n);
    expect(a.mul(b).bn).toBe(200n);
  });

  it("test I8", () => {
    const a = new I8(10n);
    const b = new I8(2n);
    expect(a.add(b).bn).toBe(12n);
    expect(a.mul(b).bn).toBe(20n);
  });

  it("test U16", () => {
    const a = new U16(10n);
    const b = new U16(20n);
    expect(a.add(b).bn).toBe(30n);
    expect(a.mul(b).bn).toBe(200n);
  });

  it("test I16", () => {
    const a = new I16(10n);
    const b = new I16(20n);
    expect(a.add(b).bn).toBe(30n);
    expect(a.mul(b).bn).toBe(200n);
  });

  it("test U32", () => {
    const a = new U32(10n);
    const b = new U32(20n);
    expect(a.add(b).bn).toBe(30n);
    expect(a.mul(b).bn).toBe(200n);
  });

  it("test I32", () => {
    const a = new I32(10n);
    const b = new I32(20n);
    expect(a.add(b).bn).toBe(30n);
    expect(a.mul(b).bn).toBe(200n);
  });

  it("test U64", () => {
    const a = new U64(10n);
    const b = new U64(20n);
    expect(a.add(b).bn).toBe(30n);
    expect(a.mul(b).bn).toBe(200n);
  });

  it("test I64", () => {
    const a = new I64(10n);
    const b = new I64(20n);
    expect(a.add(b).bn).toBe(30n);
    expect(a.mul(b).bn).toBe(200n);
  });

  it("test U128", () => {
    const a = new U128(10n);
    const b = new U128(20n);
    expect(a.add(b).bn).toBe(30n);
    expect(a.mul(b).bn).toBe(200n);
  });

  it("test I128", () => {
    const a = new I128(10n);
    const b = new I128(20n);
    expect(a.add(b).bn).toBe(30n);
    expect(a.mul(b).bn).toBe(200n);
  });

  it("test U256", () => {
    const a = new U256(10n);
    const b = new U256(20n);
    expect(a.add(b).bn).toBe(30n);
    expect(a.mul(b).bn).toBe(200n);
  });

  it("test I256", () => {
    const a = new I256(10n);
    const b = new I256(20n);
    expect(a.add(b).bn).toBe(30n);
    expect(a.mul(b).bn).toBe(200n);
  });
});
