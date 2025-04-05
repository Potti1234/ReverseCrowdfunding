import React, { useState } from "react";
import { ethers } from "ethers";
import { useMyContract } from "../hooks/useMyContract";

const Vote: React.FC = () => {
  const [proposalId, setProposalId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVote = async () => {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = useMyContract(signer);

      const tx = await contract.vote(Number(proposalId));
      await tx.wait();
      alert("Vote cast successfully!");
    } catch (err) {
      console.error(err);
      alert("Voting failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-2">
      <input
        type="text"
        placeholder="Proposal ID"
        className="p-2 border rounded"
        value={proposalId}
        onChange={(e) => setProposalId(e.target.value)}
      />
      <button
        onClick={handleVote}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        {loading ? "Voting..." : "Vote"}
      </button>
    </div>
  );
};

export default Vote;
