const { expect } = require("chai");
const chai = require("chai");
const chaiAlmost = require("chai-almost");
chai.use(chaiAlmost(0.1));
function ether(eth) {
  let weiAmount = ethers.utils.parseEther(eth)
  return weiAmount.toString();
}

function comparableEth(eth) {
  let newEth = ethers.utils.formatEther(eth);
  return parseFloat(newEth);
}

describe("ProxySender", function () {

  let Token;
  let ProxySender;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;
  let addr4;
  let sender;
  let mockToken;


  beforeEach(async function () {
    MockERC20 = await ethers.getContractFactory("mockToken");
    mockToken = await MockERC20.deploy();
    Usdt = await ethers.getContractFactory("Usdt");
    usdt = await Usdt.deploy();
    ProxySender = await ethers.getContractFactory("ProxySender");
    [owner, addr1, addr2, addr3, addr4, sender, ...addrs] = await ethers.getSigners();
    proxySender = await ProxySender.deploy(usdt.address);

  });


  describe("Initial check", function () {

    it("Initial balance 100", async function () {
      console.log(usdt.address);
      console.log(typeof(usdt.address));
      balance1 = await addr1.getBalance();
      balance2 = await addr2.getBalance();
      balance3 = await addr3.getBalance();     
      expect(balance1).to.be.equal(ether("10000"));
      expect(balance2).to.be.equal(ether("10000"));
      expect(balance3).to.be.equal(ether("10000"));
      balance4 = await owner.getBalance();  
      expect(comparableEth(balance4)).to.be.almost.equal(10000);

      expect(await mockToken.balanceOf(owner.address)).to.be.equal(100);
      
      expect(await usdt.balanceOf(owner.address)).to.be.equal(100);
        
    });
  });

  describe("resendAny", function() {
      
    it("mockToken", async function () {
      await mockToken.connect(owner).approve(proxySender.address, 20);
      expect( await mockToken.allowance(owner.address, proxySender.address)).to.be.equal(20);
      await proxySender.connect(owner).resendAny(mockToken.address, 20, addr1.address);
      expect( await mockToken.balanceOf(addr1.address)).to.be.equal(20);
      expect( await mockToken.allowance(owner.address, proxySender.address)).to.be.equal(0);
      
      await mockToken.connect(owner).approve(proxySender.address, 30);
      expect( await mockToken.allowance(owner.address, proxySender.address)).to.be.equal(30);
      await proxySender.connect(owner).resendAny(mockToken.address, 30, addr1.address);
      expect( await mockToken.balanceOf(addr1.address)).to.be.equal(50);
      expect( await mockToken.allowance(owner.address, proxySender.address)).to.be.equal(0);
      
      await mockToken.connect(owner).approve(proxySender.address, 50);
      expect( await mockToken.allowance(owner.address, proxySender.address)).to.be.equal(50);
      await proxySender.connect(owner).resendAny(mockToken.address, 50, addr2.address);
      expect( await mockToken.balanceOf(addr2.address)).to.be.equal(50);
      expect( await mockToken.allowance(owner.address, proxySender.address)).to.be.equal(0);
    });
      
    it("usdt", async function () {
      await usdt.connect(owner).approve(proxySender.address, 20);
      expect( await usdt.allowance(owner.address, proxySender.address)).to.be.equal(20);
      await proxySender.connect(owner).resendAny(usdt.address, 20, addr1.address);
      expect( await usdt.balanceOf(addr1.address)).to.be.equal(20);
      expect( await usdt.allowance(owner.address, proxySender.address)).to.be.equal(0);
      
      await usdt.connect(owner).approve(proxySender.address, 30);
      expect( await usdt.allowance(owner.address, proxySender.address)).to.be.equal(30);
      await proxySender.connect(owner).resendAny(usdt.address, 30, addr1.address);
      expect( await usdt.balanceOf(addr1.address)).to.be.equal(50);
      expect( await usdt.allowance(owner.address, proxySender.address)).to.be.equal(0);
      
      await usdt.connect(owner).approve(proxySender.address, 50);
      expect( await usdt.allowance(owner.address, proxySender.address)).to.be.equal(50);
      await proxySender.connect(owner).resendAny(usdt.address, 50, addr2.address);
      expect( await usdt.balanceOf(addr2.address)).to.be.equal(50);
      expect( await usdt.allowance(owner.address, proxySender.address)).to.be.equal(0);
    });
  });
  describe("resendUSDT", function() {
    
    it("usdt", async function () {
      await usdt.connect(owner).approve(proxySender.address, 20);
      expect( await usdt.allowance(owner.address, proxySender.address)).to.be.equal(20);
      await proxySender.connect(owner).resendUSDT(20, addr1.address);
      expect( await usdt.balanceOf(addr1.address)).to.be.equal(20);
      expect( await usdt.allowance(owner.address, proxySender.address)).to.be.equal(0);
      
      await usdt.connect(owner).approve(proxySender.address, 30);
      expect( await usdt.allowance(owner.address, proxySender.address)).to.be.equal(30);
      await proxySender.connect(owner).resendUSDT(30, addr1.address);
      expect( await usdt.balanceOf(addr1.address)).to.be.equal(50);
      expect( await usdt.allowance(owner.address, proxySender.address)).to.be.equal(0);
      
      await usdt.connect(owner).approve(proxySender.address, 50);
      expect( await usdt.allowance(owner.address, proxySender.address)).to.be.equal(50);
      await proxySender.connect(owner).resendUSDT(50, addr2.address);
      expect( await usdt.balanceOf(addr2.address)).to.be.equal(50);
      expect( await usdt.allowance(owner.address, proxySender.address)).to.be.equal(0);
    });
  });

  describe("resendETH", function() {
    it("different pays", async function() {
      balance1 = await addr1.getBalance();
      balance2 = await addr2.getBalance();
      balance3 = await addr3.getBalance();     
      expect(balance1).to.be.equal(ether("10000"));
      expect(balance2).to.be.equal(ether("10000"));
      expect(balance3).to.be.equal(ether("10000"));

      await proxySender.connect(addr1).resendETH(addr2.address, {
        value: ethers.utils.parseEther("1.0")
      });
      balance1 = await addr1.getBalance();
      balance2 = await addr2.getBalance();
      expect(comparableEth(balance1)).to.be.almost.equal(9999);
      expect(comparableEth(balance2)).to.be.almost.equal(10001);

      await proxySender.connect(addr1).resendETH(addr2.address, {
        value: ethers.utils.parseEther("1.0")
      });
      balance1 = await addr1.getBalance();
      balance2 = await addr2.getBalance();
      expect(comparableEth(balance1)).to.be.almost.equal(9998);
      expect(comparableEth(balance2)).to.be.almost.equal(10002);

      await proxySender.connect(addr2).resendETH(addr3.address, {
        value: ethers.utils.parseEther("2.0")
      });
      balance1 = await addr2.getBalance();
      balance2 = await addr3.getBalance();
      expect(comparableEth(balance1)).to.be.almost.equal(10000);
      expect(comparableEth(balance2)).to.be.almost.equal(10002);

      
      await proxySender.connect(addr3).resendETH(addr1.address, {
        value: ethers.utils.parseEther("2.0")
      });
      balance1 = await addr3.getBalance();
      balance2 = await addr1.getBalance();
      expect(comparableEth(balance1)).to.be.almost.equal(10000);
      expect(comparableEth(balance2)).to.be.almost.equal(10000);
      


    });
  });

});