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

    // const Proxy = await ethers.getContractFactory("factory");
    // const proxy = await Proxy.deploy();
    // await proxy.deployed();

    //console.log(proxy)

    //console.log("fatory address", proxy.address);
    
    
    const Vault = await ethers.getContractFactory("Vault");
    // const vault = await upgrades.deployProxy(Vault,[ 
    //   account1.address,
    //   "test1",
    //   "TSTKN1",
    //   toWei(1000000),
    // ]);

    const vault = await Vault.deploy();
    await vault.deployed();
    
    // const tx =await vault.init(account1.address,"test1","TSTKN1",toWei(1000000));
    // await tx.wait()
    
    
    console.log(vault.address)



    const Proxy = await ethers.getContractFactory("factory");
    const proxy = await Proxy.deploy(vault.address);
    await proxy.deployed();

      //console.log(proxy)

    console.log("fatory address", proxy.address);


    console.log(await proxy.vaultImplementation())
    
    const tx= await proxy.createVault(token.address,"test","TSTKN")
    await tx.wait()


    
    



    
    //await vault.init(account1.address, "test1", "TSTKN1", toWei(1000000));
    
    //console.log("symbol",await vault.symbol())
   // console.log("vault address", vault.address);

    const amount1 = ethers.utils.parseEther("8");
    const amount2 = ethers.utils.parseEther("4");
    // await token.approve(account1.address, amount1);
    // await token.approve(vault.address, amount1);
    // await vault.deposit(amount2, account1.address);

    // console.log(await token.balanceOf(vault.address))



     

    // const tx= await proxy.createVault(vault.address,token.address,"test","TSTKN")
    // await tx.wait()


    
    const addr = await proxy.allVaults(0);
    console.log("vault addr",addr);


    // console.log(await provider.getCode(addr));

    const ERC20Lib = await ethers.getContractFactory("Vault");
     const tst=ERC20Lib.attach(addr);

    console.log(tst)

    console.log("symbol",await tst.name())


    console.log(await token.balanceOf(addr));

    await token.approve(account1.address, amount1);
    await token.approve(addr, amount1);
    await tst.deposit(amount2, account1.address);

    console.log(await token.balanceOf(addr));

    
  
  });
});
