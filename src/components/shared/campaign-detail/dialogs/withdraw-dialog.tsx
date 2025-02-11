"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Campaign } from "@/utils/interface";

interface DonateDialogProps {
  campaign: Campaign;
  withdrawAmount: number;
  setWithdrawAmount: (value: number) => void;
  handleWithdraw: () => void;
  disabled:boolean;
}

export const WithdrawDialog = ({ campaign, withdrawAmount, setWithdrawAmount, handleWithdraw, disabled }: DonateDialogProps) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="secondary" className="w-full" disabled={!campaign.active && disabled}>
        {disabled && campaign.balance === 0?"Already withdrawed all balance":"Withdraw Now"}
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Donate to {campaign.title}</DialogTitle>
        <DialogDescription>Enter the amount you would like to withdraw.</DialogDescription>
      </DialogHeader>
      <Input
        type="number"
        value={withdrawAmount}
        onChange={(e) => setWithdrawAmount(Number(e.target.value))}
        placeholder="Enter amount in SOL"
        className="mb-4"
      />
      <DialogFooter>
        <Button className="w-full" onClick={handleWithdraw}>
          Withdraw {withdrawAmount} SOL
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
