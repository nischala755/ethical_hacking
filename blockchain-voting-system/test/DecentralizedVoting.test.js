const assert = require("assert");

describe("DecentralizedVoting", function () {
  async function deployVoting() {
    const Voting = await ethers.getContractFactory("DecentralizedVoting");
    const voting = await Voting.deploy(["Ananya Rao", "Rohan Mehta", "Sara Khan"]);
    await voting.waitForDeployment();
    return voting;
  }

  it("allows a wallet to vote only once", async function () {
    const voting = await deployVoting();
    const [, voter] = await ethers.getSigners();

    await voting.connect(voter).vote(1);
    await assert.rejects(
      voting.connect(voter).vote(2),
      /Wallet has already voted/
    );

    const candidate = await voting.getCandidate(1);
    assert.equal(candidate.voteCount, 1n);
  });

  it("allows the admin to close the election", async function () {
    const voting = await deployVoting();
    const [, voter] = await ethers.getSigners();

    await voting.setElectionOpen(false);
    await assert.rejects(
      voting.connect(voter).vote(0),
      /Election is closed/
    );
  });
});
