import Crypto
// https://cadence-lang.org/docs/language/accounts#account-keys
transaction(keyIndex: Int) {
    prepare(signer: auth(RevokeKey) &Account) {
        let key = signer.keys.revoke(keyIndex: keyIndex)
    }
}