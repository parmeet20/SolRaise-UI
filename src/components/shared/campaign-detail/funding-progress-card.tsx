"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SiSolana } from "react-icons/si";
import { formatToSol } from "@/heplers/helpers";
import { Campaign } from "@/utils/interface";
import { DonateDialog } from "./dialogs/donate-dialog";
import { WithdrawDialog } from "./dialogs/withdraw-dialog";
import { CloseCampaignDialog } from "./dialogs/close-campaign-dialog";
import { PublicKey } from "@solana/web3.js";

interface FundingProgressCardProps {
  campaign: Campaign;
  publicKey: PublicKey;
  handleDonate: () => void;
  handleWithdraw: () => void;
  handleCloseCampaign: () => void;
  donationAmount: number;
  withdrawAmount: number;
  setDonationAmount: (value: number) => void;
  setWithdrawAmount: (value: number) => void;
  showCloseDialog: boolean;
  setShowCloseDialog: (value: boolean) => void;
}

export const FundingProgressCard = ({
  campaign,
  publicKey,
  handleDonate,
  handleWithdraw,
  handleCloseCampaign,
  donationAmount,
  withdrawAmount,
  setDonationAmount,
  setWithdrawAmount,
  showCloseDialog,
  setShowCloseDialog,
}: FundingProgressCardProps) => {
  const progress = (campaign.amountRaised / campaign.goal) * 100;

  return (
    <Card className={`sticky top-32 ${campaign.creator === publicKey?.toBase58().toString()?"h-[400px]":"h-[300px]"}`}>
      <CardHeader>
        <CardTitle>Funding Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="flex items-center">
              <SiSolana className="mx-1" />
              {formatToSol(campaign.amountRaised)} raised
            </span>
            <span className="text-muted-foreground flex items-center">
              <SiSolana className="mx-1" />
              of {formatToSol(campaign.goal)}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Donors</span>
            <span className="text-muted-foreground">{campaign.donors}</span>
          </div>
          <div className="flex justify-between">
            <span>Withdrawals</span>
            <span className="text-muted-foreground">{campaign.withdrawals}</span>
          </div>
          <div className="flex justify-between">
            <span>Current Balance</span>
            <span className="text-muted-foreground flex items-center">
              <SiSolana className="mx-1" />
              {formatToSol(campaign.balance)}
            </span>
          </div>
        </div>

        <DonateDialog
          campaign={campaign}
          donationAmount={donationAmount}
          setDonationAmount={setDonationAmount}
          handleDonate={handleDonate}
        />

        {campaign.creator === publicKey?.toBase58().toString() && (
          <WithdrawDialog
            campaign={campaign}
            withdrawAmount={withdrawAmount}
            setWithdrawAmount={setWithdrawAmount}
            handleWithdraw={handleWithdraw}
            disabled = {progress===100}
          />
        )}

        {campaign.creator === publicKey?.toBase58().toString() && (
          <CloseCampaignDialog
            campaign={campaign}
            showCloseDialog={showCloseDialog}
            setShowCloseDialog={setShowCloseDialog}
            handleCloseCampaign={handleCloseCampaign}
          />
        )}
      </CardContent>
    </Card>
  );
};
