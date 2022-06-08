
// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";

import "./ERC4626.sol";

import "./utils/IERC4626.sol";
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//import {ERC20} from "./utils/ERC20.sol";

contract factory {

address public vaultImplementation;

constructor(address _vaultImplementation){

    vaultImplementation = _vaultImplementation;

}


using Clones for address;
uint256 n=0;

mapping(uint256 => address) public getVault;

address[] public  allVaults;

 function createClone(address target) internal returns (address result) {
    bytes20 targetBytes = bytes20(target);
    assembly {
      let clone := mload(0x40)
      mstore(clone, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
      mstore(add(clone, 0x14), targetBytes)
      mstore(add(clone, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
      result := create(0, clone, 0x37)
    }
  }

  /// @notice Tests if MinimalProxy instance really points to the correct implementation
  /// @param target is an address of implementation, to which the MinimalProxy should point to
  /// @param query is an address of MinimalProxy that needs to be tested
  /// @return result is true if MinimalProxy really points to the implementation address
  function isClone(address target, address query) external view returns (bool result) {
    bytes20 targetBytes = bytes20(target);
    assembly {
      let clone := mload(0x40)
      mstore(clone, 0x363d3d373d3d3d363d7300000000000000000000000000000000000000000000)
      mstore(add(clone, 0xa), targetBytes)
      mstore(add(clone, 0x1e), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)

      let other := add(clone, 0x40)
      extcodecopy(query, other, 0, 0x2d)
      result := and(
        eq(mload(clone), mload(other)),
        eq(mload(add(clone, 0xd)), mload(add(other, 0xd)))
      )
    }
  }


function createVault( ERC20 _asset,string memory name,string memory symbol) public returns(address clone) {

    bytes32 salt = keccak256(abi.encodePacked(_asset,name,symbol,msg.sender));
    
    clone = Clones.cloneDeterministic(vaultImplementation, salt);
    console.log("contract clone",clone);

    //clone = createClone(vault);
    IERC4626(clone).init(msg.sender,name,symbol,10000e18);
    IERC4626(clone).initialize(_asset);
    console.log("contract clone",clone);
    
    
    //address clone = Clones.clone(vaultImplementation);
     //Vault(vault).initialize(name, symbol);
    //console.log("vault address",clone);
    
    getVault[n]=clone;
    n++;
    allVaults.push(clone);

    return clone;

    

}

}

