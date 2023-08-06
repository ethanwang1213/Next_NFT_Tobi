import Crypto
// https://developers.flow.com/concepts/start-here/accounts-and-keys#supported-signature--hash-algorithms
// https://developers.flow.com/cadence/language/accounts#account-keys
transaction(publicKey: String, signatureAlgorithm: UInt8, hashAlgorithm: UInt8, weight: UFix64) {
    prepare(signer: AuthAccount) {
        let key = PublicKey(
            publicKey: publicKey.decodeHex(),
            signatureAlgorithm: SignatureAlgorithm(rawValue: signatureAlgorithm)!
        )

        signer.keys.add(
            publicKey: key,
            hashAlgorithm: HashAlgorithm(rawValue: hashAlgorithm)!,
            weight: weight
        )
    }   
}