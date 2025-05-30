### Flow Contracts

### 📦 Project Structure
Your project comes with some standard folders which have a special purpose:
- `/cadence` inside here is where your Cadence smart contracts code lives
- `flow.json` configuration file for your project, you can think of it as package.json, but you don't need to worry, flow dev command will configure it for you

Inside `cadence` folder you will find:
- `/contracts` location for Cadence contracts go in this folder
- `/scripts` location for Cadence scripts goes here
- `/transactions` location for Cadence transactions goes in this folder
- `/tests` all the integration tests for your dapp and Cadence tests go into this folder


### 👨‍💻 Start Developing
After creating this project using the flow setup command you should then start the emulator by running:
```
> yarn emulator
```

Open a new terminal and deploy the contracts by running:
```
> yarn deploy
```

### Sample Transactions

#### Mint NFT

Mint an NFT by the emulater-account (f8d6e0586b0a20c7)
```
> yarn mint

> yarn getIds
```

Create NFT Collection by the emulater-account-2 (01cf0e2f2f715450)
```
> yarn createAccount

> yarn createCollection2

> yarn getIds2
```

Fail: Mint an NFT by the emulater-account-2 (01cf0e2f2f715450) will fail because the account is not the creator of the NFT
```
> yarn mint2
```

#### Get Metadata

Get metadata of an NFT by the emulater-account (f8d6e0586b0a20c7)
```
> yarn getMetadata
```

#### Transfer NFT

Transfer an NFT from the emulater-account (f8d6e0586b0a20c7) to the emulater-account-2 (01cf0e2f2f715450)
```
> yarn transfer

> yarn getIds

> yarn getIds2
```

## mainnet / testnet

To access mainnet and testnet, obtain mainnet-accounts.json and testnet-accounts.json from keybase and place them in the same folder as flow.json

```
$ ls *.json
flow.json  mainnet-accounts.json  package.json  testnet-accounts.json

$ flow project deploy -f flow.json -f testnet-accounts.json --network=testnet
```

## Cadence 1.0 Migration

```
# testnet
flow-c1 migrate stage TobiraNeko -f flow.json -f testnet-accounts.json --network=testnet
flow-c1 migrate stage HouseBadge -f flow.json -f testnet-accounts.json --network=testnet
flow-c1 migrate stage AchievementBadge -f flow.json -f testnet-accounts.json --network=testnet
flow-c1 migrate stage Festival23Badge -f flow.json -f testnet-accounts.json --network=testnet
flow-c1 migrate stage TobiratoryDigitalItems -f flow.json -f testnet-accounts.json --network=testnet

flow-c1 migrate is-staged TobiraNeko -f flow.json -f testnet-accounts.json --network=testnet
flow-c1 migrate is-staged HouseBadge -f flow.json -f testnet-accounts.json --network=testnet
flow-c1 migrate is-staged AchievementBadge -f flow.json -f testnet-accounts.json --network=testnet
flow-c1 migrate is-staged Festival23Badge -f flow.json -f testnet-accounts.json --network=testnet
flow-c1 migrate is-staged TobiratoryDigitalItems -f flow.json -f testnet-accounts.json --network=testnet

flow-c1 migrate is-validated TobiraNeko -f flow.json -f testnet-accounts.json --network=testnet
flow-c1 migrate is-validated HouseBadge -f flow.json -f testnet-accounts.json --network=testnet
flow-c1 migrate is-validated AchievementBadge -f flow.json -f testnet-accounts.json --network=testnet
flow-c1 migrate is-validated Festival23Badge -f flow.json -f testnet-accounts.json --network=testnet
flow-c1 migrate is-validated TobiratoryDigitalItems -f flow.json -f testnet-accounts.json --network=testnet

# mainnet
flow-c1 migrate stage TobiraNeko -f flow.json -f mainnet-accounts.json --network=mainnet
flow-c1 migrate stage HouseBadge -f flow.json -f mainnet-accounts.json --network=mainnet
flow-c1 migrate stage AchievementBadge -f flow.json -f mainnet-accounts.json --network=mainnet
flow-c1 migrate stage Festival23Badge -f flow.json -f mainnet-accounts.json --network=mainnet

flow-c1 migrate is-staged TobiraNeko -f flow.json -f mainnet-accounts.json --network=mainnet
flow-c1 migrate is-staged HouseBadge -f flow.json -f mainnet-accounts.json --network=mainnet
flow-c1 migrate is-staged AchievementBadge -f flow.json -f mainnet-accounts.json --network=mainnet
flow-c1 migrate is-staged Festival23Badge -f flow.json -f mainnet-accounts.json --network=mainnet

flow-c1 migrate is-validated TobiraNeko -f flow.json -f mainnet-accounts.json --network=mainnet
flow-c1 migrate is-validated HouseBadge -f flow.json -f mainnet-accounts.json --network=mainnet
flow-c1 migrate is-validated AchievementBadge -f flow.json -f mainnet-accounts.json --network=mainnet
flow-c1 migrate is-validated Festival23Badge -f flow.json -f mainnet-accounts.json --network=mainnet
```
