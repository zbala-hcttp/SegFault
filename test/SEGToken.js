var SegToken = artifacts.require("./SEGToken.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('SEGToken', (accounts) => {
  let segToken;
  
  before(async () => {
    segToken = await SegToken.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await segToken.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has the correct name', async () => {
      const name = await segToken.name()
      assert.equal(name, 'Seg Token')
    })

    it('has the correct symbol', async () => {
      const symbol = await segToken.symbol()
      assert.equal(symbol, 'SEG')
    })

    it('has the correct standard', async () => {
      const standard = await segToken.standard()
      assert.equal(standard, 'Seg Token v1.0')
    })
  })
  
  describe('methods', async () => {

    before(async () => {
      await segToken.SegToken(1000000)
    })
	
    it('allocates the initial supply upon deployment', async () => {
	  const totalSupply = await segToken.totalSupply()
	  assert.equal(totalSupply, 1000000, 'sets the total supply to 1,000,000');
    })
	
    it('it allocates the initial supply to the admin account', async () => {
	  const totalSupply = await segToken.balanceOf(accounts[0])
      assert.equal(totalSupply, 1000000, 'it allocates the initial supply to the admin account');
    })
	
	it('transfers token ownership', async () => {
	  await segToken.transfer.call(accounts[1], 10000000).should.be.rejected;
	  
	  const receipt = await segToken.transfer(accounts[1], 250000, { from: accounts[0] });
	  assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
      assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
      assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
      assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
	  
	  const balance1 = await segToken.balanceOf(accounts[1]);
	  assert.equal(balance1, 250000, 'adds the amount to the receiving account');
	  
	  const balance0 = await segToken.balanceOf(accounts[0]);
	  assert.equal(balance0, 750000, 'deducts the amount from the sending account');
    })
	
	it('approves tokens for delegated transfer', async () => {
	  const success = await segToken.approve.call(accounts[1], 100);
	  assert.equal(success, true, 'it returns true');
	  
	  const receipt = await segToken.approve(accounts[1], 100, { from: accounts[0] });
	  assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
      assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
      assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
      assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
	  
	  const allowance = await segToken.allowance(accounts[0], accounts[1]);
	  assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated trasnfer');
    })
	
	it('handles delegated token transfers', async () => {
      const fromAccount = accounts[2];
      const toAccount = accounts[3];
      const spendingAccount = accounts[4];
	  
	  await segToken.transfer(fromAccount, 100, { from: accounts[0] });
	  await segToken.approve(spendingAccount, 10, { from: fromAccount });
	  
	  await segToken.transferFrom.call(fromAccount, toAccount, 9999, { from: spendingAccount }).should.be.rejected;
	  await segToken.transferFrom.call(fromAccount, toAccount, 20, { from: spendingAccount }).should.be.rejected;
	  
	  const success = await segToken.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
	  assert.equal(success, true);
	  
	  const receipt = await segToken.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
	  assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
      assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transferred from');
      assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transferred to');
      assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
	  
	  const balanceFA = await segToken.balanceOf(fromAccount);
	  assert.equal(balanceFA, 90, 'deducts the amount from the sending account');
	  
	  const balanceTA = await segToken.balanceOf(toAccount);
	  assert.equal(balanceTA, 10, 'adds the amount from the receiving account');
	  
	  const allowance = await segToken.allowance(fromAccount, spendingAccount);
	  assert.equal(allowance, 0, 'deducts the amount from the allowance');
    })
  })
});