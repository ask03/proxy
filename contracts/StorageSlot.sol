pragma solidity ^0.8.0;

library StorageSlot {

  function getAddressAt(bytes32 slot) internal view returns (address a) {
    assembly {
      a := sload(slot)
    }
  }

  function setAddressAt(bytes32 slot, address address_) internal {
    assembly {
      sstore(slot, address_)
    }
  }

  function setDarkNumber(bytes32 slot, uint256 number_) internal {
    assembly {
      sstore(slot, number_)
    }
  }

  function getDarkNumber(bytes32 slot) internal view returns (uint256 a) {
    assembly {
      a := sload(slot)
    }
  }
}
