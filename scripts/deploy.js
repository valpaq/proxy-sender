/*
async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Token = await ethers.getContractFactory("Usdt");
    const token = await Token.deploy();
  
    console.log("Token address:", token.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
*/

const { ethers } = require( 'hardhat');
const hardhat = require( 'hardhat');

function sleep(milliseconds) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, milliseconds);
    });
  }

async function main() {
    ProxySender = await ethers.getContractFactory("ProxySender");
    console.log("Deploying...");
    // usdt = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // mainnet
    usdt = "0x7fFe4863D05A66F8D478185C3dEa9EF974D12C57"; // rinkeby
    contract = await ProxySender.deploy(usdt);
    // now we have to wait until the contract is deployed or the verification script will not work
    await contract.deployed();
    console.log("Deployed to:", contract.address);
    await sleep(300000)
    await hardhat.run("verify:verify", {
        address: contract.address,
        constructorArguments: [
          usdt
        ],
        contract: "contracts/ProxySender.sol:ProxySender"
    });
    console.log('VERIFICATION COMPLETE');
}
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
