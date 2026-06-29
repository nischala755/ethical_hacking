# Run Report

## Local Website

The project was run locally at:

`http://127.0.0.1:4173`

## Screenshots Captured

- `01-home-valid-chain.png`: initial app state with a valid blockchain.
- `02-pending-vote-hash.png`: vote added to pending pool with vote hash.
- `03-mined-block-merkle-root.png`: mined block showing block hash and Merkle root.
- `04-tamper-detection.png`: tamper demo showing failed chain validation.
- `05-hardhat-platform-panel.png`: website showing the Hardhat Ethereum smart contract panel.

## Verification Result

The demo flow was tested in a browser:

1. Loaded the project.
2. Reset local blockchain state.
3. Cast a vote.
4. Mined the vote into a block.
5. Triggered the tamper demo.

Final validation message:

`Block 1 Merkle root is invalid.`

This confirms that changing a mined vote breaks the Merkle root and the blockchain validation detects tampering.

## Blockchain Platform Verification

The project was upgraded to use a real blockchain development platform:

- Platform: Hardhat local Ethereum blockchain
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Smart contract: `contracts/DecentralizedVoting.sol`
- Latest deployed contract: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

Commands run successfully:

```powershell
npm run compile
npm test
npm run deploy:localhost
```

The deployment generated `contract-config.js`, which the browser UI uses to connect MetaMask and ethers.js to the Solidity smart contract.
