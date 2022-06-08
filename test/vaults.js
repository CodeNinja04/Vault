const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (value) => ethers.utils.parseEther(value.toString());

describe("Vault", function () {

    let account1;
    let account2;
  it("Should return the new greeting once it's changed", async function () {
    [account1, account2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy(toWei(1000000));
    await token.deployed();

    console.log("token address", token.address);

    const Vault = await ethers.getContractFactory("Vault");
    const vault = await Vault.deploy(token.address, "VAULT_TOKEN", "VLTKN");
    await vault.deployed();

    console.log("vault address", vault.address);

    const amount1 = ethers.utils.parseEther("8");
    const amount2 = ethers.utils.parseEther("4");
    await token.approve(account1.address, amount1);
    await token.approve(vault.address, amount1);
    await vault.deposit(amount2, account1.address);

    console.log(await token.balanceOf(vault.address))



     const Proxy = await ethers.getContractFactory("factory");
     const proxy = await Proxy.deploy();
     await proxy.deployed();

     await proxy.createVault(token.address,"test","TSTKN")
    
    const addr = await proxy.allVaults(0);

    const tst=Vault.attach(addr);
    // console.log(await tst.DOMAIN_SEPARATOR());

    // console.log(await token.balanceOf(addr));


    // await token.approve(addr, amount1);
    // await tst.deposit(amount2, account1.address);

    //  console.log(await token.balanceOf(addr));

  });
});
