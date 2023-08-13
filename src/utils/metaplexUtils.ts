import {
  DefaultCandyGuardSettings,
  Metaplex,
  PublicKey,
  CandyMachine,
  SolAmount,
  SplTokenAmount,
  FindNftsByOwnerOutput,
  getMerkleRoot,
  getMerkleTree,
} from "@metaplex-foundation/js";
//https://github.com/MarkSackerberg/CandyMachine-v3-ui-template/blob/main/utils/checker.ts

import {
  createNft,
  mplTokenMetadata,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { Keypair } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import {
  createSignerFromKeypair,
  generateSigner,
  keypairIdentity,
  percentAmount,
  signerIdentity,
} from "@metaplex-foundation/umi";

const createCollectionNft = async () => {
  // Use the RPC endpoint of your choice.
  const umi = createUmi("http://127.0.0.1:8899").use(mplCandyMachine());
  const myCustomAuthority = Keypair.generate();
  const candyMachineSettings = {
    authority: myCustomAuthority,
  };
  const umiKeypair = umi.eddsa.createKeypairFromSecretKey(
    myCustomAuthority.secretKey
  );
  //console.log("umiKeypair",umiKeypair);
  umi.use(keypairIdentity(umiKeypair)).use(mplTokenMetadata());
  const mint = generateSigner(umi);

  // Create the Collection NFT.
  const collectionUpdateAuthority = generateSigner(umi);
  const collectionMint = createSignerFromKeypair(umi, umiKeypair); //generateSigner(umi);
  await createNft(umi, {
    mint: collectionMint,
    authority: collectionUpdateAuthority,
    name: "My Collection NFT",
    uri: "https://example.com/path/to/some/json/metadata.json",
    sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
    isCollection: true,
  }).sendAndConfirm(umi);
};

const solBalanceChecker = (solBalance: Number, solAmount: SolAmount) => {
  const costInLamports = Number(solAmount.basisPoints.toString(10));
  if (costInLamports > solBalance) {
    console.error("freezeSolPayment/solPayment: Not enough SOL!");
    return false;
  }
  return true;
};

const tokenBalanceChecker = async (
  metaplex: Metaplex,
  tokenAmount: SplTokenAmount,
  tokenMint: PublicKey
) => {
  const ata = metaplex.tokens().pdas().associatedTokenAccount({
    mint: tokenMint,
    owner: metaplex.identity().publicKey,
  });

  const balance = await metaplex.connection.getTokenAccountBalance(ata);

  if (Number(balance.value) < Number(tokenAmount.basisPoints.toString(10))) {
    return false;
  }
  return true;
};

const mintLimitChecker = async (
  metaplex: Metaplex,
  candyMachine: CandyMachine,
  singleGuard: DefaultCandyGuardSettings
) => {
  if (!singleGuard.mintLimit || !candyMachine.candyGuard) {
    return;
  }
  const mintLimitCounter = metaplex.candyMachines().pdas().mintLimitCounter({
    id: singleGuard.mintLimit.id,
    user: metaplex.identity().publicKey,
    candyMachine: candyMachine.address,
    candyGuard: candyMachine.candyGuard.address,
  });

  const mintedAmountBuffer = await metaplex.connection.getAccountInfo(
    mintLimitCounter,
    "processed"
  );

  let mintedAmount: Number = 0;
  if (mintedAmountBuffer != null) {
    mintedAmount = mintedAmountBuffer.data.readUintLE(0, 1);
  }

  if (mintedAmount >= singleGuard.mintLimit.limit) {
    console.error("mintLimit: mintLimit reached!");
    return false;
  }
  return true;
};

const ownedNftChecker = async (
  ownedNfts: FindNftsByOwnerOutput,
  requiredCollection: PublicKey
) => {
  const nftsInCollection = ownedNfts.filter((obj) => {
    return (
      obj.collection?.address.toBase58() === requiredCollection.toBase58() &&
      obj.collection?.verified === true
    );
  });
  if (nftsInCollection.length < 1) {
    console.error("nftBurn: The user has no NFT to pay with!");
    return false;
  } else {
    return true;
  }
};
