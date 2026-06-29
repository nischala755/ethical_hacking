const candidates = [
  { id: "c1", name: "Ananya Rao", agenda: "Transparent college funds" },
  { id: "c2", name: "Rohan Mehta", agenda: "Better labs and Wi-Fi" },
  { id: "c3", name: "Sara Khan", agenda: "More student events" }
];

const demoVoters = [
  { id: "VID-1001", name: "Asha" },
  { id: "VID-1002", name: "Vikram" },
  { id: "VID-1003", name: "Neha" }
];

const difficulty = 3;
let state = {
  version: 2,
  voters: [...demoVoters],
  chain: [],
  pendingVotes: [],
  nodes: [
    { name: "Node A", synced: true, lastHash: "" },
    { name: "Node B", synced: true, lastHash: "" },
    { name: "Node C", synced: true, lastHash: "" }
  ],
  selectedCandidate: candidates[0].id,
  tampered: false
};

const els = {
  voterName: document.querySelector("#voterName"),
  voterSelect: document.querySelector("#voterSelect"),
  createVoterBtn: document.querySelector("#createVoterBtn"),
  walletBtn: document.querySelector("#walletBtn"),
  candidateList: document.querySelector("#candidateList"),
  castVoteBtn: document.querySelector("#castVoteBtn"),
  statusLine: document.querySelector("#statusLine"),
  mineBtn: document.querySelector("#mineBtn"),
  syncBtn: document.querySelector("#syncBtn"),
  tamperBtn: document.querySelector("#tamperBtn"),
  resetBtn: document.querySelector("#resetBtn"),
  chainHealth: document.querySelector("#chainHealth"),
  resultsList: document.querySelector("#resultsList"),
  ledger: document.querySelector("#ledger"),
  nodeGrid: document.querySelector("#nodeGrid"),
  blockCount: document.querySelector("#blockCount"),
  voteCount: document.querySelector("#voteCount"),
  pendingCount: document.querySelector("#pendingCount"),
  canvas: document.querySelector("#networkCanvas")
};

async function sha256(message) {
  const data = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hashBuffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function blockPayload(block) {
  return JSON.stringify({
    index: block.index,
    timestamp: block.timestamp,
    previousHash: block.previousHash,
    merkleRoot: block.merkleRoot,
    nonce: block.nonce,
    voteCount: block.votes.length
  });
}

async function calculateBlockHash(block) {
  return sha256(blockPayload(block));
}

function votePayload(vote) {
  return JSON.stringify({
    voterId: vote.voterId,
    candidateId: vote.candidateId,
    timestamp: vote.timestamp,
    walletAddress: vote.walletAddress || "",
    signature: vote.signature
  });
}

async function calculateVoteHash(vote) {
  return sha256(votePayload(vote));
}

async function calculateMerkleRoot(votes) {
  if (votes.length === 0) {
    return sha256("GENESIS");
  }

  let level = await Promise.all(votes.map((vote) => calculateVoteHash(vote)));
  while (level.length > 1) {
    const nextLevel = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] || left;
      nextLevel.push(await sha256(left + right));
    }
    level = nextLevel;
  }
  return level[0];
}

async function mineBlock(votes, previousHash) {
  const block = {
    index: state.chain.length,
    timestamp: new Date().toISOString(),
    previousHash,
    merkleRoot: await calculateMerkleRoot(votes),
    nonce: 0,
    votes,
    hash: ""
  };

  const prefix = "0".repeat(difficulty);
  do {
    block.hash = await calculateBlockHash(block);
    block.nonce += 1;
  } while (!block.hash.startsWith(prefix));

  block.nonce -= 1;
  return block;
}

async function createGenesisBlock() {
  const genesis = await mineBlock([], "0");
  genesis.index = 0;
  state.chain = [genesis];
  syncNodeHashes();
}

async function signVote(voterId, candidateId, timestamp) {
  return sha256(`${voterId}:${candidateId}:${timestamp}:college-election-2026`);
}

function getVotedVoterIds() {
  const minedIds = state.chain.flatMap((block) => block.votes.map((vote) => vote.voterId));
  const pendingIds = state.pendingVotes.map((vote) => vote.voterId);
  return new Set([...minedIds, ...pendingIds]);
}

function getCandidateName(candidateId) {
  return candidates.find((candidate) => candidate.id === candidateId)?.name || "Unknown";
}

function setStatus(message, type = "info") {
  els.statusLine.textContent = message;
  els.statusLine.style.color = type === "error" ? "var(--red)" : type === "success" ? "var(--green)" : "var(--muted)";
}

async function validateChain() {
  for (let i = 0; i < state.chain.length; i += 1) {
    const block = state.chain[i];
    const expectedMerkleRoot = await calculateMerkleRoot(block.votes);
    if (block.merkleRoot !== expectedMerkleRoot) {
      return { valid: false, message: `Block ${block.index} Merkle root is invalid.` };
    }
    const expectedHash = await calculateBlockHash(block);
    if (block.hash !== expectedHash || !block.hash.startsWith("0".repeat(difficulty))) {
      return { valid: false, message: `Block ${block.index} has been changed.` };
    }
    if (i > 0 && block.previousHash !== state.chain[i - 1].hash) {
      return { valid: false, message: `Block ${block.index} is not linked to the previous block.` };
    }
  }
  return { valid: true, message: "Chain valid" };
}

function saveState() {
  localStorage.setItem("decentralizedVotingState", JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem("decentralizedVotingState");
  if (!saved) return false;
  try {
    const parsed = JSON.parse(saved);
    if (parsed.version !== 2 || !parsed.chain?.every((block) => block.merkleRoot)) {
      localStorage.removeItem("decentralizedVotingState");
      return false;
    }
    state = { ...state, ...parsed };
    return Array.isArray(state.chain) && state.chain.length > 0;
  } catch {
    return false;
  }
}

function syncNodeHashes() {
  const latestHash = state.chain.at(-1)?.hash || "";
  state.nodes = state.nodes.map((node) => ({
    ...node,
    synced: true,
    lastHash: latestHash
  }));
}

function renderCandidates() {
  els.candidateList.innerHTML = candidates.map((candidate, index) => `
    <label class="candidate-option">
      <input type="radio" name="candidate" value="${candidate.id}" ${candidate.id === state.selectedCandidate || (!state.selectedCandidate && index === 0) ? "checked" : ""}>
      <span>
        <strong>${candidate.name}</strong>
        <small>${candidate.agenda}</small>
      </span>
    </label>
  `).join("");

  els.candidateList.addEventListener("change", (event) => {
    state.selectedCandidate = event.target.value;
  });
}

function renderVoters() {
  const votedIds = getVotedVoterIds();
  els.voterSelect.innerHTML = state.voters.map((voter) => {
    const voted = votedIds.has(voter.id);
    return `<option value="${voter.id}" ${voted ? "disabled" : ""}>${voter.name} (${voter.id})${voted ? " - voted" : ""}</option>`;
  }).join("");
}

function renderResults() {
  const counts = Object.fromEntries(candidates.map((candidate) => [candidate.id, 0]));
  const votes = state.chain.flatMap((block) => block.votes);
  votes.forEach((vote) => {
    if (counts[vote.candidateId] !== undefined) counts[vote.candidateId] += 1;
  });

  const total = votes.length || 1;
  els.resultsList.innerHTML = candidates.map((candidate) => {
    const count = counts[candidate.id];
    const percent = Math.round((count / total) * 100);
    return `
      <div class="result-item">
        <div class="result-topline">
          <span>${candidate.name}</span>
          <span>${count} vote${count === 1 ? "" : "s"}</span>
        </div>
        <div class="bar"><span style="width: ${percent}%"></span></div>
      </div>
    `;
  }).join("");

  els.blockCount.textContent = state.chain.length;
  els.voteCount.textContent = votes.length;
  els.pendingCount.textContent = state.pendingVotes.length;
}

function renderLedger() {
  const pendingCard = state.pendingVotes.length
    ? `<div class="block-card pending">
        <h3><span>Pending block</span><span>${state.pendingVotes.length} vote(s)</span></h3>
        ${state.pendingVotes.map((vote) => `<span class="vote-chip">${getCandidateName(vote.candidateId)} | ${vote.voteHash.slice(0, 10)}</span>`).join("")}
      </div>`
    : "";

  els.ledger.innerHTML = pendingCard + state.chain.slice().reverse().map((block) => `
    <article class="block-card ${state.tampered ? "invalid" : ""}">
      <h3><span>Block #${block.index}</span><span>${block.votes.length} vote(s)</span></h3>
      <div class="hash-line">Hash: ${block.hash}</div>
      <div class="hash-line">Merkle: ${block.merkleRoot}</div>
      <div class="hash-line">Previous: ${block.previousHash}</div>
      <div class="hash-line">Nonce: ${block.nonce}</div>
      ${block.votes.length
        ? block.votes.map((vote) => `<span class="vote-chip">${vote.voterId} -> ${getCandidateName(vote.candidateId)} | ${vote.voteHash.slice(0, 10)}</span>`).join("")
        : `<span class="vote-chip">Genesis block</span>`}
    </article>
  `).join("");
}

function renderNodes() {
  els.nodeGrid.innerHTML = state.nodes.map((node) => `
    <div class="node-card">
      <strong>${node.name} ${node.synced ? "OK" : "!"}</strong>
      <span>${node.synced ? "Synced" : "Out of sync"}</span>
      <span>${node.lastHash ? node.lastHash.slice(0, 18) + "..." : "No hash"}</span>
    </div>
  `).join("");
}

function drawNetwork() {
  const ctx = els.canvas.getContext("2d");
  const width = els.canvas.width;
  const height = els.canvas.height;
  ctx.clearRect(0, 0, width, height);

  const nodes = [
    { x: width * 0.2, y: height * 0.3, label: "A" },
    { x: width * 0.78, y: height * 0.32, label: "B" },
    { x: width * 0.48, y: height * 0.74, label: "C" }
  ];

  ctx.lineWidth = 3;
  nodes.forEach((node, index) => {
    const next = nodes[(index + 1) % nodes.length];
    ctx.strokeStyle = state.nodes[index].synced ? "#9cc7d3" : "#d89999";
    ctx.beginPath();
    ctx.moveTo(node.x, node.y);
    ctx.lineTo(next.x, next.y);
    ctx.stroke();
  });

  nodes.forEach((node, index) => {
    const synced = state.nodes[index].synced;
    ctx.fillStyle = synced ? "#176f8f" : "#b83232";
    ctx.beginPath();
    ctx.arc(node.x, node.y, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 24px Segoe UI";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.label, node.x, node.y);
  });

  const latestHash = state.chain.at(-1)?.hash?.slice(0, 10) || "genesis";
  ctx.fillStyle = "#1f2d3a";
  ctx.font = "700 15px Segoe UI";
  ctx.fillText(`Latest block: ${latestHash}`, width / 2, 34);
}

async function render() {
  renderVoters();
  renderResults();
  renderLedger();
  renderNodes();
  drawNetwork();

  const validation = await validateChain();
  els.chainHealth.textContent = validation.valid ? "Chain valid" : validation.message;
  els.chainHealth.className = `chain-health ${validation.valid ? "valid" : "invalid"}`;
  els.mineBtn.disabled = state.pendingVotes.length === 0;
  els.castVoteBtn.disabled = !els.voterSelect.value;
  saveState();
}

async function createVoter() {
  const name = els.voterName.value.trim();
  if (!name) {
    setStatus("Enter a voter name first.", "error");
    return;
  }

  const id = `VID-${Math.floor(1000 + Math.random() * 9000)}`;
  state.voters.push({ id, name });
  els.voterName.value = "";
  setStatus(`Voter ID created: ${id}`, "success");
  await render();
  els.voterSelect.value = id;
}

async function castVote() {
  const voterId = els.voterSelect.value;
  const candidateId = state.selectedCandidate;
  const votedIds = getVotedVoterIds();

  if (!voterId) {
    setStatus("Select an eligible voter ID.", "error");
    return;
  }
  if (votedIds.has(voterId)) {
    setStatus("This voter has already voted. One voter gets one vote.", "error");
    return;
  }

  const timestamp = new Date().toISOString();
  const vote = {
    voterId,
    candidateId,
    timestamp,
    walletAddress: voterId.startsWith("0x") ? voterId : "",
    signature: await signVote(voterId, candidateId, timestamp),
    voteHash: ""
  };
  vote.voteHash = await calculateVoteHash(vote);

  state.pendingVotes.push(vote);
  state.nodes = state.nodes.map((node, index) => index === 0 ? { ...node, synced: false } : node);
  setStatus(`Vote added to pending pool for ${getCandidateName(candidateId)}. Mine a block to confirm it.`, "success");
  await render();
}

async function confirmPendingVotes() {
  if (state.pendingVotes.length === 0) return;
  setStatus("Mining block with proof-of-work...");
  const previousHash = state.chain.at(-1).hash;
  const block = await mineBlock([...state.pendingVotes], previousHash);
  state.chain.push(block);
  state.pendingVotes = [];
  state.tampered = false;
  state.nodes = state.nodes.map((node, index) => index === 2 ? { ...node, synced: false } : node);
  setStatus(`Block #${block.index} mined and linked to the chain.`, "success");
  await render();
}

async function syncNodes() {
  syncNodeHashes();
  setStatus("All nodes now hold the latest block hash.", "success");
  await render();
}

async function tamperWithChain() {
  const blockWithVote = state.chain.find((block) => block.votes.length > 0);
  if (!blockWithVote) {
    setStatus("Cast and mine at least one vote before running the tamper demo.", "error");
    return;
  }

  const firstVote = blockWithVote.votes[0];
  const replacement = candidates.find((candidate) => candidate.id !== firstVote.candidateId);
  firstVote.candidateId = replacement.id;
  state.tampered = true;
  setStatus("A mined vote was changed without recalculating the proof. Validation should now fail.", "error");
  await render();
}

async function resetDemo() {
  localStorage.removeItem("decentralizedVotingState");
  state = {
    version: 2,
    voters: [...demoVoters],
    chain: [],
    pendingVotes: [],
    nodes: [
      { name: "Node A", synced: true, lastHash: "" },
      { name: "Node B", synced: true, lastHash: "" },
      { name: "Node C", synced: true, lastHash: "" }
    ],
    selectedCandidate: candidates[0].id,
    tampered: false
  };
  await createGenesisBlock();
  setStatus("Demo reset with a fresh genesis block.", "success");
  await render();
}

async function connectMetaMask() {
  if (!window.ethereum) {
    setStatus("MetaMask is not installed. The demo voter IDs still work.", "error");
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const walletAddress = accounts[0];
    if (!walletAddress) {
      setStatus("No wallet account was returned by MetaMask.", "error");
      return;
    }

    const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    if (!state.voters.some((voter) => voter.id.toLowerCase() === walletAddress.toLowerCase())) {
      state.voters.push({ id: walletAddress, name: `Wallet ${shortAddress}` });
    }

    await render();
    els.voterSelect.value = walletAddress;
    setStatus(`MetaMask connected as ${shortAddress}. This wallet can vote once.`, "success");
  } catch {
    setStatus("MetaMask connection was cancelled or blocked.", "error");
  }
}

async function boot() {
  renderCandidates();
  if (!loadState()) {
    await createGenesisBlock();
  }
  els.createVoterBtn.addEventListener("click", createVoter);
  els.walletBtn.addEventListener("click", connectMetaMask);
  els.castVoteBtn.addEventListener("click", castVote);
  els.mineBtn.addEventListener("click", confirmPendingVotes);
  els.syncBtn.addEventListener("click", syncNodes);
  els.tamperBtn.addEventListener("click", tamperWithChain);
  els.resetBtn.addEventListener("click", resetDemo);
  await render();
}

boot();
