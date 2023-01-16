import Foundation

let TAG = "BDK"

@objc(BdkModule)
class BdkModule: NSObject {
    let bdkFunctions = BdkFunctions()
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc
    func generateMnemonic(_
        wordCount: NSNumber? = 12,
        network: String? = "testnet",
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            var number = WordCount.words12
            switch (wordCount) {
                case 15: number = WordCount.words15
                case 18: number = WordCount.words18
                case 21: number = WordCount.words21
                case 24: number = WordCount.words24
                default: number = WordCount.words12
            }
            let networkName: Network = bdkFunctions.setNetwork(networkStr: network)
            let response = try generateExtendedKey(network: networkName, wordCount: number, password: "")
            resolve(response.mnemonic)
        } catch let error {
            reject("Generate mnemonic Error", error.localizedDescription, error)
        }
    }
    
    @objc
    func getExtendedKeyInfo(_
        network: String,
        mnemonic: String,
        password: String? = nil,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let networkName: Network = bdkFunctions.setNetwork(networkStr: network)
            let response = try bdkFunctions.extendedKeyInfo(network: networkName, mnemonic:mnemonic, password: password)
            resolve(response)
        } catch let error {
            reject("Get extended keys error", error.localizedDescription, error)
        }
    }

    @objc
    func createWallet(_
        mnemonic: String? = nil,
        password: String? = nil,
        network: String? = nil,
        blockchainConfigUrl: String? = nil,
        blockchainSocket5: String? = nil,
        retry: String? = nil,
        timeOut: String? = nil,
        blockchainName: String? = nil,
        descriptor: String? = nil,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let responseObject = try bdkFunctions.createWallet(
                mnemonic: mnemonic,
                password: password,
                network: network,
                blockchainConfigUrl: blockchainConfigUrl,
                blockchainSocket5: blockchainSocket5,
                retry: retry,
                timeOut: timeOut,
                blockchainName: blockchainName,
                descriptor: descriptor
            )
            resolve(responseObject)
        } catch let error {
            reject("Init Wallet Error", error.localizedDescription, error)
        }
    }

    @objc
    func getNewAddress(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let address = bdkFunctions.getNewAddress()
        return resolve(address)
    }
    
    @objc
    func syncWallet(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        bdkFunctions.syncWallet()
        return resolve("wallet sync complete")
    }

    @objc
    func getBalance(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let response = try bdkFunctions.getBalance()
            resolve(response)
        } catch let error {
            reject("Get Balance Error", error.localizedDescription, error)
        }
    }

    @objc
    func broadcastTx(_
        recipient: String,
        amount: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let responseObject = try bdkFunctions.broadcastTx(recipient, amount: amount)
            resolve(responseObject)
        } catch let error {
            let details = "\(error)"
            reject("Broadcast Error", details, error)
        }
    }
    
    @objc
    func getLastUnusedAddress(_
                              resolve: @escaping RCTPromiseResolveBlock,
                              reject: @escaping RCTPromiseRejectBlock
    ) {
        let address = bdkFunctions.getLastUnusedAddress()
        resolve(address)
    }

    @objc
    func getWallet(_
                   resolve: @escaping RCTPromiseResolveBlock,
                   reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let response = try bdkFunctions.getWallet()
            resolve(response)
        } catch let error {
            reject("Get Balance Error", error.localizedDescription, error)
        }
    }

    @objc
    func getPendingTransactions(_
                                resolve: @escaping RCTPromiseResolveBlock,
                                reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let response = try bdkFunctions.transactionsList(pending: true)
            resolve(response)
        } catch let error {
            reject("Pending transactions error", error.localizedDescription, error)
        }
    }

    @objc
    func getConfirmedTransactions(_
                                  resolve: @escaping RCTPromiseResolveBlock,
                                  reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let response = try bdkFunctions.transactionsList()
            resolve(response)
        } catch let error {
            reject("Confirmed transactions error", error.localizedDescription, error)
        }
    }

}

