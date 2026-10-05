# Web3 ICO Token Platform

A token sale site for Sepolia, Ethereum’s public test network. Visitors connect a wallet, complete a short identity check, and buy TBC with faucet ETH. Real ETH is not used.

The sale is a pair of Solidity contracts: an ERC-20 token and a sale contract that prices the token, takes the payment, and sends the tokens back to the buyer.

## What you can do

- Connect MetaMask or WalletConnect on Sepolia
- Read the round price, tokens sold, and tokens left
- Sign a KYC check in the connected wallet before a purchase
- Buy tokens and add TBC to the wallet
- Open an investor page for balance, progress, and another buy entry
- Open an admin page that only the owner wallet can use

Until a sale is deployed in that browser, the home page shows a labeled sample round. After deployment, those figures come from the contract.

## Stack

- Next.js 14 (pages router) and React 18
- RainbowKit, wagmi, and viem for the wallet
- ethers v5 for contract calls
- Solidity sale contracts, compiled with solc

## Project layout

```
pages/          Home, investor desk, admin
Components/     Page sections and modals
context/        Wallet, sale reads, and deploy
contracts/      SaleToken.sol and TokenICO.sol
scripts/        Compile the sale contracts
Utils/          KYC record stored in this browser
styles/         Site styles
public/         Images, fonts, and the favicon
```

## Run it locally

```bash
git clone https://github.com/AtharvChavan10/Web3-ICO-Token-Platform.git
cd Web3-ICO-Token-Platform
npm install
npm run dev
```

Open http://localhost:3000.

## Use the sale

1. In MetaMask, switch to Sepolia.
2. Get faucet ETH from the Google Cloud Sepolia faucet. The home page links to it.
3. Connect that wallet on the site.
4. If this browser has no sale yet, click **Deploy sale** and approve the three prompts: the token, the sale contract at 0.001 ETH, and the transfer of 1,000,000 TBC into the sale.
5. Complete KYC. The wallet must sign the check. A rejected signature does not count.
6. Buy tokens. The contract sends TBC to the paying wallet.

A different wallet can buy after its own KYC. It cannot open the admin tools. That page only answers to the owner wallet, `0xb8528831179FC5906A08E61Af3249166794b81f2`.

## Contracts

`contracts/SaleToken.sol` mints 10,000,000 TBC to the deployer.

`contracts/TokenICO.sol` sells that token. The buyer pays `amount * price` in ETH. The contract transfers the tokens and forwards the ETH to the owner.

Compile the pair with:

```bash
node scripts/compile-sale.js
```

The site deploys those artifacts from the connected wallet. No private key is stored in the repo.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the local site |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Lint the project |

## Note

This is a testnet project for learning and demonstration. Faucet ETH has no cash value. Do not point the sale at mainnet or at real funds without an audit.

## Authors

Atharv Chavan  
Aaditya Yadav  
Nikhil Parande  
Chaitanya Naik  

Blockchain developers.

## License

MIT. See [LICENSE](LICENSE).
