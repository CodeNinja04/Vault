// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";

import "./ERC4626.sol";

import "./utils/IERC4626.sol";
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

contract factory is ReentrancyGuard {

   using Clones for address;
   using Counters for Counters.Counter;
   Counters.Counter private _pid;

  
  address public vaultImplementation;

    constructor(address _vaultImplementation) {
        vaultImplementation = _vaultImplementation;
    }

   mapping(uint256 => address) public getVault;

    address[] public allVaults;

    function createVault(
        ERC20 _asset,
        string memory name,
        string memory symbol
    ) public returns (address clone) {
        bytes32 salt = keccak256(
            abi.encodePacked(_asset, name, symbol, msg.sender)
        );

        clone = Clones.cloneDeterministic(vaultImplementation, salt);
        console.log("contract clone", clone);

        IERC4626(clone).init(msg.sender, name, symbol, 10000e18);
        IERC4626(clone).initialize(_asset);
        console.log("contract clone", clone);

        getVault[_pid.current()] = clone;
        _pid.increment();
        allVaults.push(clone);

        return clone;
    }

    // deposit(amount,pid) {  getVault(pid).deposit(amount)  }
    //
    //
}
