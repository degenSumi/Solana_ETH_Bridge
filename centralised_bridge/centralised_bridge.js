const Web3 = require('web3');
const { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, SystemProgram } = require('@solana/web3.js');
const bs58 = require("bs58");


// Initialize Web3 provider for Ethereum
const web3Provider = 'wss://sepolia.drpc.org';
const web3 = new Web3(web3Provider);

// Initialize Solana connection
const solanaEndpoint = 'SOL_RPC';
const solanaConnection = new Connection(solanaEndpoint, 'confirmed');

const solanaAccount = Keypair.fromSecretKey(bs58.decode('<PRIVATE_KEY>'));
// console.log(solanaAccount.publicKey);

// Ethereum contract address and ABI
const ethereumContractAddress = '0xb2e1ac8db6f1f530592c75e0549765be692a6adc';
const ethereumContractABI = require("../sepolia_contracts/sol_bridge_abi.json");

// Solana program ID
const solanaProgramId = '58VbuVLPQofA7Hx2hGm19QVHpsFRRZX3Q6CFgSsaP5SS';

async function monitorLockEvents() {
    
    const contract = new web3.eth.Contract(ethereumContractABI, ethereumContractAddress);

    // Subscribe to Ethereum lock events
    contract.events.BridgeERC20()
        .on("connected", () => {
            console.log("Listening to the ERC20 locks");
        })
        .on('data', async (event) => {
            const { sender, targetAddress, amount, token } = event.returnValues;
            // Trigger release process on Solana
            console.log(`from: ${sender}, ${amount} of ${token}, to ${targetAddress}`);
              await releaseTokensToSolana(sender, amount, targetChain);
        })
        .on('error', (error) => {
            console.error('Error:', error);
        });

    contract.events.BridgeETH()
        .on("connected", () => {
            console.log("Listening to the ETH locks");
        })
        .on('data', async (event) => {
            const { sender, targetAddress, amount } = event.returnValues;
            // Trigger release process on Solana
            console.log(`from: ${sender}, ${amount} of WEI, to ${targetAddress}`);
            await releaseTokensToSolana(sender, amount, targetAddress);
        })
        .on('error', (error) => {
            console.error('Error:', error);
        });
}

async function releaseTokensToSolana(sender, amount, targetAddress) {
    try {
        // Call Solana contract to release tokens
        const solanaProgramIdPublicKey = new PublicKey(solanaProgramId); // Solana release contract
        const receipientAddress = new PublicKey(targetAddress);
        const instructionData = Buffer.allocUnsafe(8); // 8-byte buffer for amount
        instructionData.writeBigUInt64LE(BigInt(amount));
        const transaction = new Transaction().add(
            new TransactionInstruction({
                programId: solanaProgramIdPublicKey,
                keys: [
                    { pubkey: solanaAccount.publicKey, isSigner: true, isWritable: true },
                    { pubkey: receipientAddress, isSigner: false, isWritable: true },
                    {
                        pubkey: SystemProgram.programId,
                        isSigner: false,
                        isWritable: false,
                    },                ],
                data: instructionData,
            })
        );

        const transactionSignature = await solanaConnection.sendTransaction(
            transaction,
            [solanaAccount],
            { commitment: 'confirmed' }
        );
        console.log(`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`);
        // Log transaction details
        console.log(`Tokens released to ${targetAddress} on Solana. Amount: ${amount} Lamports`);
    } catch (error) {
        console.error('Error releasing tokens to Solana:', error);
    }
}

// releaseTokensToSolana("0x", "10000", "9ribeWLwQPqrJb7szsr4zDjtoNVBTQ8ghcWRHAoVGfHP");

monitorLockEvents().catch((error) => {
    console.error('Error monitoring lock events:', error);
});


