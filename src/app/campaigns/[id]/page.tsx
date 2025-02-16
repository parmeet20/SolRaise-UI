// app/campaign/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  closeCampaign,
  dontateToCampaign,
  fetchAllTransactions,
  fetchAllWithdrawTransactions,
  fetchCampaign,
  getProvider,
  withdrawFromCampaigh,
} from "@/services/blockchain";
import { Campaign, Transaction } from "@/utils/interface";
import { CampaignDetails } from "@/components/shared/campaign-detail/campaign-details";
import { FundingProgressCard } from "@/components/shared/campaign-detail/funding-progress-card";
import { TransactionTable } from "@/components/shared/campaign-detail/donation-table";
import { toast } from "@/app/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function CampaignDetailPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [donationAmount, setDonationAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [donations, setDonations] = useState<Transaction[]>([]);
  const [withdrawTxs, setWithdrawTxs] = useState<Transaction[]>([]);
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const program = useMemo(
    () => getProvider(publicKey, signTransaction, sendTransaction),
    [publicKey, sendTransaction, signTransaction]
  );

  const fetchData = async () => {
    try {
      setIsLoading(true); // Start loading
      if (id) {
        const campaignData = await fetchCampaign(program!, id.toString());
        setCampaign(campaignData);
        const transactions = await fetchAllTransactions(program!, id.toString());
        setDonations(transactions);
        const wTxs = await fetchAllWithdrawTransactions(program!, id.toString());
        setWithdrawTxs(wTxs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, program]);

  if (isLoading) {
    return (
      <div className="pt-28 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-8 w-[200px]" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[300px]" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[280px]" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-32 rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-10 w-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section Skeletons */}
        <div className="mt-12 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-[200px] w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-[200px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!campaign || !id)
    return <div className="pt-28 px-4 text-center">Campaign not found</div>;

  const formattedDate = new Date(
    campaign.timestamp * 1000
  ).toLocaleDateString();

  const handleDonate = async () => {
    try {
      setLoading(true);
      const tx = await dontateToCampaign(
        program!,
        publicKey!,
        campaign.publicKey,
        donationAmount
      );
      fetchData();
      toast({
        title: "Donation success",
        action: (
          <a href={`https://explorer.solana.com/tx/${tx}/?cluster=devnet`}>
            Signature
          </a>
        ),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      const tx = await withdrawFromCampaigh(
        program!,
        campaign.publicKey,
        publicKey!,
        withdrawAmount
      );
      fetchData();
      toast({
        title: "Withdraw success",
        action: (
          <a href={`https://explorer.solana.com/tx/${tx}/?cluster=devnet`}>
            Signature
          </a>
        ),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCampaign = async () => {
    try {
      setLoading(true);
      const tx = await closeCampaign(program!, publicKey!, campaign.publicKey);
      setShowCloseDialog(false);
      fetchData();
      toast({
        title: "Campaign closed successfully",
        action: (
          <a href={`https://explorer.solana.com/tx/${tx}/?cluster=devnet`}>
            Signature
          </a>
        ),
      });
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 px-4  md:px-8 lg:px-16 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        <CampaignDetails campaign={campaign} formattedDate={formattedDate} />

        <FundingProgressCard
          campaign={campaign}
          publicKey={publicKey!}
          handleDonate={handleDonate}
          handleWithdraw={handleWithdraw}
          handleCloseCampaign={handleCloseCampaign}
          donationAmount={donationAmount}
          withdrawAmount={withdrawAmount}
          setDonationAmount={setDonationAmount}
          setWithdrawAmount={setWithdrawAmount}
          showCloseDialog={showCloseDialog}
          setShowCloseDialog={setShowCloseDialog}
          loading={loading}
        />
      </div>

      <div className="mt-8 mb-12">
        <h2 className="text-xl font-semibold mb-4">Recent Donations</h2>
        <TransactionTable txType="Donors" donations={donations} />
        <h2 className="text-xl font-semibold my-4">Recent Withdrawls</h2>
        <TransactionTable txType="Withdrawals" donations={withdrawTxs} />
      </div>
    </div>
  );
}
