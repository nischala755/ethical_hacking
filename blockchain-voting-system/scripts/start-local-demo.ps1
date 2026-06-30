$ErrorActionPreference = "Stop"

function Test-Port($port) {
  $connection = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  return $null -ne $connection
}

Write-Host "Starting decentralized voting local blockchain demo..."

if (-not (Test-Port 8545)) {
  Write-Host "Starting Hardhat blockchain on http://127.0.0.1:8545 ..."
  Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c", "npm run chain > hardhat-node.log 2>&1" `
    -WorkingDirectory (Get-Location) `
    -WindowStyle Hidden

  $ready = $false
  for ($i = 0; $i -lt 20; $i++) {
    Start-Sleep -Seconds 1
    if (Test-Port 8545) {
      $ready = $true
      break
    }
  }

  if (-not $ready) {
    Write-Host "Hardhat did not start. Check hardhat-node.log for details."
    exit 1
  }
} else {
  Write-Host "Hardhat blockchain is already running on port 8545."
}

Write-Host "Compiling and deploying Solidity contract..."
npm run deploy:localhost

if (-not (Test-Port 4173)) {
  Write-Host "Starting website on http://127.0.0.1:4173 ..."
  Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c", "npm run serve > website.log 2>&1" `
    -WorkingDirectory (Get-Location) `
    -WindowStyle Hidden
} else {
  Write-Host "Website is already running on port 4173."
}

Write-Host ""
Write-Host "Demo is ready."
Write-Host "Website: http://127.0.0.1:4173"
Write-Host "Hardhat RPC: http://127.0.0.1:8545"
Write-Host "MetaMask chain ID: 31337"
Write-Host ""
Write-Host "For MetaMask test account private keys, open hardhat-node.log."
