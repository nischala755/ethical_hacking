# Viva Notes

## Project Title

Decentralized Voting System Using Blockchain

## Problem Statement

Traditional voting systems can suffer from vote tampering, lack of transparency, duplicate voting, and dependence on one central authority. This project demonstrates how blockchain concepts can make voting records more transparent and tamper-evident.

## Objective

To build a browser-based voting system where each vote is stored as blockchain data, mined into a block, linked with the previous block hash, and verified through chain validation.

## Modules

- Voter ID creation
- Candidate selection
- Vote casting
- Pending vote pool
- Block mining
- Vote hash generation
- Merkle root generation
- Optional MetaMask wallet identity
- Decentralized node sync simulation
- Election result calculation
- Blockchain ledger display
- Tamper detection demo
- Solidity smart contract sample

## Algorithm

1. Create a genesis block.
2. Register or select a voter ID.
3. Allow the voter to vote only once.
4. Store the vote in the pending pool.
5. Generate a SHA-256 vote hash.
6. Build a Merkle root from all vote hashes in the block.
7. Mine a new block using proof-of-work.
8. Link the new block with the previous block hash.
9. Recalculate results from confirmed blockchain votes.
10. Validate every Merkle root, block hash, and previous-hash link.
11. If old vote data changes, mark the blockchain as invalid.

## Blockchain Properties Demonstrated

- Immutability: old votes cannot be changed without breaking the hash.
- Transparency: all confirmed blocks are visible in the ledger.
- Decentralization: multiple nodes keep copies of the latest chain state.
- Integrity: validation checks hashes and block links.
- Merkle tree: one root hash summarizes all votes in a block.
- Wallet identity: MetaMask can provide a public wallet address as voter ID.
- One-person-one-vote rule: each voter ID can vote only once.

## Smart Contract Explanation

The `contracts/DecentralizedVoting.sol` file is a simple Ethereum smart contract. It stores candidates, lets each wallet vote once, counts votes on-chain, and allows the admin to open or close the election.

## Limitations

This is an educational simulation, not a production election system. A real system would require secure identity verification, smart contracts, encrypted ballots, anonymous voting, consensus between real network nodes, and deployment on a blockchain network.

## Future Scope

- Add MetaMask wallet login.
- Deploy voting logic as a Solidity smart contract.
- Store candidates and results on Ethereum or Polygon.
- Add admin controls for election start and end time.
- Add private voting using cryptographic techniques.
