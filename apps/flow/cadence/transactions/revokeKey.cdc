import Crypto
// https://developers.flow.com/cadence/language/accounts#account-keys
transaction(keyIndex: Int) {
    prepare(signer: AuthAccount) {
        let key = signer.keys.revoke(keyIndex: keyIndex)
    }
}