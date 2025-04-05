import { redirect } from "next/navigation";
import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
} from "@worldcoin/minikit-js";

export default function Home() {
  redirect("/dashboard");
}

const sendPayment = async () => {
  const res = await fetch("/api/initiate-payment", {
    method: "POST",
  });
  const { id } = await res.json();

  const payload: PayCommandInput = {
    reference: id,
    to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // Test address
    tokens: [
      {
        symbol: Tokens.WLD,
        token_amount: tokenToDecimals(1, Tokens.WLD).toString(),
      },
      {
        symbol: Tokens.USDCE,
        token_amount: tokenToDecimals(3, Tokens.USDCE).toString(),
      },
    ],
    description: "Test example payment for minikit",
  };

  if (!MiniKit.isInstalled()) {
    return;
  }

  const { finalPayload } = await MiniKit.commandsAsync.pay(payload);

  if (finalPayload.status == "success") {
    const res = await fetch(`/api/confirm-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalPayload),
    });
    const payment = await res.json();
    if (payment.success) {
      // Congrats your payment was successful!
    }
  }
};
