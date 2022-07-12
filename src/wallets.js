/* eslint-disable */
import algosdk from "algosdk";

import { formatJsonRpcRequest } from "@json-rpc-tools/utils";

const sendAlgoSignerTransaction = async (txns, algodClient) => {
    const AlgoSigner = window.AlgoSigner;

    if (typeof AlgoSigner !== "undefined") {
        try {
            // Get the binary and base64 encode it
            let binaryTxs = [txns[0].toByte(), txns[1].toByte() , txns[2].toByte()]; //since we have 3 transactions in the asa purchaseNFT function
            let base64Txs = binaryTxs.map((binary) => AlgoSigner.encoding.msgpackToBase64(binary));

            let signedTxs = await AlgoSigner.signTxn([
                {
                    txn: base64Txs[0],
                },
                {
                    txn: base64Txs[1],
                },
                {
                    txn: base64Txs[2],
                },
            ]);

            // Get the base64 encoded signed transaction and convert it to binary
            let binarySignedTxs = signedTxs.map((tx) => AlgoSigner.encoding.base64ToMsgpack(
                tx.blob
            ));

            const response = await algodClient
                .sendRawTransaction(binarySignedTxs)
                .do();
            console.log(response);

            return response;
        } catch (err) {
            console.error(err);
        }
    }
};

export default {
    sendAlgoSignerTransaction
};
