import Crypto
// https://developers.flow.com/build/basics/accounts#supported-signature--hash-algorithms
// https://cadence-lang.org/docs/language/accounts#account-keys
transaction(publicKey: String, signatureAlgorithm: UInt8, hashAlgorithm: UInt8, weight: UFix64) {
    prepare(signer: auth(AddKey) &Account) {
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