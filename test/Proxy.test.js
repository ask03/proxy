require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");

describe("Proxy", async () => {
  let owner;
  let proxy, logic;
  let proxied;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    const Logic = await ethers.getContractFactory("Logic");
    logic = await Logic.deploy();
    await logic.deployed();

    const Proxy = await ethers.getContractFactory("Proxy");
    proxy = await Proxy.deploy();
    await proxy.deployed();

    await proxy.setImplementation(logic.address);

    const abi = ["function initialize() public"];
    proxied = new ethers.Contract(proxy.address, abi, owner);

    await proxied.initialize();

  })

  it("points to an implementation contract", async () => {
    expect(await proxy.callStatic.getImplementation()).to.eq(logic.address);
  })

  it("proxies calls to implementation contract", async () => {
    abi = [
      "function setMagicNumber(uint256 newMagicNumber) public",
      "function getMagicNumber() public view returns (uint256)",
    ];

    proxied = new ethers.Contract(proxy.address, abi, owner);

    expect(await proxied.getMagicNumber()).to.eq("0x42");
  })

  it("allows to change implementations", async () => {
    const LogicV2 = await ethers.getContractFactory("LogicV2");
    logicv2 = await LogicV2.deploy();
    await logicv2.deployed();

    abi = [
      "function setMagicNumber(uint256 newMagicNumber) public",
      "function getMagicNumber() public view returns (uint256)",
    ];

    proxied = new ethers.Contract(proxy.address, abi, owner);
    await proxied.setMagicNumber(0x43);
    expect(await proxied.getMagicNumber()).to.eq("0x43")

    await proxy.setImplementation(logicv2.address);

    abi = [
      "function initialize() public",
      "function setMagicNumber(uint256 newMagicNumber) public",
      "function getMagicNumber() public view returns (uint256)",
      "function doMagic() public",
    ];

    proxied = new ethers.Contract(proxy.address, abi, owner);

    await proxied.setMagicNumber(0x33);
    expect(await proxied.getMagicNumber()).to.eq("0x33")

    await proxied.doMagic();
    expect(await proxied.getMagicNumber()).to.eq("0x19")
  })

  describe("Storage slots for new variables added to implementations", () => {
    beforeEach(async () => {
      const LogicV2 = await ethers.getContractFactory("LogicV2");
      logicv2 = await LogicV2.deploy();
      await logicv2.deployed();

      await proxy.setImplementation(logicv2.address);
    })

    it("uses storage from Proxy as inherited", async () => {
      abi = [
        "function initialize() public",
        "function setMagicNumber(uint256 newMagicNumber) public",
        "function getMagicNumber() public view returns (uint256)",
        "function doMagic() public",
        "function setDarkNumber(uint256 newDarkNumber) public",
        "function getDarkNumber() public view returns (uint256)"
      ];

      proxied = new ethers.Contract(proxy.address, abi, owner);

      await proxied.setDarkNumber("3");
      expect(await proxied.getDarkNumber()).to.eq("3");

    })

    it("can add new storage from implementation", async () => {
      abi = [
        "function initialize() public",
        "function setMagicNumber(uint256 newMagicNumber) public",
        "function getMagicNumber() public view returns (uint256)",
        "function doMagic() public",
        "function setDarkNumber(uint256 newDarkNumber) public",
        "function getDarkNumber() public view returns (uint256)",
        "function setLightNumber(uint256 newLightNumber) public",
        "function getLightNumber() public view returns (uint256)"
      ];

      proxied = new ethers.Contract(proxy.address, abi, owner);

      await proxied.setLightNumber("43");
      expect(await proxied.getLightNumber()).to.eq("43");
    })
  })

})
