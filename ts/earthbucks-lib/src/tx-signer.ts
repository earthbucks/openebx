import Tx from "./tx";
import PkhKeyMap from "./pkh-key-map";
import TxOutBnMap from "./tx-out-bn-map";
import TxSignature from "./tx-signature";
import { Buffer } from "buffer";
import PubKey from "./pub-key";
import { Result, Ok, Err } from "ts-option-result/src/result";
import Script from "./script";

export default class TxSigner {
  public tx: Tx;
  public pkhKeyMap: PkhKeyMap;
  public txOutMap: TxOutBnMap;
  public workingBlockNum: bigint;

  constructor(
    tx: Tx,
    txOutMap: TxOutBnMap,
    pkhKeyMap: PkhKeyMap,
    workingBlockNum: bigint,
  ) {
    this.tx = tx;
    this.txOutMap = txOutMap;
    this.pkhKeyMap = pkhKeyMap;
    this.workingBlockNum = workingBlockNum;
  }

  sign(nIn: number): Result<Tx, string> {
    const txInput = this.tx.inputs[nIn];
    const txOutHash = txInput.inputTxId;
    const outputIndex = txInput.inputTxNOut;
    const txOutBn = this.txOutMap.get(txOutHash, outputIndex);
    if (!txOutBn) {
      return Err("tx_out not found");
    }
    const txOut = txOutBn.txOut;
    const prevBlockNum = txOutBn.blockNum;

    if (txOut.script.isPkhOutput()) {
      const pkh_buf = txOut.script.chunks[2].buf as Buffer;
      const inputScript = txInput.script;
      if (!inputScript.isPkhInput()) {
        return Err("expected pkh input placeholder");
      }
      const keyPair = this.pkhKeyMap.get(pkh_buf);
      if (!keyPair) {
        return Err("key not found");
      }
      const pubKeyBuf = keyPair.pubKey.toIsoBuf();

      const outputScriptBuf = txOut.script.toIsoBuf();
      const outputAmount = txOut.value;
      const sig = this.tx.signNoCache(
        nIn,
        keyPair.privKey.toIsoBuf(),
        outputScriptBuf,
        outputAmount,
        TxSignature.SIGHASH_ALL,
      );
      const sigBuf = sig.toIsoBuf();

      inputScript.chunks[0].buf = Buffer.from(sigBuf);
      inputScript.chunks[1].buf = Buffer.from(pubKeyBuf);
    } else if (txOut.script.isPkhx90dOutput()) {
      const pkh_buf = txOut.script.chunks[3].buf as Buffer;
      const expired =
        this.workingBlockNum >= prevBlockNum + BigInt(Script.PKHX_1H_LOCK_REL);
      const inputScript = txInput.script;
      if (expired) {
        if (inputScript.isExpiredPkhxInput()) {
          // no need to sign expired pkhx
          return Ok(this.tx);
        } else {
          return Err("expected expired pkhx input");
        }
      }
      if (!inputScript.isUnexpiredPkhxInput()) {
        return Err("expected unexpired pkhx input placeholder");
      }
      const keyPair = this.pkhKeyMap.get(pkh_buf);
      if (!keyPair) {
        return Err("key not found");
      }
      const pubKeyBuf = keyPair.pubKey.toIsoBuf();

      const outputScriptBuf = txOut.script.toIsoBuf();
      const outputAmount = txOut.value;
      const sig = this.tx.signNoCache(
        nIn,
        keyPair.privKey.toIsoBuf(),
        outputScriptBuf,
        outputAmount,
        TxSignature.SIGHASH_ALL,
      );
      const sigBuf = sig.toIsoBuf();

      inputScript.chunks[0].buf = Buffer.from(sigBuf);
      inputScript.chunks[1].buf = Buffer.from(pubKeyBuf);
    } else if (txOut.script.isPkhx1hOutput()) {
      const pkh_buf = txOut.script.chunks[3].buf as Buffer;
      const expired =
        this.workingBlockNum >= prevBlockNum + BigInt(Script.PKHX_1H_LOCK_REL);
      const inputScript = txInput.script;
      if (expired) {
        if (inputScript.isExpiredPkhxInput()) {
          // no need to sign expired pkhx
          return Ok(this.tx);
        } else {
          return Err("expected expired pkhx input");
        }
      }
      if (!inputScript.isUnexpiredPkhxInput()) {
        return Err("expected unexpired pkhx input placeholder");
      }
      const keyPair = this.pkhKeyMap.get(pkh_buf);
      if (!keyPair) {
        return Err("key not found");
      }
      const pubKeyBuf = keyPair.pubKey.toIsoBuf();

      const outputScriptBuf = txOut.script.toIsoBuf();
      const outputAmount = txOut.value;
      const sig = this.tx.signNoCache(
        nIn,
        keyPair.privKey.toIsoBuf(),
        outputScriptBuf,
        outputAmount,
        TxSignature.SIGHASH_ALL,
      );
      const sigBuf = sig.toIsoBuf();

      inputScript.chunks[0].buf = Buffer.from(sigBuf);
      inputScript.chunks[1].buf = Buffer.from(pubKeyBuf);
    } else {
      return Err("unsupported script type");
    }

    return Ok(this.tx);
  }

  signAll(): Result<Tx, string> {
    for (let i = 0; i < this.tx.inputs.length; i++) {
      const res = this.sign(i);
      if (res.err) {
        return Err("sign_all: " + res.err);
      }
    }
    return Ok(this.tx);
  }
}
