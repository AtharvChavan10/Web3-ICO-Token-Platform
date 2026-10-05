import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { parseEther, parseUnits } from "viem";
import saleArtifacts from "./saleArtifacts.json";
import toast from "react-hot-toast";
import { useAccount, useWalletClient, usePublicClient, useSwitchChain } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { readKyc } from "../Utils/kyc";

import {
  GET_BALANCE,
  CHECK_ACCOUNT_BALANCE,
  ERC20,
  ERC20_CONTRACT,
  TOKEN_ADDRESS,
  addtokenToMetaMask,
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  ERC20_ABI,
} from "./constants";

export const TOKEN_ICO_Context = React.createContext();

export const TOKEN_ICO_Provider = ({ children }) => {
  const DAPP_NAME = "TOKEN ICO DAPP";
  const currency = "ETH";
  const network = "Sepolia";
  const SEPOLIA_ID = 11155111;

  const [loader, setLoader] = useState(false);
  const [account, setAccount] = useState();
  const [count, setCount] = useState(0);
  const [kycVerified, setKycVerified] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [deployed, setDeployed] = useState(null);

  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const publicClientRef = useRef(publicClient);
  publicClientRef.current = publicClient;
  const { openConnectModal } = useConnectModal();
  const { switchChainAsync } = useSwitchChain();

  const SEPOLIA_RPCS = [
    "https://ethereum-sepolia-rpc.publicnode.com",
    "https://1rpc.io/sepolia",
  ];

  let signer = null;
  if (walletClient) {
    const { account, chain, transport } = walletClient;
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new ethers.providers.Web3Provider(transport, network);
    signer = provider.getSigner(account.address);
  }

  const icoAddress = deployed?.ico || null;
  const activeToken = deployed?.token || TOKEN_ADDRESS;
  const contract = signer && icoAddress ? new ethers.Contract(icoAddress, CONTRACT_ABI, signer) : null;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sepolia-sale");
      if (saved) setDeployed(JSON.parse(saved));
    } catch (error) {
      setDeployed(null);
    }
  }, []);

  useEffect(() => {
    setAccount(address);

    if (!address) {
      setKycVerified(false);
      setTransactions([]);
      return;
    }

    setKycVerified(Boolean(readKyc(address)));

    // Load transaction history from localStorage
    const storedTx = localStorage.getItem(`transactions:${address.toLowerCase()}`);
    if (storedTx) {
      try {
        setTransactions(JSON.parse(storedTx));
      } catch (err) {
        setTransactions([]);
      }
    }
  }, [address]);

  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  const CONNECT_WALLET = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  //--- CONTRACT FUNCTION ---
  const withTimeout = (promise, ms = 7000) =>
    Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("RPC timeout")), ms)),
    ]);

  const readSaleSnapshot = async () => {
    const pull = async (reader) => {
      const contractOwner = await reader.owner();
      const soldTokens = await reader.soldTokens();
      const tokenAddress = await reader.tokenAddress();
      const tokenPrice = await reader.tokenSalePrice();
      let tokenDetails = null;
      if (tokenAddress && tokenAddress !== ethers.constants.AddressZero) {
        tokenDetails = await reader.getTokenDetails();
      }
      return { contractOwner, soldTokens, tokenAddress, tokenPrice, tokenDetails };
    };

    const ico = icoAddress;
    if (!ico) throw new Error("Sale is not deployed on Sepolia");

    const client = publicClientRef.current;
    if (client) {
      try {
        const reader = {
          owner: () =>
            client.readContract({ address: ico, abi: CONTRACT_ABI, functionName: "owner" }),
          soldTokens: () =>
            client.readContract({ address: ico, abi: CONTRACT_ABI, functionName: "soldTokens" }),
          tokenAddress: () =>
            client.readContract({ address: ico, abi: CONTRACT_ABI, functionName: "tokenAddress" }),
          tokenSalePrice: () =>
            client.readContract({ address: ico, abi: CONTRACT_ABI, functionName: "tokenSalePrice" }),
          getTokenDetails: () =>
            client.readContract({ address: ico, abi: CONTRACT_ABI, functionName: "getTokenDetails" }),
        };
        return await withTimeout(pull(reader), 8000);
      } catch (error) {
        console.log("public client sale read failed", error?.message || error);
      }
    }

    let lastError;
    for (const url of SEPOLIA_RPCS) {
      try {
        const provider = new ethers.providers.JsonRpcProvider({ url, timeout: 7000 });
        const reader = new ethers.Contract(ico, CONTRACT_ABI, provider);
        return await withTimeout(pull(reader), 8000);
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error("No Sepolia RPC responded");
  };

  const TOKEN_ICO = async (options = {}) => {
    const { showLoader = true, toastOnError = true } = options;
    try {
      if (showLoader) setLoader(true);
      // Read token details even without a connected wallet (public RPC).
      let tokenDetails;
      let contractOwner;
      let soldTokens;

      let tokenAddress = ethers.constants.AddressZero;
      let tokenPrice = 0;

      if (contract) {
        contractOwner = await contract.owner();
        soldTokens = await contract.soldTokens();
        tokenAddress = await contract.tokenAddress();
        tokenPrice = await contract.tokenSalePrice();
      } else {
        const snapshot = await readSaleSnapshot();
        contractOwner = snapshot.contractOwner;
        soldTokens = snapshot.soldTokens;
        tokenAddress = snapshot.tokenAddress;
        tokenPrice = snapshot.tokenPrice;
        tokenDetails = snapshot.tokenDetails;
      }

      if (
        !tokenDetails &&
        tokenAddress &&
        tokenAddress !== ethers.constants.AddressZero &&
        contract
      ) {
        tokenDetails = await contract.getTokenDetails();
      } else if (!tokenDetails) {
        tokenDetails = {
          name: "Not configured",
          symbol: "N/A",
          balance: ethers.BigNumber.from(0),
          supply: ethers.BigNumber.from(0),
          tokenPrice: tokenPrice,
          tokenAddr: tokenAddress,
        };
      }

      const rawBalance =
        address && publicClient
          ? await publicClient
              .getBalance({ address })
              .catch(() => ethers.BigNumber.from(0))
          : ethers.BigNumber.from(0);
      const ethBal = ethers.utils.formatEther(rawBalance ?? ethers.BigNumber.from(0));

      const safeBalance = tokenDetails?.balance ?? ethers.BigNumber.from(0);
      const safeSupply = tokenDetails?.supply ?? ethers.BigNumber.from(0);
      const safePrice = tokenDetails?.tokenPrice ?? ethers.BigNumber.from(0);

      const token = {
        tokenBal: ethers.utils.formatEther(safeBalance.toString()),
        name: tokenDetails?.name ?? "Unknown",
        symbol: tokenDetails?.symbol ?? "N/A",
        supply: ethers.utils.formatEther(safeSupply.toString()),
        tokenPrice: ethers.utils.formatEther(safePrice.toString()),
        tokenAddr: tokenDetails?.tokenAddr,
        maticBal: ethBal,
        address: address ? address.toLowerCase() : undefined,
        owner: contractOwner ? String(contractOwner).toLowerCase() : undefined,
        soldTokens:
          typeof soldTokens?.toNumber === "function"
            ? soldTokens.toNumber()
            : Number(soldTokens ?? 0),
      };
      if (showLoader) setLoader(false);
      return token;
    } catch (error) {
      console.log(error);
      if (toastOnError) notifyError("Sepolia did not return the sale. Check the wallet is on the testnet.");
      if (showLoader) setLoader(false);
      return {
        offline: true,
        tokenBal: "0",
        name: "Unavailable",
        symbol: "—",
        supply: "0",
        tokenPrice: "0",
        tokenAddr: activeToken,
        maticBal: "0",
        address: address ? address.toLowerCase() : undefined,
        owner: undefined,
        soldTokens: 0,
      };
    }
  };

  const saveTransaction = (txData) => {
    if (!address) return;
    const newTx = {
      id: Date.now(),
      hash: txData.hash,
      type: txData.type,
      amount: txData.amount,
      cost: txData.cost,
      status: txData.status,
      timestamp: new Date().toISOString(),
      gasUsed: txData.gasUsed || null,
      gasPrice: txData.gasPrice || null,
      confirmations: 0,
    };
    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    localStorage.setItem(
      `transactions:${address.toLowerCase()}`,
      JSON.stringify(updatedTxs)
    );
    return newTx;
  };

  const updateTransaction = (txId, updates) => {
    if (!address) return;
    const updatedTxs = transactions.map((tx) =>
      tx.id === txId ? { ...tx, ...updates } : tx
    );
    setTransactions(updatedTxs);
    localStorage.setItem(
      `transactions:${address.toLowerCase()}`,
      JSON.stringify(updatedTxs)
    );
  };

  const getEtherscanLink = (hash) => {
    return `https://sepolia.etherscan.io/tx/${hash}`;
  };

  const ensureTestnet = async () => {
    const active = walletClient?.chain?.id;
    if (active === SEPOLIA_ID) return true;
    try {
      await switchChainAsync({ chainId: SEPOLIA_ID });
      notifySuccess("Switched to Sepolia. Use faucet ETH, then try again.");
    } catch (error) {
      notifyError("Switch to Sepolia. This sale spends faucet ETH, not real ETH.");
    }
    return false;
  };

  const BUY_TOKEN = async (amount) => {
    try {
      if (!isConnected || !address) {
        notifyError("Please connect your wallet first");
        return;
      }

      if (!(await ensureTestnet())) return;

      if (!icoAddress || !contract) {
        notifyError("Deploy the sale on Sepolia first.");
        return;
      }

      if (!kycVerified) {
        notifyError("Please complete KYC verification before buying tokens.");
        setLoader(false);
        return;
      }

      setLoader(true);

      const tokenDetails = await contract.getTokenDetails();

      const availableTokens = Number(
        ethers.utils.formatEther(tokenDetails.balance.toString())
      );

      const amountNumber = Number(amount);
      if (!amountNumber || amountNumber <= 0) {
        notifyError("Enter a valid token amount to purchase.");
        setLoader(false);
        return;
      }

      if (availableTokens <= 0) {
        notifyError("No tokens are available for purchase at the moment.");
        setLoader(false);
        return;
      }

      if (amountNumber > availableTokens) {
        notifyError(
          `Only ${availableTokens} token(s) are available. Reduce your amount and try again.`
        );
        setLoader(false);
        return;
      }

      const tokenPrice = Number(
        ethers.utils.formatEther(tokenDetails.tokenPrice.toString())
      );
      const totalCost = tokenPrice * amountNumber;

      const payAmount = ethers.utils.parseUnits(totalCost.toString(), "ether");

      // Check wallet balance before sending the transaction
      const balance = await GET_BALANCE();
      const balanceBn = ethers.utils.parseUnits(balance.toString(), "ether");

      if (balanceBn.lt(payAmount)) {
        notifyError("Not enough Sepolia ETH. Get some from a faucet, then try again.");
        setLoader(false);
        return;
      }

      // Estimate gas
      let estimatedGas = ethers.BigNumber.from(8000000);
      try {
        estimatedGas = await contract.estimateGas.buyToken(amountNumber, {
          value: payAmount.toString(),
        });
      } catch (err) {
        console.log("Gas estimation failed, using default");
      }

      notifySuccess("Processing transaction...");

      const transaction = await contract.buyToken(amountNumber, {
        value: payAmount.toString(),
        gasLimit: estimatedGas.mul(120).div(100), // Add 20% buffer
      });

      // Save transaction with hash immediately
      const txRecord = saveTransaction({
        hash: transaction.hash,
        type: "BUY_TOKEN",
        amount: amountNumber,
        cost: totalCost,
        status: "pending",
      });

      // Show transaction link
      const txLink = getEtherscanLink(transaction.hash);
      notifySuccess(
        `TX Pending: ${transaction.hash.slice(0, 6)}...${transaction.hash.slice(-4)}`
      );

      // Wait for confirmation
      const receipt = await transaction.wait();

      // Update transaction status
      updateTransaction(txRecord.id, {
        status: "confirmed",
        gasUsed: receipt.gasUsed.toString(),
        gasPrice: receipt.effectiveGasPrice.toString(),
        confirmations: receipt.confirmations || 1,
      });

      setLoader(false);
      notifySuccess(
        `✅ Transaction Confirmed! Hash: ${transaction.hash.slice(0, 6)}...`
      );

      // Reload after a short delay
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.log(error);

      const errorMsg =
        error?.reason ||
        error?.data?.message ||
        error?.message ||
        "Transaction failed. Make sure your wallet has enough funds and try again.";

      const isInsufficientFunds = /insufficient funds/i.test(errorMsg);
      const missingContract = /revert|CALL_EXCEPTION|estimate gas|execution reverted/i.test(errorMsg);

      if (missingContract && !isInsufficientFunds) {
        notifyError("The sale contract is not on Sepolia. Faucet ETH is the right money, but this contract still points at the shut-down Holesky network.");
      } else if (isInsufficientFunds) {
        notifyError("Not enough Sepolia ETH. Get some from a faucet, then try again.");
      } else {
        notifyError(
          "Invalid transaction. Please check your wallet balance and try again."
        );
      }

      setLoader(false);
    }
  };

  const TOKEN_WITHDRAW = async () => {
    try {
      if (!isConnected || !address || !contract) {
        notifyError("Please connect your wallet first");
        return;
      }

      if (!(await ensureTestnet())) return;

      setLoader(true);

      const tokenDetails = await contract.getTokenDetails();

      const avaliableToken = ethers.utils.formatEther(
        tokenDetails.balance.toString()
      );

      if (avaliableToken > 1) {
        const transaction = await contract.withdrawAllTokens();

        await transaction.wait();
        setLoader(false);
        notifySuccess("Transaction completed successfully");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      notifyError("error try again later");
      setLoader(false);
    }
  };

  const UPDATE_TOKEN = async (_address) => {
    try {
      if (!isConnected || !address || !contract) {
        notifyError("Please connect your wallet first");
        return;
      }
      if (!(await ensureTestnet())) return;

      setLoader(true);

      const transaction = await contract.updateToken(_address);

      await transaction.wait();
      setLoader(false);
      notifySuccess("Transaction completed successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
      notifyError("error try again later");
      setLoader(false);
    }
  };

  const UPDATE_TOKEN_PRICE = async (price) => {
    try {
      if (!isConnected || !address || !contract) {
        notifyError("Please connect your wallet first");
        return;
      }
      if (!(await ensureTestnet())) return;

      setLoader(true);
      const payAmount = ethers.utils.parseUnits(price.toString(), "ether");

      const transaction = await contract.updateTokenSalePrice(payAmount);

      await transaction.wait();
      setLoader(false);
      notifySuccess("Transaction completed successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
      notifyError("error try again later");
      setLoader(false);
    }
  };

  const DONATE = async (AMOUNT) => {
    try {
      if (!isConnected || !address || !contract) {
        notifyError("Please connect your wallet first");
        return;
      }
      if (!(await ensureTestnet())) return;

      setLoader(true);
      const payAmount = ethers.utils.parseUnits(AMOUNT.toString(), "ether");

      const transaction = await contract.transferToOwner(payAmount, {
        value: payAmount.toString(),
        gasLimit: ethers.utils.hexlify(8000000),
      });

      await transaction.wait();
      setLoader(false);
      notifySuccess("Transaction completed successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
      notifyError("error try again later");
      setLoader(false);
    }
  };

  const TRANSFER_ETHER = async (transfer) => {
    try {
      if (!isConnected || !address || !contract) {
        notifyError("Please connect your wallet first");
        return;
      }
      if (!(await ensureTestnet())) return;

      setLoader(true);

      const { _receiver, _amount } = transfer;
      const payAmount = ethers.utils.parseUnits(_amount.toString(), "ether");

      const transaction = await contract.transferEther(_receiver, payAmount, {
        value: payAmount.toString(),
        gasLimit: ethers.utils.hexlify(8000000),
      });

      await transaction.wait();
      setLoader(false);
      notifySuccess("Transaction completed successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
      notifyError("error try again later");
      setLoader(false);
    }
  };

  const TRANSFER_TOKEN = async (token) => {
    try {
      if (!isConnected || !address || !signer) {
        notifyError("Please connect your wallet first");
        return;
      }
      if (!(await ensureTestnet())) return;

      setLoader(true);

      const erc20Contract = new ethers.Contract(token._tokenAddress, ERC20_ABI, signer);
      const amount = ethers.utils.parseUnits(token._amount, 18); // Assuming 18 decimals

      const transaction = await erc20Contract.transfer(token._sendTo, amount);
      await transaction.wait();

      setLoader(false);
      notifySuccess("Token transferred successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
      notifyError("Error transferring token");
      setLoader(false);
    }
  };

  const DEPLOY_SALE = async () => {
    if (!address || !walletClient) {
      notifyError("Connect the Sepolia wallet first");
      CONNECT_WALLET();
      return;
    }
    if (!(await ensureTestnet())) return;

    const client = publicClientRef.current;
    if (!client) {
      notifyError("Sepolia is still connecting. Try again in a moment.");
      return;
    }

    setLoader(true);
    try {
      notifySuccess("Confirm the token in MetaMask");
      const tokenHash = await walletClient.deployContract({
        abi: saleArtifacts.token.abi,
        bytecode: saleArtifacts.token.bytecode,
        account: address,
      });
      const tokenReceipt = await client.waitForTransactionReceipt({ hash: tokenHash });
      const token = tokenReceipt.contractAddress;
      if (!token) throw new Error("Token deploy failed");

      notifySuccess("Confirm the sale contract in MetaMask");
      const saleHash = await walletClient.deployContract({
        abi: saleArtifacts.sale.abi,
        bytecode: saleArtifacts.sale.bytecode,
        args: [token, parseEther("0.001")],
        account: address,
      });
      const saleReceipt = await client.waitForTransactionReceipt({ hash: saleHash });
      const ico = saleReceipt.contractAddress;
      if (!ico) throw new Error("Sale deploy failed");

      notifySuccess("Confirm sending 1,000,000 tokens into the sale");
      const fundHash = await walletClient.writeContract({
        address: token,
        abi: saleArtifacts.token.abi,
        functionName: "transfer",
        args: [ico, parseUnits("1000000", 18)],
        account: address,
      });
      await client.waitForTransactionReceipt({ hash: fundHash });

      const record = { token, ico, owner: address.toLowerCase() };
      localStorage.setItem("sepolia-sale", JSON.stringify(record));
      setDeployed(record);
      setLoader(false);
      notifySuccess("Sale is live on Sepolia at 0.001 ETH");
      setTimeout(() => window.location.reload(), 1200);
      return record;
    } catch (error) {
      console.log(error);
      setLoader(false);
      const message = error?.shortMessage || error?.message || "Deploy was cancelled";
      if (/insufficient funds/i.test(message)) {
        notifyError("Not enough Sepolia ETH. Use Get test ETH, then deploy again.");
      } else if (/reject|denied|cancel/i.test(message)) {
        notifyError("MetaMask cancelled the deploy. The sale is not live yet.");
      } else {
        notifyError(message);
      }
    }
  };

  const addDeployedToken = async () => {
    if (!window.ethereum) return "MetaMask is not installed";
    const token = activeToken;
    if (!deployed?.token) return "Deploy the sale before adding the token";
    try {
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: token,
            symbol: "TBC",
            decimals: 18,
          },
        },
      });
      return wasAdded ? "Token added!" : "Token not added";
    } catch (error) {
      console.log(error);
      return "failed to add";
    }
  };

  const GET_BALANCE = async () => {
    try {
      if (!isConnected || !signer) {
        return "0";
      }

      const maticBal = await signer.getBalance();
      return ethers.utils.formatEther(maticBal.toString());
    } catch (error) {
      console.log("GET_BALANCE failed:", error);
      return "0";
    }
  };

  return (
    <TOKEN_ICO_Context.Provider
      value={{
        TOKEN_ICO,
        BUY_TOKEN,
        TRANSFER_ETHER,
        DONATE,
        UPDATE_TOKEN,
        UPDATE_TOKEN_PRICE,
        TOKEN_WITHDRAW,
        TRANSFER_TOKEN,
        CONNECT_WALLET,
        ERC20,
        CHECK_ACCOUNT_BALANCE,
        setAccount,
        setLoader,
        addtokenToMetaMask: deployed?.token ? addDeployedToken : addtokenToMetaMask,
        DEPLOY_SALE,
        saleReady: Boolean(deployed?.ico),
        ICO_ADDRESS: icoAddress,
        TOKEN_ADDRESS: activeToken,
        loader,
        account,
        currency,
        kycVerified,
        setKycVerified,
        transactions,
        getEtherscanLink,
        updateTransaction,
      }}
    >
      {children}
    </TOKEN_ICO_Context.Provider>
  );
};