// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DecentralizedVoting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    address public admin;
    bool public electionOpen;
    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;

    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event ElectionStatusChanged(bool electionOpen);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier whenElectionOpen() {
        require(electionOpen, "Election is closed");
        _;
    }

    constructor(string[] memory candidateNames) {
        admin = msg.sender;
        electionOpen = true;

        for (uint256 i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({
                name: candidateNames[i],
                voteCount: 0
            }));
        }
    }

    function vote(uint256 candidateId) external whenElectionOpen {
        require(!hasVoted[msg.sender], "Wallet has already voted");
        require(candidateId < candidates.length, "Invalid candidate");

        hasVoted[msg.sender] = true;
        candidates[candidateId].voteCount += 1;

        emit VoteCast(msg.sender, candidateId);
    }

    function setElectionOpen(bool status) external onlyAdmin {
        electionOpen = status;
        emit ElectionStatusChanged(status);
    }

    function getCandidateCount() external view returns (uint256) {
        return candidates.length;
    }

    function getCandidate(uint256 candidateId) external view returns (string memory name, uint256 voteCount) {
        require(candidateId < candidates.length, "Invalid candidate");
        Candidate memory candidate = candidates[candidateId];
        return (candidate.name, candidate.voteCount);
    }
}
