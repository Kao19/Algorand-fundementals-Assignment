async function run(runtimeEnv, deployer) {
    //write your code here
     await deployer.deployASA('acsCoinASA', {
        creator: deployer.accounts[0],
        totalFee: 1000,
        validRounds: 1002
    }); 
    
}

module.exports = { default: run };
