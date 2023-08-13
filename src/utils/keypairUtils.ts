import { readFile, writeFile } from "fs";
import bs58 from "bs58";
const kp = [
  10,10
];
console.log(bs58.encode(kp));
// readFile('kp.json', "utf-8", (err, data) => {
//     console.log(data)
//     const arr: Uint8Array = JSON.parse(data);
//   console.log(bs58.encode(arr));
// });
// const pkp = Keypair.fromSeed(Uint8Array.from(kp.slice(0, 32)));
