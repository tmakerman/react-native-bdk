import { Result } from '@synonymdev/result';

export type NetworkType = 'bitcoin' | 'testnet' | 'signet' | 'regtest';

export interface CreateExtendedKeyRequest {
  network?: NetworkType;
  mnemonic?: string;
  password?: string;
}
export interface CreateExtendedKeyResponse {
  fingerprint: string;
  mnemonic: string;
  xprv: string;
}

export type WPKH = 'default' | null | '' | 'p2wpkh' | 'wpkh' | undefined;
export type P2PKH = 'p2pkh' | 'pkh';
export type SHP2WPKH = 'shp2wpkh' | 'p2shp2wpkh';

export interface CreateDescriptorRequest {
  type?: WPKH | P2PKH | SHP2WPKH | 'MULTI';

  /**
   * Required if xprv flow is chosen
   */
  xprv?: string;

  /**
   * Required if mnemonic flow is chosen
   */
  mnemonic?: string;

  /**
   * Optional and only if mnemonic flow is chosen
   */
  password?: string;

  /**
   * Required if mnemonic flow is chosen
   */
  network?: NetworkType;

  /**
   * If want to use custom path instead of default(/84'/1'/0'/0/*)
   */
  path?: string;

  /**
   * required if type is MULTI
   * can't be 0 or grator than number public keys
   * */
  threshold?: number;

  /**
   * Array of public keys
   */
  publicKeys?: Array<string>;
}

export interface ImportWalletArgs {
  mnemonic?: string;
  descriptor?: string;
  password?: string;
  network?: NetworkType;
  blockchainConfigUrl?: string;
  blockchainSocket5?: string;
  retry?: string;
  timeOut?: string;
  blockchainName?: string;
}

export interface InitWalletResponse {
  address: string;
}

export interface CreateTransactionArgs {
  address: string;
  amount: number;
  fee_rate: number;
}

export interface SignTransactionArgs {
  psbt_base64: string;
}

export interface ConfirmedTransaction {
  txid: string;
  block_timestamp: number;
  sent: number;
  block_height: number;
  received: number;
  fee: number;
}

export interface PendingTransaction {
  txid: string;
  sent: number;
  received: number;
  fee: number;
}

export interface TransactionsResponse {
  confirmed: Array<ConfirmedTransaction>;
  pending: Array<PendingTransaction>;
}

export interface BlockTime {
  timestamp: number;
  height: number;
}

export interface TransactionDetails {
  txid: string;
  received: number;
  sent: number;
  fee?: number;
  confirmation_timestamp?: number;
  confirmation_blockheight?: number;
}

export interface OutPoint {
  txid: string;
  vout: number;
}

export interface TxIn {
  previous_output: OutPoint;
  script_sig: string;
  sequence: number;
  witness: string;
}

export interface TxOut {
  value: number;
  script_pubkey: string;
}

enum KeychainKind {
  External,
  Internal,
}

export interface LocalUtxo {
  outpoint: OutPoint;
  txout: TxOut;
  keychain: KeychainKind;
  is_spent: boolean;
}

export interface LocalUtxoFlat {
  outpoint_txid: string;
  outpount_vout: string;
  txout_value: number;
  txout_address: string;
  keychain: KeychainKind;
  is_spent: boolean;
}

export interface Transaction {
  version: number;
  lock_time: number;
  input: TxIn;
  output: TxOut;
}

export interface CreateTransactionResult {
  txid: string;
  txdetails_txid: string;
  txdetails_received: number;
  txdetails_sent: number;
  txdetails_fee?: number;
  txdetails_confirmation_timestamp?: number;
  txdetails_confirmation_blockheight?: number;
  psbt_tx_base64: string;
  psbt_serialised_base64: string;
}

export interface SignTransactionResult {
  signed_psbt_base64: string;
  signed_tx_hex: string;
}

export interface SendTransactionResult {
  txid: string;
  fee_amount: number;
}
