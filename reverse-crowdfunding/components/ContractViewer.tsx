// src/components/ContractViewer.tsx
import React, { useEffect, useState } from "react";
import { useMyContract } from "../hooks/useMyContract";
import { ethers } from "ethers";

const ContractViewer: React.FC = async () => {
  const [loading, setLoading] = useState(false);
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = useMyContract(signer);

  const [value, setValue] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await contract.myPublicGetter(); // Replace with actual method
        setValue(result.toString());
      } catch (error) {
        console.error("Failed to fetch contract data:", error);
      }
    };

    fetchData();
  }, [contract]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Contract Value</h2>
      <p>{value}</p>
    </div>
  );
};

export default ContractViewer;
