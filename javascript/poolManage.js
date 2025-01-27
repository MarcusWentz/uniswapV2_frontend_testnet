//Metamask sending trasactions:
//https://docs.metamask.io/guide/sending-transactions.html#transaction-parameters

detectMetamaskInstalled() //When the page is opened check for error handling issues.

let accounts = []; ////Empty array to be filled once Metamask is called.
document.getElementById("enableEthereumButton").innerHTML =  "Connect Metamask 🦊"
document.getElementById("getPoolBalanceWETH").innerHTML =  "Loading..."
document.getElementById("getPoolBalanceLINK").innerHTML =  "Loading..."

const baseSepoliaChainId = 84532;

const provider = new ethers.providers.Web3Provider(window.ethereum); //Imported ethers from index.html with "<script src="https://cdn.ethers.io/lib/ethers-5.6.umd.min.js" type="text/javascript"></script>".

// const signer = provider.getSigner(); //Do this when the user clicks "enableEthereumButton" which will call getAccount() to get the signer private key for the provider.  
 
const contractAddress_JS = '0x794c842Ef3EE218464068F0FFC4Bc084453CDeDD'
const contractABI_JS = [{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"}]

const contractDefined_JS = new ethers.Contract(contractAddress_JS, contractABI_JS, provider);

const wethAddress = '0x4200000000000000000000000000000000000006'
const linkAddress = '0xE4aB69C077896252FAFBD49EFD26B5D171A32410'
const ierc20Abi = [{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

const wethContractInstance = new ethers.Contract(wethAddress, ierc20Abi, provider);
const linkContractInstance = new ethers.Contract(linkAddress, ierc20Abi, provider);

const poolPairAddressLinkWeth = "0xC9ae620655690E6334C412a74ecf30DF85FD8458";

getDataOnChainToLoad()

async function getDataOnChainToLoad(){
  let chainIdConnected = await getChainIdConnected();

  if(chainIdConnected == baseSepoliaChainId){
    getStoredData()
  }
  if(chainIdConnected != baseSepoliaChainId){
    document.getElementById("getPoolBalanceWETH").innerHTML =  "Install Metamask and select Base Sepolia Testnet to have a Web3 provider to read blockchain data."
    document.getElementById("getPoolBalanceLINK").innerHTML =  "Install Metamask and select Base Sepolia Testnet to have a Web3 provider to read blockchain data."
  }

}

async function getStoredData() {
  let getPoolBalanceWethValue = await wethContractInstance.balanceOf(poolPairAddressLinkWeth)
  if(getPoolBalanceWethValue === undefined){
    document.getElementById("getPoolBalanceWETH").innerHTML =  "Install Metamask and select Sepolia Testnet to have a Web3 provider to read blockchain data."
  }
  else{
    document.getElementById("getPoolBalanceWETH").innerHTML =  getPoolBalanceWethValue + " WETH"
  }
  let getPoolBalanceLinkValue = await await linkContractInstance.balanceOf(poolPairAddressLinkWeth)
  if(getPoolBalanceLinkValue === undefined){
    document.getElementById("getPoolBalanceLINK").innerHTML =  "Install Metamask and select Sepolia Testnet to have a Web3 provider to read blockchain data."
  }
  else{
    document.getElementById("getPoolBalanceLINK").innerHTML =  getPoolBalanceLinkValue + " LINK"
  }
}

async function addLiquidityTxAsync() {

  let tokenERC20Address = "0xE4aB69C077896252FAFBD49EFD26B5D171A32410";
  const deadline = BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935");

  const callDataObject = await contractDefined_JS.populateTransaction.addLiquidityETH(
		tokenERC20Address,
    ethers.utils.hexlify(BigInt("2000")),
    ethers.utils.hexlify(BigInt("1000")),
    ethers.utils.hexlify(BigInt("1000")),
		accounts[0],
    ethers.utils.hexlify(deadline), 
	);
  const txData = callDataObject.data;

  ethereum
  .request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: accounts[0],
        to: contractAddress_JS,
        data: txData,
        value: ethers.utils.hexlify(BigInt("2000")),
      },
    ],
  })
  .then((txHash) => console.log(txHash))
  .catch((error) => console.error);  
    
}

async function removeLiquidityTxAsync() {

  let tokenERC20Address = "0xE4aB69C077896252FAFBD49EFD26B5D171A32410";
  const deadline = BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935");

  const callDataObject = await contractDefined_JS.populateTransaction.removeLiquidityETH(
		tokenERC20Address,
    ethers.utils.hexlify(BigInt("1000")),
    ethers.utils.hexlify(BigInt("500")),
    ethers.utils.hexlify(BigInt("500")),
		accounts[0],
    ethers.utils.hexlify(deadline), 
  ); 
  const txData = callDataObject.data;

  ethereum
  .request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: accounts[0],
        to: contractAddress_JS,
        data: txData
      },
    ],
  })
  .then((txHash) => console.log(txHash))
  .catch((error) => console.error);  
    
}

// contractDefined_JS.on("setEvent", () => {

//   getStoredData()

// });

//Connect to Metamask.
const ethereumButton = document.querySelector('#enableEthereumButton');
ethereumButton.addEventListener('click', () => {
    detectMetamaskInstalled()
    enableMetamaskOnSepolia()
});

// MODIFY CONTRACT STATE WITH SET FUNCTION WITH PREDEFINED DATA FROM WEB3.JS
const addLiquidityContractEvent = document.querySelector('.addLiquidityContractEvent');
addLiquidityContractEvent.addEventListener('click', () => {
  checkAddressMissingMetamask()
  
  addLiquidityTxAsync()

})

// MODIFY CONTRACT STATE WITH SET FUNCTION WITH PREDEFINED DATA FROM WEB3.JS
const removeLiquidityContractEvent = document.querySelector('.removeLiquidityContractEvent');
removeLiquidityContractEvent.addEventListener('click', () => {
  checkAddressMissingMetamask()
  
  removeLiquidityTxAsync()

})


//If Metamask is not detected the user will be told to install Metamask.
function detectMetamaskInstalled(){
  try{
     ethereum.isMetaMask
  }
  catch(missingMetamask) {
     alert("Metamask not detected in browser! Install Metamask browser extension, then refresh page!")
     document.getElementById("getValueStateSmartContract").innerHTML =  "Install Metamask and select Sepolia Testnet to have a Web3 provider to read blockchain data."

  }

}

//Alert user to connect their Metamask address to the site before doing any transactions.
function checkAddressMissingMetamask() {
  if(accounts.length == 0) {
    alert("No address from Metamask found. Click the top button to connect your Metamask account then try again without refreshing the page.")
  }
}

async function getChainIdConnected() {

  const connectedNetworkObject = await provider.getNetwork();
  const chainIdConnected = connectedNetworkObject.chainId;
  return chainIdConnected

}

async function getAccount() {
  accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const signer = provider.getSigner();
  document.getElementById("enableEthereumButton").innerText = accounts[0].substr(0,5) + "..." +  accounts[0].substr(38,4)  
}

async function enableMetamaskOnSepolia() {
  //Get account details from Metamask wallet.
  getAccount();

  // Updated chainId request method suggested by Metamask.
  let chainIdConnected = await window.ethereum.request({method: 'net_version'});

  // // Outdated chainId request method which might get deprecated:
  // //  https://github.com/MetaMask/metamask-improvement-proposals/discussions/23
  // let chainIdConnected = window.ethereum.networkVersion;

  console.log("chainIdConnected: " + chainIdConnected)

  //Check if user is on the Sepolia testnet. If not, alert them to change to Sepolia.
  if(chainIdConnected != baseSepoliaChainId){
    // alert("You are not on the Sepolia Testnet! Please switch to Sepolia and refresh page.")
    try{
      await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{
             chainId: "0x" + baseSepoliaChainId.toString(16) //Convert decimal to hex string.
          }]
        })
      location.reload(); 
      // alert("Failed to add the network at chainId " + baseSepoliaChainId + " with wallet_addEthereumChain request. Add the network with https://chainlist.org/ or do it manually. Error log: " + error.message)
    } catch (error) {
      alert("Failed to add the network at chainId " + baseSepoliaChainId + " with wallet_addEthereumChain request. Add the network with https://chainlist.org/ or do it manually. Error log: " + error.message)
    }
  }
}