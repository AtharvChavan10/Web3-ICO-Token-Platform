# 🚀 Deployment Guide

Complete guide for deploying the Web3 ICO Token Platform to production.

---

## 📋 Pre-Deployment Checklist

- [ ] All smart contracts audited and tested
- [ ] Environment variables configured
- [ ] Frontend builds successfully without errors
- [ ] All tests passing
- [ ] Security review completed
- [ ] Database backups configured
- [ ] Monitoring setup ready
- [ ] Legal compliance verified

---

## 🔧 Smart Contract Deployment

### 1. Deploy to Ethereum Mainnet

```bash
# 1. Update hardhat config for mainnet
# 2. Set environment variables
export MAINNET_RPC_URL=your_infura_or_alchemy_url
export PRIVATE_KEY=your_deployment_wallet_private_key

# 3. Compile contracts
npx hardhat compile

# 4. Deploy
npx hardhat run scripts/deploy.js --network mainnet

# 5. Verify contracts
npx hardhat verify --network mainnet CONTRACT_ADDRESS "constructor args"
```

### 2. Update Contract Constants

Update `context/constants.js`:

```javascript
export const CONTRACT_ADDRESS = "0x..."; // MainNet Address
export const TOKEN_ADDRESS = "0x...";    // Token Address
```

---

## 🖥️ Frontend Deployment

### Option 1: Vercel (Recommended)

```bash
# 1. Connect GitHub repository to Vercel
# 2. Set environment variables in Vercel dashboard

# 3. Deploy
git push origin main
```

### Option 2: Traditional Hosting

```bash
# 1. Build project
npm run build

# 2. Upload to hosting service
# 3. Configure environment variables
# 4. Set up SSL certificate
# 5. Configure domain
```

---

## 📊 Environment Configuration

### Production `.env.production`

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/YOUR-API-KEY
FORMSPREE_ID=your_formspree_id
NEXT_PUBLIC_INFURA_ID=your_infura_id
```

---

## 🔐 Security Hardening

### 1. Enable Rate Limiting

```javascript
// pages/api/contact.js
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

export default limiter(async (req, res) => {
  // Handle request
});
```

### 2. Configure CSP Headers

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline';"
  },
];
```

---

## 📈 Monitoring & Analytics

### 1. Set Up Error Tracking

```bash
npm install @sentry/react @sentry/tracing
```

### 2. Configure Monitoring

```javascript
// pages/_app.js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
});
```

### 3. Analytics

```bash
npm install gtag
```

---

## 🔄 Continuous Integration/Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        run: npm run deploy
```

---

## 📞 Post-Deployment

### 1. Verification

- [ ] Website loads without errors
- [ ] Wallet connection works
- [ ] Can purchase tokens
- [ ] Transactions recorded on blockchain
- [ ] Contact form sends emails

### 2. Monitoring

- Monitor transaction volume
- Check error logs
- Monitor gas prices
- Track user engagement

### 3. Support

- Set up support email
- Configure error alerts
- Monitor performance metrics

---

## 🆘 Troubleshooting

### Contract not responding

```bash
# Check contract on Etherscan
# Verify contract address in constants.js
# Check RPC connection
```

### High gas fees

```bash
# Optimize contract code
# Use batch transactions
# Consider Layer 2 solutions
```

### Website performance issues

```bash
# Check with Lighthouse
# Optimize images
# Enable caching
# Use CDN
```

---

## 📚 Resources

- [Vercel Docs](https://vercel.com/docs)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethereum Mainnet Info](https://ethereum.org)
- [Security Best Practices](https://ethereum.org/en/developers/docs/security/)

---

## ✅ Rollback Plan

If issues arise after deployment:

1. Revert to previous version
2. Fix issues in development
3. Re-test thoroughly
4. Deploy again

---

**Last Updated**: 2024
**Status**: Production Ready
