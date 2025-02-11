"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Campaign } from "@/utils/interface";

interface CloseCampaignDialogProps {
  campaign: Campaign;
  showCloseDialog: boolean;
  setShowCloseDialog: (value: boolean) => void;
  handleCloseCampaign: () => void;
  loading:boolean;
}

export const CloseCampaignDialog = ({
  campaign,
  showCloseDialog,
  setShowCloseDialog,
  handleCloseCampaign,
  loading
}: CloseCampaignDialogProps) => (
  <Dialog open={showCloseDialog} onOpenChange={(open) => setShowCloseDialog(open)}>
    <DialogTrigger asChild>
      <Button
        className="w-full"
        variant="destructive"
        onClick={() => setShowCloseDialog(true)}
        disabled={!campaign.active}
      >
        {!campaign.active ? "Campaign already closed" : "Close Campaign"}
      </Button>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure you want to close this campaign?</DialogTitle>
        <DialogDescription>
          Once you close this campaign, no further donations or withdrawals will be possible.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button variant="secondary" onClick={() => setShowCloseDialog(false)}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          className={`w-full ${loading ? "animate-pulse" : ""}`}
          disabled={loading}
          onClick={() => {
            handleCloseCampaign(); // Trigger close campaign function
            setShowCloseDialog(false); // Close the dialog
          }}
        >
          {!loading?"Yes, Close Campaign":"Loading..."}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
