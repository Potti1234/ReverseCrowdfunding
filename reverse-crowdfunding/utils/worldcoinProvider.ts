// src/utils/worldcoinProvider.ts
import { JsonRpcProvider } from "ethers";
export const WORLDCHAIN_RPC_URL = "https://rpc.worldchain.network";
export const worldcoinProvider = new JsonRpcProvider(WORLDCHAIN_RPC_URL);
