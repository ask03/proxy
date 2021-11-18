pragma solidity ^0.8.0;

import "./StorageSlot.sol";
import "./Proxy.sol";

contract LogicV2 is Proxy{
  bool initialized;
  uint256 magicNumber;
  uint256 lightNumber;

  function initialize() public {
    require(!initialized, "already initialized");

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

  function setDarkNumber(uint256 newDarkNumber) public {
    StorageSlot.setDarkNumber(_DARK_NUMBER, newDarkNumber);
  }

  function getDarkNumber() public view returns (uint256) {
    return StorageSlot.getDarkNumber(_DARK_NUMBER);
  }

  function setLightNumber(uint256 newLightNumber) public {
    lightNumber = newLightNumber;
  }

  function getLightNumber() public view returns (uint256) {
    return lightNumber;
  }

}
