"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
} from "@worldcoin/minikit-js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUpCircle, TrendingUp } from "lucide-react";

export const sendPayment = async (
  amount: number,
  setIsPaid: (isPaid: boolean) => void
) => {
  const payload: PayCommandInput = {
    reference: "temp-id",
    to: "0xBbdf79C82D1eD8E7996198A97C19DE8e69e80ef4", // Test address
    tokens: [
      {
        symbol: Tokens.USDCE,
        token_amount: tokenToDecimals(amount, Tokens.USDCE).toString(),
      },
    ],
    description: "Pay as you make wishes",
  };

  const { finalPayload } = await MiniKit.commandsAsync.pay(payload);

  if (finalPayload.status == "success") {
    console.log("Payment success");
    setIsPaid(true);
  }
};

export default function DashboardPage() {
  const [balance, setBalance] = useState(12500);
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const handleContribute = () => {
    const numericAmount = Number(amount);

    if (amount && !isNaN(Number(amount))) {
      setBalance(balance + Number(amount));
      setAmount("");
      setOpen(false);
    }
    if (!isPaid) {
      sendPayment(numericAmount, setIsPaid);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950">
        <CardHeader>
          <CardTitle className="text-lg">Community Fund</CardTitle>
          <CardDescription>
            Current balance available for funding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">
              ${(balance / 100).toFixed(2)}
            </div>
            <TrendingUp className="text-green-500" />
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full mt-4">Contribute</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Contribute to Fund</DialogTitle>
                <DialogDescription>
                  Add money to the community fund to support projects.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleContribute}>Contribute</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="text-lg font-medium">Recent Activity</h2>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                  <ArrowUpCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Contribution</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                  +$25.00
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                  <ArrowUpCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Contribution</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                  +$50.00
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
