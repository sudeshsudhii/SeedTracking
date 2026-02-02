# EventChain – AI-Enabled Intelligent PDS Monitoring Platform

## Overview
**EventChain** is a unified, intelligent platform designed to revolutionize the **Public Distribution System (PDS)**. By integrating **Blockchain transparency**, **IPFS decentralized storage**, and **AI-powered fraud detection**, EventChain creates a tamper-proof, verifiable, and efficient monitoring system for ration distribution.

This platform unifies the **EventChain Ledger** (for immutable record-keeping) and the **PDS Monitoring System** (for intelligent decision-making) into a single, cohesive product.

## Key Features

### 1. Unified Event Ledger
All PDS transactions are treated as verifiable "events" on a public ledger.
- **Blockchain**: Uses Ethereum/Solidity (`EventChain.sol`) to store immutable metadata and proof of existence.
- **IPFS**: Uses InterPlanetary File System to store detailed transaction data (JSON payloads including Beneficiary IDs, Quantities, AI Scores) in a decentralized manner.

### 2. AI-Powered Fraud Detection
Every distribution attempt is analyzed in real-time by an advanced **AI Service**.
- **Fraud Scoring**: Calculates a fraud score (0-1) based on historical patterns (Region Risk, Shop Frequency, Time Gaps).
- **Pre-Validation**: Flags high-risk transactions *before* they are finalized on the ledger.
- **Explainable AI**: Provides reasons for flagging (e.g., "High frequency purchase", "Abnormal quantity").

### 3. Authority Dashboard
 a real-time view of the PDS ecosystem for authorities.
- **Live Feed**: Streams verified transactions directly from the Blockchain/Backend.
- **System Health**: Monitors connectivity to IPFS and Blockchain nodes.
- **Fraud Alerts**: Highlights flagged transactions for immediate review.

### 4. Public Verification
Empowers citizens and auditors to verify any transaction independently.
- **QR Codes**: Every transaction generates a unique QR code containing its IPFS hash.
- **Cryptographic Proof**: Users can verify that the data on IPFS matches the hash stored immutably on the Blockchain.

## System Architecture

The system follows a modern pipeline:
1.  **Input**: PDS Authority enters distribution details via the Web Portal.
2.  **Intelligence**: Details are sent to the **AI Service** (Python/FastAPI) for scoring.
3.  **Storage**: Validated payload is uploaded to **IPFS** (Node.js Service).
4.  **Consensus**: IPFS Hash is recorded on the **Ethereum Blockchain** via `EventChain` smart contract.
5.  **Visualization**: Frontend dashboard updates live from the unified backend.

## Technology Stack

-   **Frontend**: React, Tailwind CSS, ethers.js
-   **Backend**: Node.js, Express
-   **AI Service**: Python, FastAPI, Scikit-learn (Isolation Forest)
-   **Blockchain**: Solidity, Hardhat, Ethereum (Local/Testnet)
-   **Storage**: IPFS (Local/Public Gateway), SQLite (Local Cache)

## Getting Started

### Prerequisites
-   Node.js (v16+)
-   Python (v3.8+)
-   Docker (Optional, for full stack)
-   MetaMask Wallet (Browser Extension)

### 1. Start the Backend & AI Service
```bash
# Start AI Service
cd ai-service
pip install -r requirements.txt
python main.py
# Runs on :8000

# Start Node Backend
cd ../backend-node
npm install
node index.js
# Runs on :4000
```

### 2. Deploy Smart Contracts
```bash
cd backend-node
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
# Note the Contract Address
```
*Ensure you update the `.env` file in `backend-node` with the Contract Address.*

### 3. Start Frontend
```bash
cd frontend
npm install
npm start
# Runs on :3000
```

## Usage Flow

1.  **Navigate to Home**: See the unified platform overview.
2.  **Distribute Ration**: Go to "PDS Distribution" (Add Event). Enter Beneficiary ID and Quantity.
3.  **Check Analysis**: The system will compute a Fraud Score and record the event.
4.  **Verify**: Click the link in the success message or go to "Timeline" -> "Verify" to see the IPFS data and Blockchain proof.
5.  **Monitor**: Visit "Authority Dashboard" to see live stats.

## License
MIT
