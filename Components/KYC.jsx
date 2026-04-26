import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";

const KYC = ({ setKycVerified, setKycModel, account }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    idNumber: "",
    address: "",
  });

  const [uploads, setUploads] = useState({
    idFront: null,
    idBack: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files?.length) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploads((prev) => ({ ...prev, [name]: reader.result }));
    };
    reader.readAsDataURL(files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      formData.name &&
      formData.email &&
      formData.idNumber &&
      formData.address &&
      uploads.idFront &&
      uploads.idBack
    ) {
      setKycVerified(true);

      if (account) {
        localStorage.setItem(
          `kycVerified:${account.toLowerCase()}`,
          "true"
        );
      }

      toast.success("KYC Verification Successful!");
      setKycModel(false);
      return;
    }

    toast.error("Please complete all fields and upload ID images.");
  };

  return (
    <div className="kyc-modal">
      <div className="kyc-content">
        <button className="close-btn" onClick={() => setKycModel(false)}>
          <FaTimes />
        </button>
        <h2>KYC Verification</h2>
        <p>Please provide your details for identity verification.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>ID Number</label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>ID Front (photo)</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              name="idFront"
              onChange={handleFileChange}
              required
            />
            {uploads.idFront && (
              <img className="kyc-preview" src={uploads.idFront} alt="ID front" />
            )}
          </div>

          <div className="form-group">
            <label>ID Back (photo)</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              name="idBack"
              onChange={handleFileChange}
              required
            />
            {uploads.idBack && (
              <img className="kyc-preview" src={uploads.idBack} alt="ID back" />
            )}
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default KYC;
