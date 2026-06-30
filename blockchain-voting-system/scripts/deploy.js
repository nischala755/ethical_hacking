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
  const message = String(error?.message || error);
  if (message.includes("HH108") || message.includes("ECONNREFUSED")) {
    console.error("");
    console.error("Cannot connect to the Hardhat localhost blockchain.");
    console.error("");
    console.error("Fix:");
    console.error("1. Open a new terminal in this project folder.");
    console.error("2. Run: npm run chain");
    console.error("3. Keep that terminal open.");
    console.error("4. In another terminal, run: npm run deploy:localhost");
    console.error("");
    console.error("Hardhat RPC must be listening at http://127.0.0.1:8545 before deployment.");
    console.error("");
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});
