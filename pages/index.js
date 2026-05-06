import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { useAccount, useEnsName } from "wagmi";

import {
  Footer,
  Header,
  About,
  Brand,
  Contact,
  Faq,
  Features,
  Hero,
  Loader,
  Progress,
  SideBar,
  Token,
  TokenInfo,
  Roadmap,
  KYC,
  Popup,
  TransferToken,
  Owner,
  TransferCurrency,
  Donate,
  UpdateAddress,
  UpdatePrice,
} from "../Components/index";
import { TOKEN_ICO_Context } from "../context/index";
import { shortenAddress } from "../Utils/index";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../context/constants";

const index = () => {
  const {
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
  } = useContext(TOKEN_ICO_Context);

  const [ownerModel, setOwnerModel] = useState(false);
  const [buyModel, setBuyModel] = useState(false);
  const [transferModel, setTransferModel] = useState(false);
  const [transferCurrency, setTransferCurrency] = useState(false);
  const [openDonate, setOpenDonate] = useState(false);
  const [openUpdatePrice, setOpenUpdatePrice] = useState(false);
  const [openUpdateAddress, setOpenUpdateAddress] = useState(false);
  const [kycModel, setKycModel] = useState(false);
  const [detail, setDetail] = useState();

  const closeAllModals = () => {
    setOwnerModel(false);
    setBuyModel(false);
    setTransferModel(false);
    setTransferCurrency(false);
    setOpenDonate(false);
    setOpenUpdatePrice(false);
    setOpenUpdateAddress(false);
    setKycModel(false);
  };

  const openTools = () => {
    // If tools is already open, close it. Otherwise ensure only tools is open.
    if (ownerModel) {
      setOwnerModel(false);
      return;
    }
    closeAllModals();
    setOwnerModel(true);
  };

  const backToTools = () => {
    closeAllModals();
    setOwnerModel(true);
  };

  const openKyc = () => {
    if (!account) {
      toast.error("Connect your wallet to start verification");
      return;
    }

    setKycModel(true);
  };

  const openAdmin = () => {
    window.location.href = "/admin";
  };
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      // TOKEN_ICO() may return undefined briefly while clients initialize.
      // Retry a few times so UI doesn't get stuck on "Loading...".
      for (let attempt = 0; attempt < 8; attempt++) {
        const items = await TOKEN_ICO({ showLoader: false, toastOnError: false });
        if (cancelled) return;
        if (items) {
          setDetail(items);
          return;
        }
        await new Promise((r) => setTimeout(r, 750));
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [account]);

  return (
    <>
      <div className="body_wrap">
        {ownerModel && (
          <Owner
            setOwnerModel={setOwnerModel}
            currency={currency}
            detail={detail}
            account={account}
            setTransferModel={setTransferModel}
            setTransferCurrency={setTransferCurrency}
            setOpenDonate={setOpenDonate}
            TOKEN_WITHDRAW={TOKEN_WITHDRAW}
            setOpenUpdatePrice={setOpenUpdatePrice}
            setOpenUpdateAddress={setOpenUpdateAddress}
          />
        )}

        {buyModel && (
          <Popup
            setBuyModel={setBuyModel}
            BUY_TOKEN={BUY_TOKEN}
            currency={currency}
            detail={detail}
            account={account}
            ERC20={ERC20}
            TOKEN_ADDRESS={TOKEN_ADDRESS}
            setLoader={setLoader}
          />
        )}

        {transferModel && (
          <TransferToken
            setTransferModel={setTransferModel}
            TRANSFER_TOKEN={TRANSFER_TOKEN}
            ERC20={ERC20}
            setLoader={setLoader}
            onBack={backToTools}
          />
        )}

        {transferCurrency && (
          <TransferCurrency
            setTransferCurrency={setTransferCurrency}
            TRANSFER_ETHER={TRANSFER_ETHER}
            detail={detail}
            currency={currency}
            CHECK_ACCOUNT_BALANCE={CHECK_ACCOUNT_BALANCE}
            setLoader={setLoader}
            onBack={backToTools}
          />
        )}

        {openDonate && (
          <Donate
            detail={detail}
            currency={currency}
            setOpenDonate={setOpenDonate}
            DONATE={DONATE}
            onBack={backToTools}
          />
        )}

        {openUpdatePrice && (
          <UpdatePrice
            detail={detail}
            currency={currency}
            setOpenUpdatePrice={setOpenUpdatePrice}
            UPDATE_TOKEN_PRICE={UPDATE_TOKEN_PRICE}
            onBack={backToTools}
          />
        )}

        {openUpdateAddress && (
          <UpdateAddress
            detail={detail}
            currency={currency}
            setOpenUpdateAddress={setOpenUpdateAddress}
            UPDATE_TOKEN={UPDATE_TOKEN}
            ERC20={ERC20}
            setLoader={setLoader}
            onBack={backToTools}
          />
        )}

        {kycModel && (
          <KYC
            account={account}
            setKycVerified={setKycVerified}
            setKycModel={setKycModel}
          />
        )}

        {loader && <Loader />}

        <Header
          account={account}
          CONNECT_WALLET={CONNECT_WALLET}
          setAccount={setAccount}
          setLoader={setLoader}
          setOwnerModel={setOwnerModel}
          shortenAddress={shortenAddress}
          detail={detail}
          currency={currency}
          ownerModel={ownerModel}
          kycVerified={kycVerified}
          setKycModel={setKycModel}
          openAdmin={openAdmin}
          openTools={openTools}
        />
        {/* <Profile /> */}
        <SideBar setOwnerModel={setOwnerModel} ownerModel={ownerModel} openTools={openTools} />
        <Hero
          setBuyModel={setBuyModel}
          account={account}
          CONNECT_WALLET={CONNECT_WALLET}
          setAccount={setAccount}
          setLoader={setLoader}
          detail={detail}
          addtokenToMetaMask={addtokenToMetaMask}
          setKycModel={setKycModel}
          kycVerified={kycVerified}
        />
        <About />
        <Features />
        <Token />
        <TokenInfo detail={detail} currency={currency} />
        <Faq />
        <Contact />
        <Footer />

        <button
          className="kyc-fixed-btn"
          onClick={openKyc}
          title={kycVerified ? "KYC Verified" : "Open KYC verification"}
        >
          {kycVerified ? "KYC ✓" : "KYC"}
        </button>

       
      </div>
    </>
  );
};

export default index;
