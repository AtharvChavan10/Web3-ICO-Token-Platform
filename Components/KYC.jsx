import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import { useSignMessage } from "wagmi";
import { shortenAddress } from "../Utils/index";
import { readKyc, saveKyc } from "../Utils/kyc";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ID_NUMBER = /^[A-Za-z0-9-]{4,32}$/;
const MAX_IMAGE = 4 * 1024 * 1024;

const emptyForm = {
  name: "",
  email: "",
  idNumber: "",
  address: "",
};

const KYC = ({ setKycVerified, setKycModel, account, CONNECT_WALLET }) => {
  const existing = account ? readKyc(account) : null;
  const [formData, setFormData] = useState(emptyForm);
  const [uploads, setUploads] = useState({ idFront: null, idBack: null });
  const [errors, setErrors] = useState({});
  const { signMessageAsync, isPending } = useSignMessage();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    const file = files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Upload a photo of the ID.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE) {
      toast.error("Each ID photo must be under 4 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploads((prev) => ({ ...prev, [name]: reader.result }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const next = {};
    const name = formData.name.trim();
    const email = formData.email.trim();
    const idNumber = formData.idNumber.trim();
    const residence = formData.address.trim();

    if (name.length < 3) next.name = "Enter the name on the ID.";
    if (!EMAIL.test(email)) next.email = "Enter a valid email.";
    if (!ID_NUMBER.test(idNumber)) next.idNumber = "Enter the ID number, 4 to 32 letters or digits.";
    if (residence.length < 8) next.address = "Enter the full address.";
    if (!uploads.idFront) next.idFront = "Add a photo of the front.";
    if (!uploads.idBack) next.idBack = "Add a photo of the back.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!account) {
      toast.error("Connect your wallet to authenticate.");
      CONNECT_WALLET?.();
      return;
    }

    if (!validate()) {
      toast.error("Finish every field before you sign.");
      return;
    }

    const message = [
      "ICO sale identity check",
      `Wallet: ${account}`,
      `Name: ${formData.name.trim()}`,
      `Email: ${formData.email.trim()}`,
      "I control this wallet and these details are mine.",
    ].join("\n");

    try {
      const signature = await signMessageAsync({ message });
      saveKyc(account, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        signedAt: new Date().toISOString(),
        signature,
      });
      setKycVerified(true);
      toast.success("Wallet authenticated. You can buy.");
      setKycModel(false);
    } catch (error) {
      const rejected = /reject|denied|cancel/i.test(error?.message || "");
      toast.error(rejected ? "Signature cancelled. KYC stays incomplete." : "The wallet did not sign. Try again.");
    }
  };

  return (
    <div className="kyc-modal" onClick={() => setKycModel(false)}>
      <div className="kyc-content" onClick={(event) => event.stopPropagation()}>
        <button className="close-btn" onClick={() => setKycModel(false)} type="button" aria-label="Close verification">
          <FaTimes />
        </button>
        <p className="kyc-kicker">Identity</p>
        <h2>Authenticate to buy</h2>

        {!account ? (
          <>
            <p>Connect the wallet that will buy the tokens. Verification is stored for that address only.</p>
            <button className="btn btn-primary" type="button" onClick={() => CONNECT_WALLET?.()}>
              Connect wallet
            </button>
          </>
        ) : existing ? (
          <>
            <p>
              {existing.name} is verified for {shortenAddress(account)}. This wallet can buy.
            </p>
            <p className="kyc-wallet">{account}</p>
            <button className="btn btn-primary" type="button" onClick={() => setKycModel(false)}>
              Continue
            </button>
          </>
        ) : (
          <>
            <p>
              Add your details, then sign a message in the wallet. The signature proves this address is yours.
            </p>
            <p className="kyc-wallet">{shortenAddress(account)}</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="kyc-name">Full name</label>
                <input id="kyc-name" name="name" value={formData.name} onChange={handleChange} autoComplete="name" />
                {errors.name && <small className="kyc-error">{errors.name}</small>}
              </div>
              <div className="form-group">
                <label htmlFor="kyc-email">Email</label>
                <input id="kyc-email" type="email" name="email" value={formData.email} onChange={handleChange} autoComplete="email" />
                {errors.email && <small className="kyc-error">{errors.email}</small>}
              </div>
              <div className="form-group">
                <label htmlFor="kyc-id">ID number</label>
                <input id="kyc-id" name="idNumber" value={formData.idNumber} onChange={handleChange} />
                {errors.idNumber && <small className="kyc-error">{errors.idNumber}</small>}
              </div>
              <div className="form-group">
                <label htmlFor="kyc-front">ID front</label>
                <input id="kyc-front" type="file" accept="image/*" name="idFront" onChange={handleFileChange} />
                {uploads.idFront && <img className="kyc-preview" src={uploads.idFront} alt="Front of ID" />}
                {errors.idFront && <small className="kyc-error">{errors.idFront}</small>}
              </div>
              <div className="form-group">
                <label htmlFor="kyc-back">ID back</label>
                <input id="kyc-back" type="file" accept="image/*" name="idBack" onChange={handleFileChange} />
                {uploads.idBack && <img className="kyc-preview" src={uploads.idBack} alt="Back of ID" />}
                {errors.idBack && <small className="kyc-error">{errors.idBack}</small>}
              </div>
              <div className="form-group">
                <label htmlFor="kyc-address">Address</label>
                <textarea id="kyc-address" name="address" value={formData.address} onChange={handleChange} rows={3} />
                {errors.address && <small className="kyc-error">{errors.address}</small>}
              </div>
              <button className="btn btn-primary" type="submit" disabled={isPending}>
                {isPending ? "Waiting for wallet…" : "Sign and verify"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default KYC;
