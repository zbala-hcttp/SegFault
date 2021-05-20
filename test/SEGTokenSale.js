var SegToken = artifacts.require('./SEGToken.sol');
var SegTokenSale = artifacts.require('./SEGTokenSale.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('SEGTokenSale', function(accounts) {
  let segToken, tokenInstance, tokenSaleInstance;
  let admin = accounts[0];
  let buyer = accounts[1];
  let tokenPrice = 1000000000000000; // in wei
  let tokensAvailable = 750000;
  let numberOfTokens;
  
  before(async () => {
    tokenInstance = await SegToken.new(1000000);
  })
  
  before(async () => {
    tokenSaleInstance = await SegTokenSale.new(await tokenInstance.address, 1000000000000000);
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await tokenSaleInstance.address;
      assert.notEqual(address, 0x0, 'has contract address');
      
	  const c_address = await tokenSaleInstance.tokenContract();
	  assert.notEqual(address, 0x0, 'has token contract address');
	  
	  const price = await tokenSaleInstance.tokenPrice();
	  assert.equal(price, tokenPrice, 'token price is correct');
    })
  })
  
  describe('methods', async () => {
    it('facilitates token buying', async () => {
	  const sale_address = await tokenSaleInstance.address;
      await tokenInstance.transfer(sale_address, tokensAvailable, { from: admin });
      numberOfTokens = 10;
	  
	  const receipt = await tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice });
	  assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
      assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
      assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
	  
	  const amount = await tokenSaleInstance.tokensSold();
	  assert.equal(amount, numberOfTokens, 'increments the number of tokens sold');
	  
	  const balance = await tokenInstance.balanceOf(buyer);
	  assert.equal(balance, numberOfTokens);
	  
	  const balance_ = await tokenInstance.balanceOf(sale_address);
	  assert.equal(balance_, tokensAvailable - numberOfTokens);
	  
	  await tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 }).should.be.rejected;
	  await tokenSaleInstance.buyTokens(800000, { from: buyer, value: numberOfTokens * tokenPrice }).should.be.rejected;
    })
	
	it('ends token sale', async () => {
	  await tokenSaleInstance.endSale.call({ from: buyer }).should.be.rejected;
	  
	  await tokenSaleInstance.endSale({ from: admin });
	  
	  const balance = await tokenInstance.balanceOf(admin);
	  assert.equal(balance, 999990, 'returns all unsold dapp tokens to admin');
	  
	  //const balance_ = await web3.eth.getBalance(await tokenSaleInstance.address);
	  //assert.equal(balance_, 0);
    })
  })
 });