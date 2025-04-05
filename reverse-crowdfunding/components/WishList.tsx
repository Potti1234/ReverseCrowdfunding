import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useMyContract } from "../hooks/useMyContract";

interface Proposal {
  title: string;
  description: string;
  voteCount: bigint;
}

const WishList: React.FC = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = useMyContract(signer);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const count: bigint = await contract.proposalCount();
        const items: Proposal[] = [];

        for (let i = 0; i < Number(count); i++) {
          const p = await contract.proposals(i);
          items.push({
            title: p.title,
            description: p.description,
            voteCount: p.voteCount,
          });
        }

        setProposals(items);
      } catch (err) {
        console.error("Failed to fetch proposals", err);
      }
    };

    fetchProposals();
  }, [contract]);

  return (
    <div className="p-4 space-y-4">
      {proposals.map((p, index) => (
        <div key={index} className="p-4 border rounded shadow">
          <h3 className="text-lg font-bold">{p.title}</h3>
          <p>{p.description}</p>
          <p className="text-sm text-gray-600">
            Votes: {p.voteCount.toString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default WishList;
