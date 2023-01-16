// taken from thunderbiscuit DevKit Wallet
// https://github.com/thunderbiscuit/devkit-wallet

package com.bdk

import android.util.Log
import org.bitcoindevkit.*
import org.bitcoindevkit.Wallet as BdkWallet

object Wallet {
    private lateinit var wallet: BdkWallet
    // private const val regtestEsploraUrl: String = "http://10.0.2.2:3002"
    private const val electrumURL: String = "ssl://electrum.blockstream.info:60002"
    private lateinit var blockchainConfig: BlockchainConfig
    private lateinit var blockchain: Blockchain

    object LogProgress: Progress {
        override fun update(progress: Float, message: String?) {
            Log.i(progress.toString(), "Sync wallet")
        }
    }

    private fun initialize(
        externalDescriptor: String,
        internalDescriptor: String,
    ) {
        val database = DatabaseConfig.Memory
        this.wallet = BdkWallet(
            externalDescriptor,
            internalDescriptor,
            // Network.REGTEST,
            Network.TESTNET,
            database,
        )
    }

    fun setBlockchain() {
        try {
            blockchainConfig = BlockchainConfig.Electrum(ElectrumConfig(electrumURL, null, 5u, null, 10u))
            // blockchainConfig = BlockchainConfig.Esplora(EsploraConfig(esploraUrl, null, 5u, 20u, 10u))
            this.blockchain = Blockchain(blockchainConfig)
        } catch (error: Throwable) {
            throw(error)
        }

    }

    fun createWallet(): Map<String, Any?> {
        val bip32RootKey = DescriptorSecretKey(
            network = Network.TESTNET,
            mnemonic = Mnemonic(WordCount.WORDS12),
            password = ""
        )
        val externalDescriptor: String = createExternalDescriptor(bip32RootKey)
        val internalDescriptor: String = createInternalDescriptor(bip32RootKey)
        initialize(
            externalDescriptor = externalDescriptor,
            internalDescriptor = internalDescriptor,
        )
        // TODO - RN alternative
        // Repository.saveWallet(path, externalDescriptor, internalDescriptor)
        // Repository.saveMnemonic(Mnemonic.toString())
        val responseObject = mutableMapOf<String, Any?>()
        responseObject["address"] = getNewAddress()
        return responseObject
    }

    // only create BIP84 compatible wallets
    private fun createExternalDescriptor(rootKey: DescriptorSecretKey): String {
        val externalPath = DerivationPath("m/84h/1h/0h/0")
        return "wpkh(${rootKey.extend(externalPath).asString()})"
    }

    private fun createInternalDescriptor(rootKey: DescriptorSecretKey): String {
        val internalPath = DerivationPath("m/84h/1h/0h/1")
        return "wpkh(${rootKey.extend(internalPath).asString()})"
    }

    fun importWallet(
        mnemonic: String = "", password: String?, network: String?,
        blockchainConfigUrl: String, blockchainSocket5: String?,
        retry: String?, timeOut: String?, blockchainName: String?, descriptor: String = ""
    ): Map<String, Any?> {

        val mnemonicObj = Mnemonic.fromString(mnemonic)
        val bip32RootKey = DescriptorSecretKey(
            network = setNetwork(network),
            mnemonic = mnemonicObj,
            password = password
        )
        val externalDescriptor: String = createExternalDescriptor(bip32RootKey)
        val internalDescriptor: String = createInternalDescriptor(bip32RootKey)
        initialize(
            externalDescriptor = externalDescriptor,
            internalDescriptor = internalDescriptor,
        )
        // Repository.saveWallet(path, externalDescriptor, internalDescriptor)
        // Repository.saveMnemonic(mnemonic.toString())
        val responseObject = mutableMapOf<String, Any?>()
        responseObject["address"] = getNewAddress()
        return responseObject
    }

    fun destroyWallet(): Boolean {
        try {
            wallet.destroy()
            return true
        } catch (error: Throwable) {
            throw(error)
        }
    }

    // .finish() returns TxBuilderResult = Result<(Psbt, TransactionDetails), Error>
    fun createTransaction(recipient: String, amount: Double, feeRate: Float):  TxBuilderResult {
      try {
        val longAmt: Long = amount.toLong()
        val scriptPubkey: Script = Address(recipient).scriptPubkey()

        return TxBuilder()
            .addRecipient(scriptPubkey, longAmt.toULong())
            .feeRate(satPerVbyte = feeRate)
            .finish(wallet)
      } catch (error: Throwable) {
            throw(error)
      }
    }

    private fun sign(psbt: PartiallySignedTransaction) {
      try {
        wallet.sign(psbt)
      } catch (error: Throwable) {
        throw(error)
      }
    }

    fun broadcast(psbt: PartiallySignedTransaction): PartiallySignedTransaction {
      try {
        sign(psbt)
        blockchain.broadcast(psbt)
        return psbt
      } catch (error: Throwable) {
        throw(error)
      }
    }

    fun getTransactions(): List<TransactionDetails> = wallet.listTransactions()

    fun listLocalUnspent(): List<LocalUtxo> = wallet.listUnspent()

    fun sync() {
        wallet.sync(blockchain, LogProgress)
    }

    fun getBalance(): ULong = wallet.getBalance().total

    fun getNewAddress(): String {
        try {
            val addressInfo = wallet.getAddress(AddressIndex.NEW)
            return addressInfo.address
        } catch (error: Throwable) {
            throw(error)
        }
    }

    fun getLastUnusedAddress(): String {
        try {
            val addressInfo = wallet.getAddress(AddressIndex.LAST_UNUSED)
            return addressInfo.address
        } catch (error: Throwable) {
            throw(error)
        }
    }

    fun isBlockchainSet() = ::blockchain.isInitialized

    fun setNetwork(networkStr: String? = "testnet"): Network {
        return when (networkStr) {
            "testnet" -> Network.TESTNET
            "bitcoin" -> Network.BITCOIN
            "regtest" -> Network.REGTEST
            "signet" -> Network.SIGNET
            else -> {
                Network.TESTNET
            }
        }
    }
}
