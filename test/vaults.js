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
    const token = await Token.deploy(toWei(1000000));
    await token.deployed();

    

    console.log("token address", token.address);

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

    const amount1 = ethers.utils.parseEther("8");
    const amount2 = ethers.utils.parseEther("4");

    const addr = await proxy.allVaults(0);
    console.log("vault addr", addr);

    // console.log(await provider.getCode(addr));

    const ERC20Lib = await ethers.getContractFactory("Vault");
    const tst = ERC20Lib.attach(addr);

    console.log(tst);

    console.log("symbol", await tst.name());

    console.log(await token.balanceOf(addr));

    await token.approve(account1.address, amount1);
    await token.approve(addr, amount1);
    await tst.deposit(amount2, account1.address);

    console.log(await token.balanceOf(addr));
  });
});
