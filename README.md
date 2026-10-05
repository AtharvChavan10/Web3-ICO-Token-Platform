# Web3 ICO Token Platform

This is a public token sale that runs on Sepolia. A visitor opens the site, connects a wallet, proves who they are with a wallet signature, and buys TBC with test ETH from a faucet. The price, the payment, and the token transfer all happen in a Solidity contract. The site does not hold the money and it does not use real ETH.

Atharv Chavan is the founder and the only admin. Nikhil Parande, Aaditya Yadav, and Chaitanya Naik built the wallet path, the contracts, and the pages with him.

## What Sepolia is

Ethereum has one main network, where ETH has a market price, and several test networks, where the coins are free and worthless. Sepolia is the test network this sale uses.

A Sepolia ETH coin looks like ETH inside MetaMask, and it can pay gas and call contracts, but a faucet gives it away. Spending it does not spend real money. The site refuses a wallet that is on Ethereum mainnet or on any other network, and it asks MetaMask to switch to Sepolia before a purchase or a deploy.

Chain id: `11155111` (`0xaa36a7`).

Faucet used by the home page: [Google Cloud Sepolia faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia).

Public reads go through `https://ethereum-sepolia-rpc.publicnode.com` and `https://1rpc.io/sepolia`. Transactions are signed in the connected wallet and broadcast by that wallet.

## What the system does

Two contracts sit on Sepolia.

`SaleToken` is the ERC-20. Its name is TheBlockchainCoders, its symbol is TBC, and it has 18 decimals. The constructor mints 10,000,000 TBC to the wallet that deploys it.

`TokenICO` is the sale. Its constructor stores the token address, the price, and the deployer as owner. A buy calls `buyToken`. The buyer must send exactly `token amount × sale price` in ETH. The contract checks that it still holds enough TBC, transfers `amount × 10^18` units to the buyer, forwards the ETH to the owner, and adds the amount to `soldTokens`.

The website is the window onto those contracts. It does four jobs:

1. Show the round: price, sold, remaining, and how full the round is.
2. Let a buyer connect, pass KYC, and purchase.
3. Give each buyer an investor desk for their own balance and a second buy form.
4. Give the admin a private dashboard to read the round and change the contract.

If this browser has not deployed a sale yet, the home page shows a labeled sample round (price 0.001 ETH, 184,250 sold, 815,750 left). Those numbers are not chain data. After **Deploy sale** succeeds, the page reloads and reads the new contract.

## How a purchase works

1. MetaMask is on Sepolia and holds faucet ETH.
2. The buyer connects. RainbowKit opens MetaMask or WalletConnect.
3. The buyer opens KYC, fills name, email, ID number, address, and two ID images, then signs a message in the wallet. The images are checked in the browser and are not saved. The signature, name, email, and time are saved in `localStorage` under `kycVerified:<address>`. A rejected signature does not verify the wallet. A plain `"true"` value in storage is ignored.
4. The buyer enters how many tokens they want. The site multiplies that count by the contract price and shows the ETH cost.
5. MetaMask asks the buyer to confirm `buyToken` with that ETH attached.
6. The sale contract sends TBC to the buyer and the ETH to the admin wallet.
7. The buyer can press **Add token** so MetaMask tracks TBC.

Every buy button on the home page, in the buy modal, and on the investor page uses the same gate: no wallet means connect first, no KYC means the form opens, and only then does the contract call go out.

## The home page

Route: `/`

The header carries the logo, the section links, **Tools**, **Investor**, **Admin**, and the RainbowKit connect button. **Admin** is hidden once a non-admin wallet is connected.

The hero is the sale itself. It shows the network, a sample or live price, and the buttons:

| Button | What it does |
| --- | --- |
| Deploy sale | Shown until this browser has a sale. Deploys the token, deploys the sale at 0.001 ETH, and moves 1,000,000 TBC into the sale. Three MetaMask confirmations. |
| Connect Wallet | Opens RainbowKit. |
| Complete KYC / Verify to buy | Opens the identity form. After a valid signature the purchase button unlocks. |
| Purchase Token | Opens the buy modal. |
| Add to MetaMask | Asks the wallet to watch TBC. |
| Get test ETH | Opens the Sepolia faucet. |

Under the hero, a progress bar shows price, sold, left, and percent filled. It says **Sample round** or **Live round** so a quiet chain is not presented as a live sale.

The rest of the page is the story of the round:

- **About** explains the sale in plain language.
- **Features** lists checkout, wallet connection, pricing, the KYC gate, owner controls, and the investor desk.
- **Tokenomics** is the allocation chart. The slices are the planned split (development, ecosystem, marketing, operations, legal). The live price still comes from the contract, not from the chart.
- **Sale numbers** repeat supply, price, raised, and remaining. Sample figures stay labeled as a sample.
- **Roadmap** walks from the contracts, to the wallet app, to the public round.
- **Team** is Atharv Chavan, Nikhil Parande, Aaditya Yadav, and Chaitanya Naik.
- **FAQ** answers what the ICO is, how to buy, why the network is Sepolia, why KYC exists, and where the tokens go.
- **Contact** keeps a note on this device. It does not send mail to a server.

## The investor tab

Route: `/investor`

This is the buyer's own desk. It is not an admin page. Any connected wallet can open it, and it only shows that wallet's view of the same sale.

The top of the page names the connected address. Nine cards then read the contract and the wallet:

| Card | Meaning |
| --- | --- |
| Your Token Balance | TBC currently held by the sale contract. |
| Tokens Sold | `soldTokens` on the sale contract. |
| Available Tokens | The same sale inventory, shown as the amount still for sale. |
| Sale Completion | Sold divided by total supply. |
| Token Price | `tokenSalePrice`, shown in ETH. |
| USD Price | That ETH price times the current ETH/USD quote from CoinGecko. |
| Wallet Balance | Sepolia ETH in the connected wallet. |
| Holdings Value | The connected balance priced in USD. A zero balance shows `$0.00`. |
| KYC Status | Verified or not, for this wallet in this browser. |

A progress bar repeats how much of the supply has sold.

**Buy tokens** is the form:

- **Tokens** is the amount field. The default is 1.
- **You pay** is `amount × token price` in ETH, plus the USD estimate when the price quote is available.
- **Buy** sends `buyToken` after KYC. If KYC is missing, the button says **Verify to buy** and opens the form instead.
- **Buy max** sets the amount to whichever is smaller: how many tokens the wallet can afford, or how many the sale still holds.
- **Add token** registers TBC in MetaMask.
- The KYC pill says **KYC verified** or **KYC needed**. If it is needed, **Complete KYC** opens the same signed form used on the home page.

The investor page does not change the price, withdraw tokens, or deploy anything. Those actions belong to admin and to Tools.

## The Tools panel

**Tools** in the header opens a panel over the home page. It is a set of contract commands, each with a plus button that opens its own form.

Everyone who can open the panel sees three commands:

| Command | What it does |
| --- | --- |
| Token transfer | Sends an ERC-20 from the connected wallet. The form asks for the token contract, the recipient, and the amount. |
| Transfer fund | Sends Sepolia ETH. The card shows the connected wallet's ETH balance. The form asks for a recipient and an amount. The sale contract's `transferEther` is used, and the ETH value travels with the transaction. |
| Donate fund | Sends Sepolia ETH to the owner through `transferToOwner`. |

When the connected wallet is the sale owner, three more commands appear:

| Command | What it does |
| --- | --- |
| Withdraw | Calls `withdrawAllTokens`. Every TBC still in the sale moves to the owner. This cannot be undone from the site. |
| Update token | Calls `updateToken` with a new ERC-20 address. Later buys use that token. |
| Update token price | Calls `updateTokenSalePrice`. The new price is in ETH per token. |

Each plus button closes the grid and opens the matching modal. MetaMask still has to confirm the transaction. Closing the panel does not send anything.

## The admin page

Route: `/admin`

### Who the admin is

The admin wallet is `0xb8528831179FC5906A08E61Af3249166794b81f2`. That is Atharv Chavan's wallet, the same address the site treats as owner in `context/constants.js`.

The check is exact and case-insensitive. The connected address must equal that wallet.

| Who is connected | What they see |
| --- | --- |
| Nobody | A single line: connect the admin wallet. The Admin button stays in the header so the owner can reach the page. |
| The admin wallet | The full dashboard: Overview, Analytics, and Manage. |
| Any other wallet | One line: **You are not the admin.** No balances, no addresses, no forms. The Admin button disappears from the header, the mobile menu, and the footer. |

The sale contract also has an `owner` set to whoever deployed it. Manage actions such as price changes and withdraw still have to pass `onlyOwner` on the contract. The website gate and the contract gate are both required. A stranger who guesses the page URL still sees nothing, and a transaction from the wrong wallet would revert on chain even if the page were open.

The dashboard refreshes itself. The interval menu offers 5 seconds, 10 seconds, 30 seconds, and 1 minute. **Refresh Now** reads the contract immediately.

### Overview

Overview is the identity of the round.

- Owner address stored on the contract
- Wallet connected in the browser
- Token contract address
- Token symbol
- Admin wallet's Sepolia ETH balance
- Total supply, tokens sold, and tokens still in the sale
- A bar for how much of the supply has sold
- Token price in ETH, the live ETH/USD quote, and the token price in USD

If the sale has no token address yet, a warning points at the Manage tab.

### Analytics

Analytics turns those same numbers into money and into buyers.

- Total raised, in USD and in ETH (`sold × price`)
- Value of the tokens still in the sale
- Sale completion, as a percent and as `sold / supply`
- Average price per token in USD
- ETH balance available to the owner wallet
- Participant count: unique addresses that received TBC from the sale, read from recent Sepolia transfer logs
- A short written summary of remaining, sold, price, raised, and participants
- Recent buyer addresses when the log query returns some

The figures stay inside their cards. ETH amounts are shown to four decimal places so a long balance cannot spill into the next card.

### Manage

Manage is where the admin changes the contract. Every button waits for a MetaMask confirmation on Sepolia.

| Card | Contract call | Effect |
| --- | --- | --- |
| Update Token Price | `updateTokenSalePrice` | Sets a new ETH price. The current price is printed under the field. |
| Update Token Address | `updateToken` | Points the sale at a different ERC-20. The current address is shown on its own line. |
| Set Token & Sale Price | both of the above | Writes the token and the price together. |
| Withdraw All Tokens | `withdrawAllTokens` | Sends every TBC held by the sale to the owner. The card warns that this cannot be undone. |
| Send ETH | `transferEther` | Pays a recipient from the value attached to the transaction. |
| Transfer ERC20 | token `transfer` | Moves an ERC-20 from the admin wallet, using that token's own contract address. |
| Donate to Owner | `transferToOwner` | Sends a support amount to the owner. |
| Add ICO Token | `wallet_watchAsset` | Adds the current TBC address to MetaMask. |

## How the files work together

```
pages/                 Routes
  index.js             Home. Opens KYC, the buy modal, and Tools.
  investor.js          Investor desk.
  admin.js             Admin gate and the three tabs.
  _app.js              Sepolia chain, RainbowKit, and the sale provider.
  _document.js         Favicon.

Components/            What each route draws
  Header.jsx           Nav. Hides Admin for a non-admin wallet.
  Hero.jsx             Price, deploy, connect, KYC, buy, faucet.
  Progress.jsx         Sold / left / filled bar.
  Token.jsx            Tokenomics chart.
  TokenInfo.jsx        Sale figure cards.
  KYC.jsx              Identity form and wallet signature.
  Popup.jsx            Buy modal. Sends the buyer back to KYC if needed.
  Owner.jsx            Tools grid.
  TransferToken.jsx    ERC-20 send form.
  TransferCurrency.jsx ETH send form.
  Donate.jsx           Donate form.
  UpdateAddress.jsx    New token address.
  UpdatePrice.jsx      New sale price.
  Team.jsx             The four people on the sale.
  Footer.jsx           Links. Admin link follows the same wallet rule.

context/
  index.js             The provider. Reads the sale, buys, deploys, and blocks the wrong network.
  constants.js         ABIs, the admin address, and isAdminWallet().
  saleArtifacts.json   Compiled token and sale bytecode used by Deploy sale.
  TokenICO.json        ABI used to read and call an already deployed sale.
  ERC20.json           ABI used for token transfers and balances.

contracts/
  SaleToken.sol        TBC. 10,000,000 minted to the deployer.
  TokenICO.sol         The sale: buy, price, withdraw, ETH forward.
  ERC20.sol            Older token source. The deploy path uses SaleToken.sol.

scripts/compile-sale.js
                       Runs solc and writes context/saleArtifacts.json.

Utils/kyc.js           Saves and reads the signed KYC record. Rejects a raw "true".

styles/                globals.css plus polish.css, which loads last.
public/                Logo, favicon, images, and the older stylesheet.
```

A page never talks to Sepolia by itself. It calls functions on `TOKEN_ICO_Context`:

- `TOKEN_ICO` reads owner, price, sold amount, and token details.
- `BUY_TOKEN` checks the network, then sends `buyToken`.
- `DEPLOY_SALE` deploys both contracts and funds the sale, then stores `{ token, ico, owner }` in `localStorage` under `sepolia-sale`.
- `UPDATE_TOKEN`, `UPDATE_TOKEN_PRICE`, and `TOKEN_WITHDRAW` are the admin writes.
- `TRANSFER_ETHER`, `TRANSFER_TOKEN`, and `DONATE` are the Tools writes.

`ensureTestnet` runs before those writes. If the wallet is not on chain id `11155111`, the site asks MetaMask to switch and tells the user not to spend real ETH.

After a successful deploy, the next read uses the ICO address from `sepolia-sale` instead of any older address. That record lives in the browser that deployed. Another computer does not see it until the same record is present there.

## Run it

```bash
git clone https://github.com/AtharvChavan10/Web3-ICO-Token-Platform.git
cd Web3-ICO-Token-Platform
npm install
npm run dev
```

Open http://localhost:3000.

| Command | What it does |
| --- | --- |
| `npm run dev` | Local site with reload |
| `npm run build` | Production build |
| `npm start` | Serve that build |
| `npm run lint` | Lint |
| `node scripts/compile-sale.js` | Rebuild `context/saleArtifacts.json` after a contract edit |

No `.env` private key is required. Deploy and buy are signed by MetaMask.

## First-time path for the admin

1. Install MetaMask and create or import the admin wallet.
2. Switch that wallet to Sepolia.
3. Use **Get test ETH** and wait for the faucet transfer.
4. Connect on the home page.
5. Click **Deploy sale** and approve the token, the sale at 0.001 ETH, and the 1,000,000 TBC funding transfer.
6. The page reloads. The progress bar should say **Live round**.
7. Open `/admin`. Overview should list this wallet as owner.

A buyer then connects their own wallet, completes KYC, and buys. Their TBC shows on the investor desk after the transaction confirms.

## Authors

Atharv Chavan, founder and admin  
Aaditya Yadav  
Nikhil Parande  
Chaitanya Naik  

## License

MIT. See [LICENSE](LICENSE).

This sale is a Sepolia demonstration. Faucet ETH has no cash value. Do not aim these contracts at mainnet without an audit.
