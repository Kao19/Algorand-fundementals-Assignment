/* eslint-disable */
import algosdk from "algosdk";
import { getAlgodClient } from "./client.js";
import wallets from "./wallets.js";
import { convertByte32ToIpfsCidV0 } from "../scripts/helpers/ipfs2bytes32.js";


const purchaseNFT = async (creator, receiver, nftId, fungibleTokenId) => {
    // create transactions here before calling sendAlgoSignerTransaction from wallet.js
    
    // write your code here
    
    const algodClient = getAlgodClient("Localhost");
    
    const suggestedParams = await algodClient.getTransactionParams().do();


    // Txn 1: Buyer account pays 5 fungible tokens to the creator
    let txn1 = algosdk.makeAssetTransferTxnWithSuggestedParams(
      receiver,
      creator,
      undefined,
      undefined,
      5,
      undefined,
      fungibleTokenId,
      suggestedParams
    );
  
    // Txn 2: Buyer opts into the NFT
    let txn2 = algosdk.makeAssetTransferTxnWithSuggestedParams(
      receiver,
      receiver,
      undefined,
      undefined,
      0,
      undefined,
      nftId,
      suggestedParams
    );
  
    // Txn 3: Creator sends the NFT to the buyer
    let txn3 = algosdk.makeAssetTransferTxnWithSuggestedParams(
      creator,
      receiver,
      undefined,
      undefined,
      1,
      undefined,
      nftId,
      suggestedParams
    );
  
  
    // Store txns
    let txns = [txn1, txn2, txn3];
  
    // Assign group ID
   algosdk.assignGroupID(txns);


    return await wallets.sendAlgoSignerTransaction(txns, algodClient);

}

const getAccountInfo = async (address, network) => {
    const algodClient = getAlgodClient(network);

    return await algodClient.accountInformation(address).do();
};

const checkMetadataHash = (uint8ArrHash, assetURL) => {
    // convert uint8array to hex string
    let metadataHash = Buffer.from(uint8ArrHash).toString("hex");

    // get IPFS cid of json metadata 
    const cid = convertByte32ToIpfsCidV0(metadataHash);

    // check if cid from assetURL is the same as cid extracted from metadata hash
    let cid_from_assetURL = assetURL.replace("ipfs://", "");
    cid_from_assetURL = cid_from_assetURL.replace("#arc3", "");

    return cid_from_assetURL === cid;
}

export default {
    purchaseNFT,
    checkMetadataHash,
    getAccountInfo,
};