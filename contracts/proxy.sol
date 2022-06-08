
// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";

import "./ERC4626.sol";
import "hardhat/console.sol";

import {ERC20} from "./utils/ERC20.sol";

contract factory {

address public vaultImplementation;
using Clones for address;
uint256 n=0;

mapping(uint256 => address) public getVault;

address[] public  allVaults;


function createVault( ERC20 _asset,string memory name,string memory symbol) public returns(address clone) {

    bytes32 salt = keccak256(abi.encodePacked(_asset,name,symbol));

    clone = Clones.cloneDeterministic(vaultImplementation, salt);
    
    
    
    //address clone = Clones.clone(vaultImplementation);
     //Vault(vault).initialize(name, symbol);
    console.log("vault address",clone);
    
    getVault[n]=clone;
    n++;
    allVaults.push(clone);

    

}

}

