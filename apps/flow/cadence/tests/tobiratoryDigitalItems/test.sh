flow-c1 deploy --update

# Create user account
#     cf. flow-c1 keys derive af81d22fdec3fa17e283255e8de1d78db0070ef17d461fd065efbeab5349f7ef
flow-c1 accounts create --key 2b4befc2504c1c89e53ef15d743abde0bf2c6aafad57aad27f30a321f88bd17a93737f0beb04b7650fee0c9242a3110b62631bbb7607e210673a0cceb8d59c77

flow-c1 transactions send ./cadence/transactions/tobiratoryDigitalItems/createCollection.cdc --signer emulator-account-2

# Create item
flow-c1 transactions build ./cadence/transactions/tobiratoryDigitalItems/createItem.cdc \
    --args-json '[
        { "type": "String", "value": "testType" },
        { "type": "Optional", "value": { "type": "String", "value": "testName" }},
        { "type": "Optional", "value": { "type": "String", "value": "testDescription" }},
        { "type": "String", "value": "testThumbnailUrl" },
        { "type": "Optional", "value": { "type": "String", "value": "testModelUrl" }},
        { "type": "String", "value": "testCreatorName" },
        { "type": "Optional", "value": { "type": "UInt32", "value": "100" }},
        { "type": "Optional", "value": { "type": "String", "value": "testLicense" }},
        { "type": "Array", "value": [
            { "type": "String", "value": "copyrightHolder1" },
            { "type": "String", "value": "copyrightHolder2" }
        ]}
    ]' \
    --authorizer emulator-account-2 --authorizer emulator-account \
    --proposer emulator-account-2 --payer emulator-account \
    --filter payload --save ./cadence/tmp/tx_build.rlp -y
flow-c1 transactions sign ./cadence/tmp/tx_build.rlp --signer emulator-account-2 --filter payload --save ./cadence/tmp/tx_presigned.rlp -y
flow-c1 transactions sign ./cadence/tmp/tx_presigned.rlp --signer emulator-account --filter payload --save ./cadence/tmp/tx_signed.rlp -y
flow-c1 transactions send-signed ./cadence/tmp/tx_signed.rlp -y

# Mint NFT
flow-c1 transactions build ./cadence/transactions/tobiratoryDigitalItems/mintNFT.cdc \
    0x179b6b1cb6755e31 1 \
    --authorizer emulator-account-2 --authorizer emulator-account \
    --proposer emulator-account-2 --payer emulator-account \
    --filter payload --save ./cadence/tmp/tx_build.rlp -y
flow-c1 transactions sign ./cadence/tmp/tx_build.rlp --signer emulator-account-2 --filter payload --save ./cadence/tmp/tx_presigned.rlp -y
flow-c1 transactions sign ./cadence/tmp/tx_presigned.rlp --signer emulator-account --filter payload --save ./cadence/tmp/tx_signed.rlp -y
flow-c1 transactions send-signed ./cadence/tmp/tx_signed.rlp -y

# Mint NFT 2
flow-c1 transactions build ./cadence/transactions/tobiratoryDigitalItems/mintNFT.cdc \
    0x179b6b1cb6755e31 1 \
    --authorizer emulator-account-2 --authorizer emulator-account \
    --proposer emulator-account-2 --payer emulator-account \
    --filter payload --save ./cadence/tmp/tx_build.rlp -y
flow-c1 transactions sign ./cadence/tmp/tx_build.rlp --signer emulator-account-2 --filter payload --save ./cadence/tmp/tx_presigned.rlp -y
flow-c1 transactions sign ./cadence/tmp/tx_presigned.rlp --signer emulator-account --filter payload --save ./cadence/tmp/tx_signed.rlp -y
flow-c1 transactions send-signed ./cadence/tmp/tx_signed.rlp -y

# View NFT Metadata
flow-c1 scripts execute ./cadence/scripts/tobiratoryDigitalItems/getMetadata.cdc 0x179b6b1cb6755e31 1
flow-c1 scripts execute ./cadence/scripts/tobiratoryDigitalItems/getMetadataTraits.cdc 0x179b6b1cb6755e31 1

# Update item name
flow-c1 transactions build ./cadence/transactions/tobiratoryDigitalItems/updateItemName.cdc \
    --args-json '[
        { "type": "UInt64", "value": "1" },
        { "type": "String", "value": "testName - updated" }
    ]' \
    --authorizer emulator-account-2 --authorizer emulator-account \
    --proposer emulator-account-2 --payer emulator-account \
    --filter payload --save ./cadence/tmp/tx_build.rlp -y
flow-c1 transactions sign ./cadence/tmp/tx_build.rlp --signer emulator-account-2 --filter payload --save ./cadence/tmp/tx_presigned.rlp -y
flow-c1 transactions sign ./cadence/tmp/tx_presigned.rlp --signer emulator-account --filter payload --save ./cadence/tmp/tx_signed.rlp -y
flow-c1 transactions send-signed ./cadence/tmp/tx_signed.rlp -y

# View NFT Metadata
flow-c1 scripts execute ./cadence/scripts/tobiratoryDigitalItems/getMetadata.cdc 0x179b6b1cb6755e31 1
flow-c1 scripts execute ./cadence/scripts/tobiratoryDigitalItems/getMetadataTraits.cdc 0x179b6b1cb6755e31 1

# Attach NFT
flow-c1 transactions send ./cadence/transactions/tobiratoryDigitalItems/attachNFT.cdc 1 2 --signer emulator-account-2

# Detach NFT
flow-c1 transactions send ./cadence/transactions/tobiratoryDigitalItems/detachNFT.cdc 1 2 --signer emulator-account-2

# Transfer NFT
flow-c1 transactions send ./cadence/transactions/tobiratoryDigitalItems/transferNFT.cdc f8d6e0586b0a20c7 1 --signer emulator-account-2

# Setup item reviewer
flow-c1 transactions build ./cadence/transactions/tobiratoryDigitalItems/setupItemReviewer.cdc \
    --authorizer emulator-account --authorizer emulator-account-2 \
    --proposer emulator-account --payer emulator-account-2 \
    --filter payload --save ./cadence/tmp/tx_build.rlp -y
flow-c1 transactions sign ./cadence/tmp/tx_build.rlp --signer emulator-account --filter payload --save ./cadence/tmp/tx_presigned.rlp -y
flow-c1 transactions sign ./cadence/tmp/tx_presigned.rlp --signer emulator-account-2 --filter payload --save ./cadence/tmp/tx_signed.rlp -y
flow-c1 transactions send-signed ./cadence/tmp/tx_signed.rlp -y

# Setup minter
flow-c1 transactions build ./cadence/transactions/tobiratoryDigitalItems/setupMinter.cdc \
    --authorizer emulator-account --authorizer emulator-account-2 \
    --proposer emulator-account --payer emulator-account-2 \
    --filter payload --save ./cadence/tmp/tx_build.rlp -y
flow-c1 transactions sign ./cadence/tmp/tx_build.rlp --signer emulator-account --filter payload --save ./cadence/tmp/tx_presigned.rlp -y
flow-c1 transactions sign ./cadence/tmp/tx_presigned.rlp --signer emulator-account-2 --filter payload --save ./cadence/tmp/tx_signed.rlp -y
flow-c1 transactions send-signed ./cadence/tmp/tx_signed.rlp -y
