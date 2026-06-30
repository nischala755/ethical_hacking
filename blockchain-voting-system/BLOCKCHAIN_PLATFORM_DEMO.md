# Blockchain Platform Demo

This project now uses an actual blockchain platform for demonstration:

**Platform:** Hardhat local Ethereum blockchain  
**Smart contract:** `contracts/DecentralizedVoting.sol`  
**Frontend wallet:** MetaMask  
**Frontend library:** ethers.js  

## Why This Is Not Only HTML

The browser UI has two parts:

1. A local educational blockchain simulator that demonstrates hashing, Merkle roots, proof-of-work, and tamper detection.
2. A real Ethereum smart contract demo deployed on Hardhat, where votes are sent as blockchain transactions through MetaMask.

## Files Added For Blockchain Platform Usage

- `package.json`: Hardhat, ethers, compile, deploy, test, and serve commands.
- `hardhat.config.js`: Hardhat Ethereum network configuration.
- `contracts/DecentralizedVoting.sol`: Solidity voting smart contract.
- `scripts/deploy.js`: deploys the contract to Hardhat localhost.
- `contract-config.js`: generated frontend contract address and ABI.
- `test/DecentralizedVoting.test.js`: smart contract tests.
- `vendor/ethers.umd.min.js`: browser ethers.js library.

## Run Steps

You can run the demo in either one-command mode or manual mode.

## Easy Windows Demo

In PowerShell, run:

```powershell
npm install
npm run demo:windows
```

This will:

- start the Hardhat blockchain on `http://127.0.0.1:8545`
- deploy the Solidity contract
- generate `contract-config.js`
- start the website on `http://127.0.0.1:4173`

Open:

`http://127.0.0.1:4173`

For MetaMask test account private keys, open:

`hardhat-node.log`

## Manual Demo

Open three terminals in this folder.

### Terminal 1: Start Blockchain

```powershell
npm install
npm run chain
```

This starts a Hardhat Ethereum blockchain at:

`http://127.0.0.1:8545`

Chain ID:

`31337`

### Terminal 2: Deploy Smart Contract

```powershell
npm run deploy:localhost
```

This deploys `DecentralizedVoting.sol` and updates `contract-config.js` with the deployed contract address and ABI.

Important: if you see `ECONNREFUSED 127.0.0.1:8545`, it means Terminal 1 is not running or the Hardhat blockchain has stopped. Run `npm run chain` again and keep that terminal open, then retry `npm run deploy:localhost`.

### Terminal 3: Run Website

```powershell
npm run serve
```

Open:

`http://127.0.0.1:4173`

## MetaMask Setup

Add or switch to this network in MetaMask:

- Network name: `Hardhat Localhost`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency symbol: `ETH`

Import a Hardhat test account into MetaMask using one of the private keys shown in the `npm run chain` terminal.

## On-Chain Voting Demo

1. Click `Switch to Hardhat`.
2. Click `Load Contract`.
3. Select a candidate.
4. Click `Vote On-Chain`.
5. Confirm the transaction in MetaMask.
6. The on-chain vote count updates from the Solidity contract.

## Commands Verified

```powershell
npm run compile
npm test
npm run deploy:localhost
```

Latest local deployment:

`0x5FbDB2315678afecb367f032d93F642f64180aa3`
