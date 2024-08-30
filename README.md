Hey there,

A simple and intutive bridge with lock and release mechanism for Ethereum<>Solana.


Both the contracts are already deployed on the below mentioned networks, Source code of both the contracts is provided and can be deployed with relevant dev tooling on ETH and SOL.
(remix and solana playground can be used to get started quickly)
* beats long bridging time of wormhole ~30 mins to instant finality

Sepolia Deployment: 
https://sepolia.etherscan.io/address/0xb2e1ac8db6f1f530592c75e0549765be692a6adc

Solana Deployment: 
https://explorer.solana.com/tx/2Z8vNQVhCFdKv6gXrEyVLvCCNDpGAt2M5RaLAt7wTxDi1k24AiCvQuaCEw7SUPVUx43PzaitzyUyypbXQS97ybnt?cluster=devnet

Centralised Bridge backend server can be started by:
$ node centralised_bridge.js

Then any bridge transaction sent to the sepolia contract will be bridged by the centralized bridge.

To test it out just run the test file.
$ node bridgeETH.js
