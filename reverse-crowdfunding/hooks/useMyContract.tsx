// src/hooks/useMyContract.ts
import { useMemo } from "react";
import { Contract, InterfaceAbi } from "ethers";
import { worldcoinProvider } from "../utils/worldcoinProvider";
import CrowdfundingContract from "../abi/CrowdfundingContract.json"; // Place your ABI here

const CONTRACT_ADDRESS = "0xDB611E19303debA0C967A6f293E23Fc5D9D58513";

const typedABI = CrowdfundingContract.abi as InterfaceAbi;

export const useMyContract = (signer: unknown | void) => {
  const contract = useMemo(() => {
    const provider = signer ? signer : worldcoinProvider;
    return new Contract(CONTRACT_ADDRESS, typedABI, worldcoinProvider);
  }, [signer]);

  return contract;
};