//Metamask sending trasactions:
//https://docs.metamask.io/guide/sending-transactions.html#transaction-parameters

detectMetamaskInstalled() //When the page is opened check for error handling issues.

let accounts = []; ////Empty array to be filled once Metamask is called.
document.getElementById("enableEthereumButton").innerHTML =  "Connect Metamask 🦊"
// document.getElementById("getValueStateSmartContract").innerHTML =  "Loading..."
document.getElementById("inputTokenName").value =  "ETH"
document.getElementById("outputTokenAmount").value =  "Click button 'Swap' for a quote"
document.getElementById("outputTokenName").value =  "LINK"


const baseSepoliaChainId = 84532;

const provider = new ethers.providers.Web3Provider(window.ethereum); //Imported ethers from index.html with "<script src="https://cdn.ethers.io/lib/ethers-5.6.umd.min.js" type="text/javascript"></script>".

// const signer = provider.getSigner(); //Do this when the user clicks "enableEthereumButton" which will call getAccount() to get the signer private key for the provider.  
 
const contractAddress_JS = '0x794c842Ef3EE218464068F0FFC4Bc084453CDeDD'
const contractABI_JS = 
[{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"}]
const contractDefined_JS = new ethers.Contract(contractAddress_JS, contractABI_JS, provider);

// LINK token address
const tokenERC20Address = "0xE4aB69C077896252FAFBD49EFD26B5D171A32410"

// const contractDefined_JS = new ethers.Contract(contractAddress_JS, contractABI_JS, signer);


getDataOnChainToLoad()

async function getDataOnChainToLoad(){
  let chainIdConnected = await getChainIdConnected();

  if(chainIdConnected == baseSepoliaChainId){
    getStoredData()
  }
  if(chainIdConnected != baseSepoliaChainId){
    // document.getElementById("getValueStateSmartContract").innerHTML =  "Install Metamask and select Base Sepolia Testnet to have a Web3 provider to read blockchain data."
  }

}

async function getStoredData() {
  // let storedDataCallValue = await contractDefined_JS.storedData()
  // if(storedDataCallValue === undefined){
  //   document.getElementById("getValueStateSmartContract").innerHTML =  "Install Metamask and select Sepolia Testnet to have a Web3 provider to read blockchain data."
  // }
  // else{
  //   document.getElementById("getValueStateSmartContract").innerHTML =  storedDataCallValue
  // }
}

async function getWrappedTokenAddress() {  
  const storedData = await contractDefined_JS.WETH()
  return storedData
}

async function getFactoryAddress() {  
	const storedData = await contractDefined_JS.factory()
	return storedData
}

async function getGetAmountsOut(msgValueInput,swapPath) {  
	const storedData = await contractDefined_JS.getAmountsOut(msgValueInput,swapPath)
	return storedData
}


//Event listener in frontend for inputTokenAmount to detect new text inputs.
const inputTokenAmountUpdate = document.querySelector('#inputTokenAmount');
inputTokenAmountUpdate.addEventListener('input', () => {
  let inputValueTest = BigInt(document.getElementById("inputTokenAmount").value);
  console.log(inputValueTest.toString())

  // document.getElementById("outputTokenAmount").value = inputValueTest.toString();

});

async function swapEthForTokenTxAsync() {

  let wrappedTokenAddress = await getWrappedTokenAddress()
	console.log("wrappedTokenAddress: " + wrappedTokenAddress)

	let factoryAddress = await getFactoryAddress()
	console.log("factoryAddress: " + factoryAddress)

	const tokenIn = wrappedTokenAddress;
	const tokenOut = tokenERC20Address;
	const swapPath = [tokenIn,tokenOut];
	console.log("swapPath: ", swapPath);

	// let msgValueInput = 1041;
  let msgValueInput = BigInt(document.getElementById("inputTokenAmount").value);
  
 	let getAmountsOutReturnArray = await getGetAmountsOut(msgValueInput,swapPath);
	let amountOut = getAmountsOutReturnArray[1];

  document.getElementById("outputTokenAmount").value = amountOut;
 
	console.log("amountIn getAmountsOutReturnArray[0]: "  + getAmountsOutReturnArray[0])
	console.log("amountOut getAmountsOutReturnArray[1]: " + amountOut)

  const deadline = BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935");

  const callDataObject = await contractDefined_JS.populateTransaction.swapExactETHForTokens(
		ethers.utils.hexlify(amountOut),
		swapPath,
		accounts[0],
    ethers.utils.hexlify(deadline), 
  ); 

  ;
  const txData = callDataObject.data;

  ethereum
  .request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: accounts[0],
        to: contractAddress_JS,
        data: txData,
        value: ethers.utils.hexlify(msgValueInput),
      },
    ],
  })
  .then((txHash) => console.log(txHash))
  .catch((error) => console.error);  
    
}

async function swapTokenForEthTxAsync() {

  let wrappedTokenAddress = await getWrappedTokenAddress()
	console.log("wrappedTokenAddress: " + wrappedTokenAddress)

	let factoryAddress = await getFactoryAddress()
	console.log("factoryAddress: " + factoryAddress)

	// let approvalERC20 = await getApprovalERC20()
	// console.log("approvalERC20: " + approvalERC20)

	const tokenIn = tokenERC20Address;
	const tokenOut = wrappedTokenAddress;
	const swapPath = [tokenIn,tokenOut];
	console.log("swapPath: ", swapPath);

	let tokenERC20Input = 1041;
	let getAmountsOutReturnArray = await getGetAmountsOut(tokenERC20Input,swapPath);
	let amountOut = getAmountsOutReturnArray[1];
	console.log("amountIn getAmountsOutReturnArray[0]: "  + getAmountsOutReturnArray[0])
	console.log("amountOut getAmountsOutReturnArray[1]: " + amountOut)

  const deadline = BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935");

  const callDataObject = await contractDefined_JS.populateTransaction.swapExactTokensForETH(
		ethers.utils.hexlify(tokenERC20Input),
		ethers.utils.hexlify(amountOut),
		swapPath,
		accounts[0],
    ethers.utils.hexlify(deadline), 
  ); 

  ;
  const txData = callDataObject.data;

  ethereum
  .request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: accounts[0],
        to: contractAddress_JS,
        data: txData,
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
const swapEthForTokenContractEvent = document.querySelector('.swapEthForTokenContractEvent');
swapEthForTokenContractEvent.addEventListener('click', () => {
  checkAddressMissingMetamask()
  
  swapEthForTokenTxAsync()

})

// // MODIFY CONTRACT STATE WITH SET FUNCTION WITH PREDEFINED DATA FROM WEB3.JS
// const swapTokenForEthContractEvent = document.querySelector('.swapTokenForEthContractEvent');
// swapTokenForEthContractEvent.addEventListener('click', () => {
//   checkAddressMissingMetamask()
  
//   swapTokenForEthTxAsync()

// })

//If Metamask is not detected the user will be told to install Metamask.
function detectMetamaskInstalled(){
  try{
     ethereum.isMetaMask
  }
  catch(missingMetamask) {
     alert("Metamask not detected in browser! Install Metamask browser extension, then refresh page!")
    //  document.getElementById("getValueStateSmartContract").innerHTML =  "Install Metamask and select Sepolia Testnet to have a Web3 provider to read blockchain data."

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