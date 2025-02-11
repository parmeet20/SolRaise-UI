// components/campaign-detail/dialogs/donate-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Campaign } from "@/utils/interface";
import { Loader2 } from "lucide-react";

interface DonateDialogProps {
  campaign: Campaign;
  donationAmount: number;
  setDonationAmount: (value: number) => void;
  handleDonate: () => void;
  loading: boolean;
}

export const DonateDialog = ({
  campaign,
  donationAmount,
  loading,
  setDonationAmount,
  handleDonate,
}: DonateDialogProps) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button
        className="w-full hover:bg-primary/90 transition-colors"
        disabled={!campaign.active}
      >
        Contribute Now
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Donate to {campaign.title}</DialogTitle>
        <DialogDescription>
          Enter the amount you would like to donate.
        </DialogDescription>
      </DialogHeader>
      <Input
        type="number"
        value={donationAmount}
        onChange={(e) => setDonationAmount(Number(e.target.value))}
        placeholder="Enter amount in SOL"
        className="mb-4"
      />
      <DialogFooter>
        {loading ? (
          <Button disabled className="w-full">
            <Loader2 className="animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button className="w-full" onClick={handleDonate}>
            Donate {donationAmount} SOL
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
