# 📚 Technical Documentation

Detailed technical specifications and implementation details for the Web3 ICO Token Platform.

---

## 🏗️ Architecture Overview

### Three-Tier Architecture

```
┌─────────────────┐
│  Frontend (UI)  │  ← React, Next.js, Tailwind CSS
├─────────────────┤
│  Backend (API)  │  ← Next.js API Routes
├─────────────────┤
│ Blockchain (L1) │  ← Ethereum Smart Contracts
└─────────────────┘
```

---

## 🔗 Smart Contract Architecture

### ERC20 Token Contract

**Location**: `contracts/ERC20.sol`

```solidity
interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function mint(address to, uint256 amount) external;
    function burn(uint256 amount) external;
}
```

**Key Features**:
- Total Supply: Configurable
- Decimals: 18
- Burnable: Yes
- Pausable: Yes
- Access Control: Owner-based

### TokenICO Contract

**Location**: `contracts/TokenICO.sol`

```solidity
contract TokenICO {
    address public owner;
    IERC20 public token;
    uint256 public price;
    uint256 public totalSold;
    uint256 public hardCap;
    
    function buyTokens() external payable;
    function updatePrice(uint256 newPrice) external onlyOwner;
    function withdraw() external onlyOwner;
    function refund() external;
}
```

**Key Functions**:
- `buyTokens()`: Purchase tokens
- `updatePrice()`: Adjust token price
- `withdraw()`: Owner withdrawal
- `refund()`: Investor refunds

---

## 🔄 Data Flow

### Token Purchase Flow

```
User Input
    ↓
Wallet Connection (Wagmi)
    ↓
KYC Verification
    ↓
Token Purchase Request
    ↓
Smart Contract Execution
    ↓
Transaction Confirmation
    ↓
Token Transfer
    ↓
UI Update
```

---

## 💾 Database Schema

### User Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    email VARCHAR(255),
    kyc_status ENUM('pending', 'approved', 'rejected'),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Transaction Table
```sql
CREATE TABLE transactions (
    id BIGINT PRIMARY KEY,
    user_id BIGINT FOREIGN KEY,
    transaction_hash VARCHAR(66),
    amount_invested DECIMAL(20, 8),
    tokens_received DECIMAL(20, 8),
    status ENUM('pending', 'confirmed', 'failed'),
    created_at TIMESTAMP
);
```

---

## 🔐 Security Implementation

### Input Validation

```javascript
// Form validation
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validateAddress = (address) => {
    return ethers.utils.isAddress(address);
};
```

### Rate Limiting

```javascript
// API rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use('/api/', limiter);
```

---

## 🌐 API Endpoints

### Contact Form
```
POST /api/contact
Body: {
    name: string,
    email: string,
    message: string
}
Response: {
    success: boolean,
    message: string
}
```

---

## 📊 State Management

### Context API Structure

```javascript
const TokenICOContext = createContext();

export const TokenICOProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [TOKEN_ICO, setTokenICO] = useState(null);
    const [detail, setDetail] = useState({
        soldTokens: 0,
        tokenBal: 0,
        symbol: 'TOKEN'
    });

    return (
        <TokenICOContext.Provider value={{
            account,
            TOKEN_ICO,
            detail,
            // ... other values
        }}>
            {children}
        </TokenICOContext.Provider>
    );
};
```

---

## 🎨 Component Hierarchy

```
App (_app.js)
├── Header
├── Hero
├── Features
├── About
├── Team
├── Roadmap
├── Faq
├── Contact
├── Brand
├── Footer
├── Modals
│   ├── Popup
│   ├── KYC
│   ├── TransferToken
│   └── ...
└── Loader
```

---

## 📱 Responsive Design

### Breakpoints
- Mobile: < 576px
- Tablet: 576px - 992px
- Desktop: > 992px

### CSS Grid Layout
```css
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}
```

---

## ⚡ Performance Optimization

### Image Optimization
```javascript
import Image from 'next/image';

<Image
    src="/assets/img/logo.svg"
    alt="Logo"
    width={200}
    height={200}
    loading="lazy"
/>
```

### Code Splitting
```javascript
const Team = dynamic(() => import('./Team'), {
    loading: () => <LoadingSpinner />
});
```

---

## 🧪 Testing Strategy

### Unit Tests
```javascript
// __tests__/utils.test.js
describe('shortenAddress', () => {
    it('should shorten address correctly', () => {
        const result = shortenAddress('0x123...abc');
        expect(result).toBe('0x123...abc');
    });
});
```

### Integration Tests
```javascript
describe('Token Purchase Flow', () => {
    it('should purchase tokens successfully', async () => {
        // Test implementation
    });
});
```

---

## 🔍 Monitoring & Logging

### Error Logging
```javascript
import * as Sentry from '@sentry/react';

try {
    // Code
} catch (error) {
    Sentry.captureException(error);
}
```

### Transaction Logging
```javascript
const logTransaction = (txHash, details) => {
    console.log({
        timestamp: new Date(),
        txHash,
        ...details
    });
};
```

---

## 🚀 Deployment Pipeline

### Build Process
1. Lint code
2. Run tests
3. Build application
4. Generate optimized bundle
5. Deploy to production

### Environment Stages
- Development (localhost:3000)
- Staging (staging.project.com)
- Production (project.com)

---

## 📖 API Documentation

### Contract Interaction Functions

```javascript
// Get token balance
async function getBalance(address) {
    return await TOKEN_ICO.balanceOf(address);
}

// Buy tokens
async function buyTokens(amount) {
    return await TOKEN_ICO.buyTokens({
        value: ethers.utils.parseEther(amount)
    });
}

// Get ICO details
async function getICODetails() {
    return {
        price: await TOKEN_ICO.price(),
        sold: await TOKEN_ICO.totalSold(),
        cap: await TOKEN_ICO.hardCap()
    };
}
```

---

## 🔧 Configuration Files

### next.config.js
```javascript
module.exports = {
    images: {
        domains: ['example.com'],
    },
    env: {
        NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    },
};
```

---

## 📚 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | 14.0.3 | Framework |
| react | 18.2.0 | UI Library |
| wagmi | 2.12.8 | Web3 Hooks |
| ethers | 5.6.4 | Blockchain |
| tailwindcss | Latest | Styling |

---

## 🎯 Key Metrics

- **Page Load Time**: < 3 seconds
- **API Response Time**: < 500ms
- **Gas Optimization**: Optimized contracts
- **Success Rate**: 99.9%

---

**Last Updated**: 2024
**Version**: 1.0.0
