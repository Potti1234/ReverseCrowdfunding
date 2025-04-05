import React, { useState } from "react";
import { ethers } from "ethers";
import { useMyContract } from "../hooks/useMyContract";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const ContributeForm: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContribute = async () => {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = useMyContract(signer);

      const tx = await contract.contribute({
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      alert("Contribution successful!");
    } catch (err) {
      console.error(err);
      alert("Contribution failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-2">
      <input
        type="text"
        placeholder="Amount in ETH"
        className="p-2 border rounded"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        onClick={handleContribute}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Contributing..." : "Contribute"}
      </button>
    </div>
  );
};

export default ContributeForm;
