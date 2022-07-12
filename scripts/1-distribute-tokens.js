const { executeTransaction } = require("@algo-builder/algob");
const { types } = require("@algo-builder/web");

async function run(runtimeEnv, deployer) {
    //write your code here

    const master = deployer.accountsByName.get("master");
    const buyer = deployer.accountsByName.get("buyer");

    // buyer opts into the asset
    await executeTransaction(deployer, {
        type: types.TransactionType.OptInASA,
        sign: types.SignType.SecretKey,
        fromAccount: buyer,
        assetID: 157, //the id generated after executing the 0-deploy-tokens.js , you might need to change it if the id generated for you is diffrent from this one
        payFlags: { totalFee: 1000 },
    });


    // master send 100 asset to the buyer
    await executeTransaction(deployer,{
        type: types.TransactionType.TransferAsset,
        sign: types.SignType.SecretKey,
        fromAccount: master,
        toAccountAddr: buyer.addr,
        amount: 100,
        assetID: 157, //the id generated after executing the 0-deploy-tokens.js , you might need to change it if the id generated for you is diffrent from this one
        payFlags: { totalFee: 1000 }
    });

    const receiverAcc = await deployer.algodClient.accountInformation(buyer.addr).do();
    console.log(receiverAcc.assets);
}

module.exports = { default: run };
