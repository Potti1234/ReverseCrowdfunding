import React, { useState, useEffect } from "react";
import Web3 from "web3";
import CrowdfundingContractABI from '../abi/CrowdfundingContract.json';

const CONTRACT_ADDRESS = 0xDB611E19303debA0C967A6f293E23Fc5D9D58513; // Replace with your deployed address

//Sync Contribution with Smart Contract:

//given a deployed solidity smart contract address, we wishes to write the following interactions 
//to call that smart contract within world mini app: 
// A. after input the amount to contribute sync this contribution with smart contract
// B. after user vote, call vote function in smart contract 
// C. when create new wishes, call proposal function in smart contract 
// D. can retrieve data from smart contract by calling proposal function in smart contract


