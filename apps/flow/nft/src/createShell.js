const fs = require('fs');
const {parse} = require('csv-parse/sync');

const csvFileName = 'shopify-data-gen0.csv';

const main = async () => {
  const csvFilePath = `./nft/metadata/shopify/${csvFileName}`;
  const csvData = fs.readFileSync(csvFilePath, 'utf8');
  const records = parse(csvData, { columns: true });
  const stream = fs.createWriteStream(`./nft/shell/mint-${csvFileName}.sh`);
  stream.on("error", (err)=>{
    if(err)
      console.log(err.message);
  });
  stream.write('#!/bin/bash\n\n');
  for (const row of records) {
    if (row['Title']) {
      const command = `
flow transactions send ./cadence/transactions/mintNFT.cdc \\
  --network=emulator \\
  '${row['Title']}' \\
  '${row['Tags']}' \\
  ${row['Image Src']}
`
//       const command = `
// flow transactions send ./cadence/transactions/mintNFT.cdc \\
//   --network=testnet --signer testnetAccount3 \\
//   '${row['Title']}' \\
//   '${row['Tags']}' \\
//   ${row['Image Src']}
// `
      stream.write(command);
    }
  }
  stream.end("\n");
}

main().catch((e) => {
  console.error(e);
});
