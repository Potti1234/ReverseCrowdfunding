// src/hooks/useMyContract.ts
import { useEffect, useMemo } from "react";
import { Contract, InterfaceAbi } from "ethers";
import { worldcoinProvider } from "../utils/worldcoinProvider";
import CrowdfundingContract from "../abi/CrowdfundingContract.json"; // Place your ABI here

const CONTRACT_ADDRESS = "0xDB611E19303debA0C967A6f293E23Fc5D9D58513";
const typedABI = CrowdfundingContract.abi as InterfaceAbi;

async function makeRpcCall() {
  const url =
    "https://lb.drpc.org/ogrpc?network=worldchain&dkey=AkHnJVhTzkP6n0E57Zc8PbwI5yCZElUR8Ji7KjrWkQAY";
  const data = {
    jsonrpc: "2.0",
    method: "REPLACE_ME_WITH_ACTUAL_METHOD",
    params: [],
    id: 1,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("RPC Response:", result);
  } catch (error) {
    console.error("Error making RPC call:", error);
  }
}

export const useMyContract = (signer: unknown | void) => {
  // Make the RPC call once when the component mounts or dependencies change
  useEffect(() => {
    makeRpcCall();
  }, []); // Empty dependency array to run only once on mount

  const contract = useMemo(() => {
    const provider = signer ? signer : worldcoinProvider;
    return new Contract(CONTRACT_ADDRESS, typedABI, worldcoinProvider);
  }, [signer]);

  return contract;
};
