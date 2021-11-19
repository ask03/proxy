pragma solidity ^0.8.0;

import "./Storage.sol";
import "./Proxy.sol";

contract LogicV2 is Storage{

  bool public initialized;
  uint256 public magicNumber;
  uint256 public lightNumber;

  function initialize() public {
    require(!initialized, "implementation is already initialized");

    magicNumber = 0x42;
    initialized = true;
  }

  function setMagicNumber(uint256 newMagicNumber) public {
    magicNumber = newMagicNumber;
  }

  function getMagicNumber() public view returns (uint256) {
    return magicNumber;
  }

  function doMagic() public {
    magicNumber = magicNumber / 2;
  }

  function setLightNumber(uint256 newLightNumber) public {
    lightNumber = newLightNumber;
  }

  function getLightNumber() public view returns (uint256) {
    return lightNumber;
  }

  function updateSupply(uint256 _supply) public {
    totalSupply = _supply;
  }

  function getTotalSupply() public view returns (uint256) {
    return totalSupply;
  }

  function updateBalances(address _user, uint256 _balance) public {
    balances[_user] += _balance;
  }

  function getBalances(address _user) public view returns (uint256) {
    return balances[_user];
  }

}
