const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const provider = waffle.provider;

const toWei = (value) => ethers.utils.parseEther(value.toString());

describe("Vault", function () {
  let account1;
  let account2;
  it("Should return the new greeting once it's changed", async function () {
    [account1, account2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy("token0","TKN0",toWei(1000000));
    await token.deployed();

    const token1 = await Token.deploy("token1", "TKN1", toWei(1000000));
    await token1.deployed();


    console.log("token address", token.address);
    console.log("token address", token1.address);

    const Vault = await ethers.getContractFactory("Vault");

    const vault = await Vault.deploy();
    await vault.deployed();

    console.log(vault.address);

    const Proxy = await ethers.getContractFactory("factory");
    const proxy = await Proxy.deploy(vault.address);
    await proxy.deployed();

    console.log("fatory address", proxy.address);

    console.log(await proxy.vaultImplementation());

    const tx = await proxy.createVault(token.address, "test", "TSTKN");
    await tx.wait();

    const tx1 = await proxy.createVault(token1.address, "test1", "TSTKN1");
    await tx1.wait();


    console.log("vault1 :",await proxy.allVaults(0));
    console.log("vault2 :", await proxy.allVaults(1));

    const amount1 = ethers.utils.parseEther("100");
    const amount2 = ethers.utils.parseEther("4");
    const amount3 = ethers.utils.parseEther("5");

    const addr = await proxy.allVaults(0);
    const addr1 = await proxy.allVaults(1);
    console.log("vault0 addr", addr);
    console.log("vault1 addr", addr1);
    // console.log(await provider.getCode(addr));

    const ERC20Lib = await ethers.getContractFactory("Vault");
    const tst = ERC20Lib.attach(addr);
    const tst1 = ERC20Lib.attach(addr1);

    //console.log(tst);

    //console.log("symbol", await tst.name());

    console.log("vault0 initial : ",await token.balanceOf(addr));

    await token.approve(account1.address, amount1);
    await token.approve(addr, amount1);
    
    await token.approve(proxy.address, amount1);
    await token1.approve(proxy.address, amount1);
    await tst.deposit(amount2, account1.address);

    console.log("vault0 final : ",await token.balanceOf(addr));


    console.log("vault1 initial : ", await token1.balanceOf(addr1));

     //await token1.approve(account1.address, amount1);
     await token1.approve(addr1, amount1);
     await tst1.deposit(amount2, account1.address);

    console.log("vault1 final : ", await token1.balanceOf(addr1));


    await tst1.withdraw(amount2, account1.address,account1.address);

    console.log("vault1 final after withdraw: ", await token1.balanceOf(addr1));


    console.log("balance + share of account1 in vault0",await tst.balanceOf(account1.address));

    await tst1.approve(proxy.address, amount1);
    await token1.approve(proxy.address, amount1);
   await token1.approve(tst1.address,amount1);

    console.log(await token1.allowance(account1.address,tst1.address))

    console.log(await tst1.symbol())

    const tx3 =await proxy.depositVault(amount2,account1.address,1);
    await tx3.wait()

    console.log("vault1 final : ", await token1.balanceOf(addr1));

    //console.log(proxy)


  });
});
