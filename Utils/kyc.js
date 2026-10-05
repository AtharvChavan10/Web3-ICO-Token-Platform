export const kycStorageKey = (address) => `kycVerified:${address.toLowerCase()}`;

export const readKyc = (address) => {
  if (!address || typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(kycStorageKey(address));
    if (!raw || raw === "true") return null;

    const record = JSON.parse(raw);
    const sameWallet = record?.address?.toLowerCase() === address.toLowerCase();
    if (record?.verified && record?.signature && sameWallet) return record;
  } catch (error) {
    return null;
  }

  return null;
};

export const saveKyc = (address, record) => {
  localStorage.setItem(
    kycStorageKey(address),
    JSON.stringify({
      verified: true,
      address: address.toLowerCase(),
      name: record.name,
      email: record.email,
      signedAt: record.signedAt,
      signature: record.signature,
    })
  );
};
