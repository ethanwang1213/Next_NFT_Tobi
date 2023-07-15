import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
import {parse} from "csv-parse/sync";
import * as fs from "fs";
import * as path from "path";

type Tobiraneko = {
  Generation: string;
  id: string;
  Figure: string;
  Pattern: string;
  "Body-colour": string;
  "Eye-colour": string;
  "Nose-colour": string;
  "Whisker-type": string;
  "Eye-type": string;
  "Ear-type": string;
  "Mouth-type": string;
};

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = getFirestore();

const main = async () => {
  // const csvFilePath = path.resolve(__dirname, "metadata-gen0-id0.csv");
  // const csvFilePath = path.resolve(__dirname, "metadata-gen0.csv");
  const csvFilePath = path.resolve(__dirname, "metadata-gen1.csv");
  // const headers = ["Generation", "id", "Figure", "Pattern", "Body-colour", "Eye-colour", "Nose-colour", "Whisker-type", "Eye-type", "Ear-type", "Mouth-type"];
  const fileContent = fs.readFileSync(csvFilePath, {encoding: "utf-8"});
  const csvData = parse(fileContent, {
    delimiter: ",",
    columns: true,
  });
  const ref = db.collection("tobiraneko");
  Promise.all(csvData.map(async (neko: Tobiraneko) => {
    console.log(neko.id);
    const data = {
      "name": `TOBIRA NEKO #${ (`00000${neko.id}`).slice(-5)}`,
      "description": "",
      "image": `https://storage.googleapis.com/tobiratory-media/nft/tobiraneko/${neko.id}.png`,
      "external_url": "",
      "animation_url": "",
      "origin_cid": "",
      "attributes": [
        {
          "trait_type": "Generation",
          "value": neko.Generation,
        },
        {
          "trait_type": "Figure",
          "value": neko.Figure,
        },
        {
          "trait_type": "Pattern",
          "value": neko.Pattern,
        },
        {
          "trait_type": "Body-colour",
          "value": neko["Body-colour"],
        },
        {
          "trait_type": "Eye-colour",
          "value": neko["Eye-colour"],
        },
        {
          "trait_type": "Nose-colour",
          "value": neko["Nose-colour"],
        },
        {
          "trait_type": "Whisker-type",
          "value": neko["Whisker-type"],
        },
        {
          "trait_type": "Eye-type",
          "value": neko["Eye-type"],
        },
        {
          "trait_type": "Ear-type",
          "value": neko["Ear-type"],
        },
        {
          "trait_type": "Mouth-type",
          "value": neko["Mouth-type"],
        },
      ],
    };
    return ref.doc(neko.id).set(data);
  }));
};

main();
