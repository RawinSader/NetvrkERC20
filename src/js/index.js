document.addEventListener('DOMContentLoaded', () => {
  return driver();
});

async function driver() {

  const provider = await getWeb3Provider();
  const web3 = new Web3(provider);

  web3.eth.getAccounts(console.log)
  //web3.currentProvider.selectedAddress to get selected metamask address

  $.getJSON('NetvrkICO.json', async (NetvrkICO) => {
    const ico = TruffleContract(NetvrkICO);
    ico.setProvider(provider);
    window.icoInstance = await ico.deployed();

    console.log(`ICO address is ${icoInstance.address}`);
    window.tokenPrice = (await icoInstance.tokenPrice()).toNumber();

  }).done(() => {
    $.getJSON('Netvrk.json', async (Netvrk) => {
      const ico = TruffleContract(Netvrk);
      ico.setProvider(provider);

      window.tokenInstance = await ico.deployed();
      console.log(`Netvrk address is ${tokenInstance.address}`);

      const icoBalance = await tokenInstance.balanceOf(icoInstance.address)
      console.log(`Ico balance is ${icoBalance.toNumber()}`)

    });
  });

  document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault();
    const amount = document.getElementById('amount').value;
    console.log('Selected account: ', web3.currentProvider.selectedAddress);
    console.log('Amount: ', amount);
    console.log('token price: ', window.tokenPrice);
    window.icoInstance.buy(amount, {
      from: web3.currentProvider.selectedAddress,
      value: amount * window.tokenPrice,
      gas: 500000,
    }).then(console.log)
      .catch(console.log);
  });
}

async function getWeb3Provider() {
  if (typeof web3 !== 'undefined') {
    // metamask
    await window.ethereum.enable();
    console.log('Connecting to metamask');
    return window.ethereum;
    // return web3.currentProvider;
  }
  // ganache
  console.log('Connecting to ganache');
  return new Web3.providers.HttpProvider('http://127.0.0.1:8545');
}
