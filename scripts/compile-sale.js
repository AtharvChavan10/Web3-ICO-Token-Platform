const fs = require("fs");
const path = require("path");
const solc = require("solc");

const root = path.join(__dirname, "..");
const read = (name) => fs.readFileSync(path.join(root, "contracts", name), "utf8");

const input = {
  language: "Solidity",
  sources: {
    "SaleToken.sol": { content: read("SaleToken.sol") },
    "TokenICO.sol": { content: read("TokenICO.sol") },
  },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
if (output.errors) {
  const fatal = output.errors.filter((error) => error.severity === "error");
  output.errors.forEach((error) => console.log(error.formattedMessage));
  if (fatal.length) process.exit(1);
}

const pick = (file, name) => {
  const contract = output.contracts[file][name];
  return {
    abi: contract.abi,
    bytecode: `0x${contract.evm.bytecode.object}`,
  };
};

const artifacts = {
  token: pick("SaleToken.sol", "SaleToken"),
  sale: pick("TokenICO.sol", "TokenICO"),
};

fs.writeFileSync(
  path.join(root, "context", "saleArtifacts.json"),
  JSON.stringify(artifacts)
);
console.log("token bytecode", artifacts.token.bytecode.length);
console.log("sale bytecode", artifacts.sale.bytecode.length);
