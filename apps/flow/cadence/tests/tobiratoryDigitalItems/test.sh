# Create user account
#     cf. flow keys derive af81d22fdec3fa17e283255e8de1d78db0070ef17d461fd065efbeab5349f7ef
flow accounts create --key 2b4befc2504c1c89e53ef15d743abde0bf2c6aafad57aad27f30a321f88bd17a93737f0beb04b7650fee0c9242a3110b62631bbb7607e210673a0cceb8d59c77

flow transactions send ./cadence/transactions/tobiratoryDigitalItems/createCollection.cdc --signer emulator-account-2

# Create item
flow transactions build ./cadence/transactions/tobiratoryDigitalItems/createItem.cdc \
    testType testName testDescription '["testImageUrl1", "testImageUrl1"]' testCreatorName 100 testLicense \
    --authorizer emulator-account-2 --authorizer emulator-account \
    --proposer emulator-account-2 --payer emulator-account \
    --filter payload --save ./cadence/tmp/tx_build.rlp -y
flow transactions sign ./cadence/tmp/tx_build.rlp --signer emulator-account-2 --filter payload --save ./cadence/tmp/tx_presigned.rlp -y
flow transactions sign ./cadence/tmp/tx_presigned.rlp --signer emulator-account --filter payload --save ./cadence/tmp/tx_signed.rlp -y
flow transactions send-signed ./cadence/tmp/tx_signed.rlp -y

# Mint NFT
flow transactions build ./cadence/transactions/tobiratoryDigitalItems/mintNFT.cdc \
    01cf0e2f2f715450 1 \
    --authorizer emulator-account-2 --authorizer emulator-account \
    --proposer emulator-account-2 --payer emulator-account \
    --filter payload --save ./cadence/tmp/tx_build.rlp -y
flow transactions sign ./cadence/tmp/tx_build.rlp --signer emulator-account-2 --filter payload --save ./cadence/tmp/tx_presigned.rlp -y
flow transactions sign ./cadence/tmp/tx_presigned.rlp --signer emulator-account --filter payload --save ./cadence/tmp/tx_signed.rlp -y
flow transactions send-signed ./cadence/tmp/tx_signed.rlp -y

# Mint NFT 2
flow transactions build ./cadence/transactions/tobiratoryDigitalItems/mintNFT.cdc \
    01cf0e2f2f715450 1 \
    --authorizer emulator-account-2 --authorizer emulator-account \
    --proposer emulator-account-2 --payer emulator-account \
    --filter payload --save ./cadence/tmp/tx_build.rlp -y
flow transactions sign ./cadence/tmp/tx_build.rlp --signer emulator-account-2 --filter payload --save ./cadence/tmp/tx_presigned.rlp -y
flow transactions sign ./cadence/tmp/tx_presigned.rlp --signer emulator-account --filter payload --save ./cadence/tmp/tx_signed.rlp -y
flow transactions send-signed ./cadence/tmp/tx_signed.rlp -y

# View NFT Metadata
flow scripts execute ./cadence/scripts/tobiratoryDigitalItems/getMetadata.cdc 01cf0e2f2f715450 1

# Attach NFT
flow transactions send ./cadence/transactions/tobiratoryDigitalItems/attachNFT.cdc 1 2 --signer emulator-account-2

# Detach NFT
flow transactions send ./cadence/transactions/tobiratoryDigitalItems/detachNFT.cdc 1 2 --signer emulator-account-2

# Transfer NFT
flow transactions send ./cadence/transactions/tobiratoryDigitalItems/transferNFT.cdc f8d6e0586b0a20c7 1 --signer emulator-account-2

# Setup item reviewer
flow transactions build ./cadence/transactions/tobiratoryDigitalItems/setupItemReviewer.cdc \
    --authorizer emulator-account --authorizer emulator-account-2 \
    --proposer emulator-account --payer emulator-account-2 \
    --filter payload --save ./cadence/tmp/tx_build.rlp -y
flow transactions sign ./cadence/tmp/tx_build.rlp --signer emulator-account --filter payload --save ./cadence/tmp/tx_presigned.rlp -y
flow transactions sign ./cadence/tmp/tx_presigned.rlp --signer emulator-account-2 --filter payload --save ./cadence/tmp/tx_signed.rlp -y
flow transactions send-signed ./cadence/tmp/tx_signed.rlp -y

# Setup minter
flow transactions build ./cadence/transactions/tobiratoryDigitalItems/setupMinter.cdc \
    --authorizer emulator-account --authorizer emulator-account-2 \
    --proposer emulator-account --payer emulator-account-2 \
    --filter payload --save ./cadence/tmp/tx_build.rlp -y
flow transactions sign ./cadence/tmp/tx_build.rlp --signer emulator-account --filter payload --save ./cadence/tmp/tx_presigned.rlp -y
flow transactions sign ./cadence/tmp/tx_presigned.rlp --signer emulator-account-2 --filter payload --save ./cadence/tmp/tx_signed.rlp -y
flow transactions send-signed ./cadence/tmp/tx_signed.rlp -y
