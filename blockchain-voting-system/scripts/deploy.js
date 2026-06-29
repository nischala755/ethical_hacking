const fs = require("fs");
const path = require("path");

async function main() {
  const candidateNames = ["Ananya Rao", "Rohan Mehta", "Sara Khan"];
  const Voting = await ethers.getContractFactory("DecentralizedVoting");
  const voting = await Voting.deploy(candidateNames);

  await voting.waitForDeployment();

  const address = await voting.getAddress();
  const deployment = {
    platform: "Hardhat local Ethereum blockchain",
    network: "localhost",
    chainId: 31337,
    contractName: "DecentralizedVoting",
    contractAddress: address,
    candidates: candidateNames,
    deployedAt: new Date().toISOString()
  };

  const abi = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "..", "artifacts", "contracts", "DecentralizedVoting.sol", "DecentralizedVoting.json"),
      "utf8"
    )
  ).abi;

  fs.mkdirSync(path.join(__dirname, "..", "deployments"), { recursive: true });
  fs.writeFileSync(
    path.join(__dirname, "..", "deployments", "localhost.json"),
    JSON.stringify({ ...deployment, abi }, null, 2)
  );

  fs.writeFileSync(
    path.join(__dirname, "..", "contract-config.js"),
    `window.VOTING_CONTRACT = ${JSON.stringify({ ...deployment, abi }, null, 2)};\n`
  );

  console.log("DecentralizedVoting deployed successfully");
  console.log(`Network: ${deployment.network} (chainId ${deployment.chainId})`);
  console.log(`Contract address: ${address}`);
  console.log("Generated: deployments/localhost.json");
  console.log("Generated: contract-config.js");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
