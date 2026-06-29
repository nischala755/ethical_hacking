# Decentralized Voting System

This is a mini blockchain project for a course demo. It is a static web app that simulates a decentralized voting network where votes are stored in mined blocks, each block is linked with a cryptographic hash, and tampering is detected by chain validation.

## Features

- Create voter IDs.
- Cast one vote per voter.
- Add votes to a pending transaction pool.
- Mine votes into a block using proof-of-work.
- Generate SHA-256 hashes for votes and blocks.
- Store a Merkle root in every block.
- Use MetaMask wallet address as an optional voter identity.
- Sync simulated decentralized nodes.
- View live election results.
- Inspect the blockchain ledger.
- Run a tamper demo to show why changing old votes breaks validation.
- Include a Solidity smart contract example for Ethereum-style deployment.

## How to Run

Open `index.html` in any modern browser.

No server, database, or package installation is required.

## Project Files

- `index.html` contains the app structure.
- `styles.css` contains the responsive UI design.
- `app.js` contains the blockchain voting logic.
- `contracts/DecentralizedVoting.sol` contains a simple Solidity smart contract.
- `VIVA_NOTES.md` contains short presentation notes.

## Blockchain Concepts Used

### Block

Each block stores:

- block index
- timestamp
- previous block hash
- Merkle root
- nonce
- confirmed votes
- current block hash

### Hashing

The app uses the browser Web Crypto API with SHA-256. A block hash is calculated from the block data. If a mined vote is changed later, the recalculated hash no longer matches the stored hash.

### Merkle Tree

Every vote is converted into a vote hash. The vote hashes are paired and hashed together until one final hash remains. That final hash is the Merkle root stored in the block.

If any vote inside the block changes, the vote hash changes, the Merkle root changes, and validation fails.

### Proof-of-Work

When mining, the app searches for a hash that starts with a fixed number of zeroes. This proves that computational work was performed before adding the block.

### MetaMask Identity

The Connect MetaMask button asks the browser wallet for the user's public account address. That wallet address can be used as a voter ID. The app still works without MetaMask by using demo voter IDs.

### Decentralization Simulation

The app shows three nodes. After voting or mining, some nodes can become out of sync. The Sync Nodes button updates all nodes to the latest block hash.

### Smart Contract

The Solidity contract in `contracts/DecentralizedVoting.sol` shows the core on-chain voting rules:

- admin starts or stops the election
- each wallet can vote only once
- candidate vote counts are stored on-chain
- vote events are emitted for transparency

## Demo Flow

1. Create or select a voter ID.
2. Optionally connect MetaMask and use your wallet as the voter ID.
3. Select a candidate.
4. Click Cast Vote.
5. Notice the pending vote hash.
6. Click Mine Block to confirm pending votes.
7. Notice the block hash and Merkle root.
8. Click Sync Nodes to update the simulated network.
9. Click Tamper Demo to modify a mined vote.
10. Notice that chain validation fails.
11. Click Reset to start again.

## Important Note

This is an educational simulation. A real decentralized voting system would need wallet authentication, smart contracts, voter eligibility checks, privacy protections, and deployment on a blockchain network such as Ethereum, Polygon, or Hyperledger Fabric.
