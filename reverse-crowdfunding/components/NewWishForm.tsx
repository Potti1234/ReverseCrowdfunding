import React, { useState } from "react";
import { ethers } from "ethers";
import { useMyContract } from "../hooks/useMyContract";

const NewWishForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePropose = async () => {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = useMyContract(signer);

      const tx = await contract.propose(title, description);
      await tx.wait();
      alert("Wish submitted!");
    } catch (err) {
      console.error(err);
      alert("Wish submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-2">
      <input
        type="text"
        placeholder="Wish Title"
        className="p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Wish Description"
        className="p-2 border rounded w-full"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        onClick={handlePropose}
        disabled={loading}
        className="px-4 py-2 bg-purple-600 text-white rounded"
      >
        {loading ? "Submitting..." : "Create Wish"}
      </button>
    </div>
  );
};

export default NewWishForm;
