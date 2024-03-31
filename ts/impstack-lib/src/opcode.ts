export type OpcodeName =
  | '0'
  | 'PUSHDATA1'
  | 'PUSHDATA2'
  | 'PUSHDATA4'
  | '1NEGATE'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | 'IF'
  | 'NOTIF'
  | 'VERIF'
  | 'VERNOTIF'
  | 'ELSE'
  | 'ENDIF'
  | 'VERIFY'
  | 'RETURN'
  | 'TOALTSTACK'
  | 'FROMALTSTACK'
  | '2DROP'
  | '2DUP'
  | '3DUP'
  | '2OVER'
  | '2ROT'
  | '2SWAP'
  | 'IFDUP'
  | 'DEPTH'
  | 'DROP'
  | 'DUP'
  | 'NIP'
  | 'OVER'
  | 'PICK'
  | 'ROLL'
  | 'ROT'
  | 'SWAP'
  | 'TUCK'
  | 'CAT'
  | 'SUBSTR'
  | 'LEFT'
  | 'RIGHT'
  | 'SIZE'
  | 'INVERT'
  | 'AND'
  | 'OR'
  | 'XOR'
  | 'EQUAL'
  | 'EQUALVERIFY'
  | '1ADD'
  | '1SUB'
  | '2MUL'
  | '2DIV'
  | 'NEGATE'
  | 'ABS'
  | 'NOT'
  | '0NOTEQUAL'
  | 'ADD'
  | 'SUB'
  | 'MUL'
  | 'DIV'
  | 'MOD'
  | 'LSHIFT'
  | 'RSHIFT'
  | 'BOOLAND'
  | 'BOOLOR'
  | 'NUMEQUAL'
  | 'NUMEQUALVERIFY'
  | 'NUMNOTEQUAL'
  | 'LESSTHAN'
  | 'GREATERTHAN'
  | 'LESSTHANOREQUAL'
  | 'GREATERTHANOREQUAL'
  | 'MIN'
  | 'MAX'
  | 'WITHIN'
  | 'RIPEMD160'
  | 'SHA1'
  | 'SHA256'
  | 'HASH160'
  | 'HASH256'
  | 'CODESEPARATOR'
  | 'CHECKSIG'
  | 'CHECKSIGVERIFY'
  | 'CHECKMULTISIG'
  | 'CHECKMULTISIGVERIFY'
  | 'BLAKE3'
  | 'DOUBLEBLAKE3'

export const NAME_TO_OPCODE: { [key in OpcodeName]: number } = {
  '0': 0x00,
  PUSHDATA1: 0x4c,
  PUSHDATA2: 0x4d,
  PUSHDATA4: 0x4e,
  '1NEGATE': 0x4f,
  '1': 0x51,
  '2': 0x52,
  '3': 0x53,
  '4': 0x54,
  '5': 0x55,
  '6': 0x56,
  '7': 0x57,
  '8': 0x58,
  '9': 0x59,
  '10': 0x5a,
  '11': 0x5b,
  '12': 0x5c,
  '13': 0x5d,
  '14': 0x5e,
  '15': 0x5f,
  '16': 0x60,
  IF: 0x63,
  NOTIF: 0x64,
  VERIF: 0x65,
  VERNOTIF: 0x66,
  ELSE: 0x67,
  ENDIF: 0x68,
  VERIFY: 0x69,
  RETURN: 0x6a,
  TOALTSTACK: 0x6b,
  FROMALTSTACK: 0x6c,
  '2DROP': 0x6d,
  '2DUP': 0x6e,
  '3DUP': 0x6f,
  '2OVER': 0x70,
  '2ROT': 0x71,
  '2SWAP': 0x72,
  IFDUP: 0x73,
  DEPTH: 0x74,
  DROP: 0x75,
  DUP: 0x76,
  NIP: 0x77,
  OVER: 0x78,
  PICK: 0x79,
  ROLL: 0x7a,
  ROT: 0x7b,
  SWAP: 0x7c,
  TUCK: 0x7d,
  CAT: 0x7e,
  SUBSTR: 0x7f,
  LEFT: 0x80,
  RIGHT: 0x81,
  SIZE: 0x82,
  INVERT: 0x83,
  AND: 0x84,
  OR: 0x85,
  XOR: 0x86,
  EQUAL: 0x87,
  EQUALVERIFY: 0x88,
  '1ADD': 0x8b,
  '1SUB': 0x8c,
  '2MUL': 0x8d,
  '2DIV': 0x8e,
  NEGATE: 0x8f,
  ABS: 0x90,
  NOT: 0x91,
  '0NOTEQUAL': 0x92,
  ADD: 0x93,
  SUB: 0x94,
  MUL: 0x95,
  DIV: 0x96,
  MOD: 0x97,
  LSHIFT: 0x98,
  RSHIFT: 0x99,
  BOOLAND: 0x9a,
  BOOLOR: 0x9b,
  NUMEQUAL: 0x9c,
  NUMEQUALVERIFY: 0x9d,
  NUMNOTEQUAL: 0x9e,
  LESSTHAN: 0x9f,
  GREATERTHAN: 0xa0,
  LESSTHANOREQUAL: 0xa1,
  GREATERTHANOREQUAL: 0xa2,
  MIN: 0xa3,
  MAX: 0xa4,
  WITHIN: 0xa5,
  RIPEMD160: 0xa6,
  SHA1: 0xa7,
  SHA256: 0xa8,
  HASH160: 0xa9,
  HASH256: 0xaa,
  CODESEPARATOR: 0xab,
  CHECKSIG: 0xac,
  CHECKSIGVERIFY: 0xad,
  CHECKMULTISIG: 0xae,
  CHECKMULTISIGVERIFY: 0xaf,
  BLAKE3: 0xb0,
  DOUBLEBLAKE3: 0xb1,
}

export const OPCODE_TO_NAME: { [key: number]: OpcodeName } = {
  0x00: '0',
  0x4c: 'PUSHDATA1',
  0x4d: 'PUSHDATA2',
  0x4e: 'PUSHDATA4',
  0x4f: '1NEGATE',
  0x51: '1',
  0x52: '2',
  0x53: '3',
  0x54: '4',
  0x55: '5',
  0x56: '6',
  0x57: '7',
  0x58: '8',
  0x59: '9',
  0x5a: '10',
  0x5b: '11',
  0x5c: '12',
  0x5d: '13',
  0x5e: '14',
  0x5f: '15',
  0x60: '16',
  0x63: 'IF',
  0x64: 'NOTIF',
  0x65: 'VERIF',
  0x66: 'VERNOTIF',
  0x67: 'ELSE',
  0x68: 'ENDIF',
  0x69: 'VERIFY',
  0x6a: 'RETURN',
  0x6b: 'TOALTSTACK',
  0x6c: 'FROMALTSTACK',
  0x6d: '2DROP',
  0x6e: '2DUP',
  0x6f: '3DUP',
  0x70: '2OVER',
  0x71: '2ROT',
  0x72: '2SWAP',
  0x73: 'IFDUP',
  0x74: 'DEPTH',
  0x75: 'DROP',
  0x76: 'DUP',
  0x77: 'NIP',
  0x78: 'OVER',
  0x79: 'PICK',
  0x7a: 'ROLL',
  0x7b: 'ROT',
  0x7c: 'SWAP',
  0x7d: 'TUCK',
  0x7e: 'CAT',
  0x7f: 'SUBSTR',
  0x80: 'LEFT',
  0x81: 'RIGHT',
  0x82: 'SIZE',
  0x83: 'INVERT',
  0x84: 'AND',
  0x85: 'OR',
  0x86: 'XOR',
  0x87: 'EQUAL',
  0x88: 'EQUALVERIFY',
  0x8b: '1ADD',
  0x8c: '1SUB',
  0x8d: '2MUL',
  0x8e: '2DIV',
  0x8f: 'NEGATE',
  0x90: 'ABS',
  0x91: 'NOT',
  0x92: '0NOTEQUAL',
  0x93: 'ADD',
  0x94: 'SUB',
  0x95: 'MUL',
  0x96: 'DIV',
  0x97: 'MOD',
  0x98: 'LSHIFT',
  0x99: 'RSHIFT',
  0x9a: 'BOOLAND',
  0x9b: 'BOOLOR',
  0x9c: 'NUMEQUAL',
  0x9d: 'NUMEQUALVERIFY',
  0x9e: 'NUMNOTEQUAL',
  0x9f: 'LESSTHAN',
  0xa0: 'GREATERTHAN',
  0xa1: 'LESSTHANOREQUAL',
  0xa2: 'GREATERTHANOREQUAL',
  0xa3: 'MIN',
  0xa4: 'MAX',
  0xa5: 'WITHIN',
  0xa6: 'RIPEMD160',
  0xa7: 'SHA1',
  0xa8: 'SHA256',
  0xa9: 'HASH160',
  0xaa: 'HASH256',
  0xab: 'CODESEPARATOR',
  0xac: 'CHECKSIG',
  0xad: 'CHECKSIGVERIFY',
  0xae: 'CHECKMULTISIG',
  0xaf: 'CHECKMULTISIGVERIFY',
  0xb0: 'BLAKE3',
  0xb1: 'DOUBLEBLAKE3',
}
