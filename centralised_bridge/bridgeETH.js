const Web3 = require('web3');

// Initialize Web3 provider for Ethereum
const web3Provider = 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
const web3 = new Web3(web3Provider);

// Ethereum account private key
const ethereumPrivateKey = 'ETH_PRIVATE_KEY';

// Ethereum contract address and ABI
const ethereumContractAddress = '0xb2e1ac8db6f1f530592c75e0549765be692a6adc';
const ethereumContractABI = require("../sepolia_contracts/sol_bridge_abi.json");


// Account address for locking tokens
const senderAddress = '0x747b11E5AaCeF79cd78C78a8436946b00dE30b97'; // Replace with the Ethereum account address

// Receiver address on Solana chain
const targetAddress = "9ribeWLwQPqrJb7szsr4zDjtoNVBTQ8ghcWRHAoVGfHP";

// Token amount to lock
const amountToLock = 1000; // Replace with the amount of tokens to lock

// Set up the transaction data
const contract = new web3.eth.Contract(ethereumContractABI, ethereumContractAddress);
const data = contract.methods.bridgeETH(targetAddress).encodeABI();

// Sign and send the transaction
web3.eth.accounts.signTransaction({
  to: ethereumContractAddress,
  data: data,
  value: amountToLock,
  gas: 40000, // Adjust gas limit as needed
}, ethereumPrivateKey)
.then((signedTx) => {
  web3.eth.sendSignedTransaction(signedTx.rawTransaction)
  .on('receipt', (receipt) => {
    console.log('Lock transaction receipt:', receipt);
  })
  .on('error', (error) => {
    console.error('Error sending lock transaction:', error);
  });
})
.catch((error) => {
  console.error('Error signing transaction:', error);
});
