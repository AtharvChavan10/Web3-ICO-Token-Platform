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
  const [adminModal, setAdminModal] = useState(false);
  const [detail, setDetail] = useState();

  const openKyc = () => {
    if (!account) {
      toast.error("Connect your wallet to start verification");
      return;
    }

    setKycModel(true);
  };

  const openAdmin = () => {
    setAdminModal(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      const items = await TOKEN_ICO();
      setDetail(items);
    };
    fetchData();
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
          />
        )}

        {openDonate && (
          <Donate
            detail={detail}
            currency={currency}
            setOpenDonate={setOpenDonate}
            DONATE={DONATE}
          />
        )}

        {openUpdatePrice && (
          <UpdatePrice
            detail={detail}
            currency={currency}
            setOpenUpdatePrice={setOpenUpdatePrice}
            UPDATE_TOKEN_PRICE={UPDATE_TOKEN_PRICE}
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
          />
        )}

        {kycModel && (
          <KYC
            account={account}
            setKycVerified={setKycVerified}
            setKycModel={setKycModel}
          />
        )}

        {adminModal && (
          <div className="admin-login-modal">
            <div className="admin-login-content">
              <h2>Admin Access</h2>
              {!account ? (
                <div>
                  <p>Please connect your wallet to access admin features.</p>
                  <button onClick={() => setAdminModal(false)}>Close</button>
                </div>
              ) : detail && account.toLowerCase() === detail.owner ? (
                <div>
                  <p>Welcome, Admin! You have access to the dashboard.</p>
                  <button onClick={() => { setAdminModal(false); window.location.href = '/admin'; }}>Go to Dashboard</button>
                  <button onClick={() => setAdminModal(false)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <p>Access Denied: Only the contract owner can access admin features.</p>
                  <button onClick={() => setAdminModal(false)}>Close</button>
                </div>
              )}
            </div>
          </div>
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
        />
        {/* <Profile /> */}
        <SideBar setOwnerModel={setOwnerModel} ownerModel={ownerModel} />
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
