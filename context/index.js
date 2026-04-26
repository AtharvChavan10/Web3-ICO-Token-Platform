import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

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
  const network = "Holesky";

  const [loader, setLoader] = useState(false);
  const [account, setAccount] = useState();
  const [count, setCount] = useState(0);
  const [kycVerified, setKycVerified] = useState(false);

  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { openConnectModal } = useConnectModal();

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

  const contract = signer ? new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer) : null;

  useEffect(() => {
    setAccount(address);

    if (!address) {
      setKycVerified(false);
      return;
    }

    const verified =
      localStorage.getItem(`kycVerified:${address.toLowerCase()}`) === "true";
    setKycVerified(verified);
  }, [address]);

  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  const CONNECT_WALLET = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  //--- CONTRACT FUNCTION ---
  const TOKEN_ICO = async () => {
    try {
      if (!isConnected || !address || !contract) {
        console.log("Wallet not connected");
        return;
      }

      setLoader(true);

      const tokenDetails = await contract.getTokenDetails();
      const contractOwner = await contract.owner();
      const soldTokens = await contract.soldTokens();

      const ethBal = await GET_BALANCE();

      const token = {
        tokenBal: ethers.utils.formatEther(tokenDetails.balance.toString()),
        name: tokenDetails.name,
        symbol: tokenDetails.symbol,
        supply: ethers.utils.formatEther(tokenDetails.supply.toString()),
        tokenPrice: ethers.utils.formatEther(
          tokenDetails.tokenPrice.toString()
        ),
        tokenAddr: tokenDetails.tokenAddr,
        maticBal: ethBal,
        address: address.toLowerCase(),
        owner: contractOwner.toLowerCase(),
        soldTokens: soldTokens.toNumber(),
      };
      setLoader(false);
      return token;
    } catch (error) {
      console.log(error);
      notifyError("error try again later");
      setLoader(false);
    }
  };

  const BUY_TOKEN = async (amount) => {
    try {
      if (!isConnected || !address || !contract) {
        notifyError("Please connect your wallet first");
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
        notifyError(
          "Insufficient ETH balance. Please fund your wallet to complete the purchase."
        );
        setLoader(false);
        return;
      }

      const transaction = await contract.buyToken(amountNumber, {
        value: payAmount.toString(),
        gasLimit: ethers.utils.hexlify(8000000),
      });

      await transaction.wait();
      setLoader(false);
      notifySuccess("Transaction completed successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);

      const errorMsg =
        error?.reason ||
        error?.data?.message ||
        error?.message ||
        "Transaction failed. Make sure your wallet has enough funds and try again.";

      const isInsufficientFunds = /insufficient funds/i.test(errorMsg);

      if (isInsufficientFunds) {
        notifyError(
          "Insufficient ETH balance. Please fund your wallet to complete the purchase."
        );
      } else {
        notifyError(errorMsg);
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
        addtokenToMetaMask,
        TOKEN_ADDRESS,
        loader,
        account,
        currency,
        kycVerified,
        setKycVerified,
      }}
    >
      {children}
    </TOKEN_ICO_Context.Provider>
  );
};
