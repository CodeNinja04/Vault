// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";

import  {Vault} from "./ERC4626.sol";
import {ERC20Lib} from "./utils/ERC20Lib.sol";


import "./utils/IERC4626.sol";
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract factory is  ReentrancyGuard{
   using SafeERC20 for ERC20Lib;
    using SafeERC20 for ERC20;
    using Clones for address;
    using Counters for Counters.Counter;
    using Address for address;
    Counters.Counter private pid;

    address public vaultImplementation;
    constructor(address _vaultImplementation) {
        vaultImplementation = _vaultImplementation;
    }

    mapping(uint256 => address) public getVault;

    address[] public allVaults;


    event Deposit(
        address indexed caller,
        uint256 indexed _pid,
        uint256 assets
      
    );

    function createVault(
        ERC20 _asset,
        string memory name,
        string memory symbol
    ) public returns (address clone) {
        bytes32 salt = keccak256(
            abi.encodePacked(_asset, name, symbol, msg.sender)
        );

        clone = Clones.cloneDeterministic(vaultImplementation, salt);

        IERC4626(clone).init(msg.sender, name, symbol, 10000e18);
        IERC4626(clone).initialize(_asset);

        getVault[pid.current()] = clone;
        pid.increment();
        allVaults.push(clone);

        return clone;
    }


function depositVault(uint256 _amount,address receiver, uint256 _pid) public  payable {

    require(_amount>0 ,"amount is less than 0" );

    ERC20(IERC4626(getVault[_pid]).asset()).approve(receiver,_amount);
    ERC20(IERC4626(getVault[_pid]).asset()).approve(address(this),_amount);
    
    console.log("asset",IERC4626(getVault[_pid]).asset());
    console.log("Symbol",IERC4626(getVault[_pid]).symbol());

    console.log(_amount);


   console.log(IERC4626((address(getVault[_pid]))).deposit(_amount,receiver));

 
    emit Deposit(msg.sender,_pid,_amount);


}
    // deposit(amount,pid) {  getVault(pid).deposit(amount)  }
    //
    //

     receive() external payable {}
}
