# 🚀 Web3 ICO Token Platform

A full-stack **Web3 decentralized application (DApp)** that enables users to participate in an **Initial Coin Offering (ICO)** and purchase ERC-20 tokens securely using blockchain technology.

This project demonstrates end-to-end development of a decentralized token sale platform including **smart contracts, wallet integration, and frontend UI**.

---

## 📌 Features

- 🔐 Decentralized ICO (Initial Coin Offering)
- 💰 Buy ERC-20 tokens using ETH
- 🌐 Wallet connection via Web3Modal / MetaMask
- ⚡ Fast and responsive UI (React + Tailwind CSS)
- 📊 Real-time transaction updates
- 🔄 Secure and transparent blockchain transactions
- 🧠 Input validation and error handling

---

## 🧱 Tech Stack

### 🖥 Frontend
- React.js
- Tailwind CSS
- Chart.js
- Ethers.js

### 🔗 Blockchain
- Solidity (Smart Contracts)
- Hardhat (Development & Testing)
- Web3Modal (Wallet Integration)

### 🌐 Network
- Ethereum (Testnet: Goerli / Sepolia)

---

## 📁 Project Structure

Web3-ICO-Token-Platform/
│
├── client/                  # Frontend (React)
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── utils/
│
├── smart-contracts/         # Smart Contracts
│   ├── contracts/
│   ├── scripts/
│   ├── test/
│   └── hardhat.config.js
│
├── .gitignore
├── package.json
└── README.md

---

## ⚙️ Smart Contracts

### 🔹 ERC-20 Token Contract
- Custom token implementation
- Token minting and supply control

### 🔹 ICO Contract
- Manages token sale logic
- Accepts ETH payments
- Automatically transfers tokens to buyers

---

## 🔗 Deployment (Update after deploying)

- 🪙 Token Contract:  
  https://etherscan.io/address/YOUR_TOKEN_ADDRESS

- 💼 ICO Contract:  
  https://etherscan.io/address/YOUR_ICO_ADDRESS

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

git clone https://github.com/AtharvChavan10/Web3-ICO-Token-Platform.git  
cd Web3-ICO-Token-Platform

---

### 2️⃣ Install Frontend Dependencies

cd client  
npm install  

---

### 3️⃣ Run Frontend

npm start  

---

### 4️⃣ Setup Smart Contracts

cd smart-contracts  
npm install  
npx hardhat compile  
npx hardhat run scripts/deploy.js --network goerli  

---

## 🔐 Environment Variables

Create a `.env` file inside `smart-contracts/`:

PRIVATE_KEY=your_wallet_private_key  
RPC_URL=your_rpc_provider_url  

---

## 🧪 Testing

npx hardhat test  

---

## 📊 How It Works

1. User connects wallet (MetaMask)  
2. Frontend connects to blockchain using Ethers.js  
3. User enters ETH amount  
4. Smart contract calculates token amount  
5. Tokens are transferred instantly  
6. Transaction stored on blockchain  

---

## 📸 Screenshots

<img width="975" height="548" alt="image" src="https://github.com/user-attachments/assets/0cd787a8-a69e-4734-85d8-f268de6604e0" />

<img width="975" height="548" alt="image" src="https://github.com/user-attachments/assets/1bed8365-55a9-4c25-9eb3-356d50b5124f" />

<img width="975" height="548" alt="image" src="https://github.com/user-attachments/assets/c35750ed-96f3-4218-bb36-f39d10025a84" />

---

## 🎯 Use Cases

- Blockchain startup fundraising  
- Token launch platforms  
- Learning Web3 full-stack development  

---

## ⚠️ Disclaimer

This project is for **educational purposes only**.  
Do not use in production without proper security audits.

---

## 🤝 Contributing

1. Fork the repository  
2. Create a new branch  
3. Commit your changes  
4. Open a pull request  

---

## 📄 License

MIT License

---

## 👨‍💻 Authors

Atharv Chavan
Aaditya Yadav
Nikhil Parande
Chaitanya Naik
Blockchain Developers 🚀  

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
