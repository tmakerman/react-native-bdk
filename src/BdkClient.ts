import { NativeModules, Platform } from 'react-native';
import {
  Network,
  WordCount,
  LoadWalletResponse,
  SendTransactionResult,
  AddressIndexVariant,
  PsbtSerialised,
} from './utils/types';
import {
  AddressInfo,
  Balance,
  LocalUtxo,
  TransactionDetails,
} from './classes/Bindings';

const LINKING_ERROR =
  "The package 'react-native-bdk' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const NativeBDK =
  NativeModules?.BdkModule ??
  new Proxy(
    {},
    {
      get(): void {
        throw new Error(LINKING_ERROR);
      },
    }
  );

interface NativeBdk {
  generateMnemonic(wordCount: WordCount): Promise<string>;

  loadWallet(
    mnemonic: string,
    passphrase: string,
    network?: Network,
    blockchainConfigUrl?: string,
    blockchainSocket5?: string,
    retry?: string,
    timeOut?: string,
    blockchainName?: string,
    descriptor?: string
  ): Promise<LoadWalletResponse>;
  unloadWallet(): Promise<boolean>;

  syncWallet(): Promise<string>;
  getAddress(
    indexVariant: AddressIndexVariant,
    index: number
  ): Promise<AddressInfo>;
  getBalance(): Promise<Balance>;
  setBlockchain(): Promise<string>;
  createTransaction(
    address: string,
    amount: number,
    fee_rate: number
  ): Promise<{ txdetails: TransactionDetails; psbt: PsbtSerialised }>;
  sendTransaction(psbt_base64: string): Promise<SendTransactionResult>;

  getTransactions(): Promise<Array<TransactionDetails>>;
  listUnspent(): Promise<Array<LocalUtxo>>;

  addTxRecipient(recipient: string, amount: number): Promise<string>;
}

export class BdkClient {
  protected _bdk: NativeBdk = NativeBDK;

  constructor() {
    this._bdk = NativeBDK;
  }
}
