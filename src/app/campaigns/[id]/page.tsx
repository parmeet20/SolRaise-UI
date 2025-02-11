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
import { Loader2 } from "lucide-react";

export default function CampaignDetailPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [donationAmount, setDonationAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [donations, setDonations] = useState<Transaction[]>([]);
  const [withdrawTxs, setWithdrawTxs] = useState<Transaction[]>([]);
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const program = useMemo(
    () => getProvider(publicKey, signTransaction, sendTransaction),
    [publicKey, sendTransaction, signTransaction]
  );

  const fetchData = async () => {
    try {
      setInitialLoading(true);
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
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, program]);

  if (!campaign || !id)
    return <div className="pt-28 px-4 text-center">Campaign not found</div>;

  const handleDonate = async () => {
    try {
      setLoading(true);
      const tx = await dontateToCampaign(program!, publicKey!, campaign.publicKey, donationAmount);
      await fetchData();
      toast({
        title: "Donation success",
        action: (
          <a href={`https://explorer.solana.com/tx/${tx}/?cluster=devnet`} className="text-blue-500">
            View on Explorer
          </a>
        ),
      });
    } catch (error) {
      console.error(error);
      toast({ title: "Donation failed", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      const tx = await withdrawFromCampaigh(program!, campaign.publicKey, publicKey!, withdrawAmount);
      await fetchData();
      toast({
        title: "Withdrawal success",
        action: (
          <a href={`https://explorer.solana.com/tx/${tx}/?cluster=devnet`} className="text-blue-500">
            View on Explorer
          </a>
        ),
      });
    } catch (error) {
      console.error(error);
      toast({ title: "Withdrawal failed", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCampaign = async () => {
    try {
      setLoading(true);
      const tx = await closeCampaign(program!, publicKey!, campaign.publicKey);
      setShowCloseDialog(false);
      await fetchData();
      toast({
        title: "Campaign closed",
        action: (
          <a href={`https://explorer.solana.com/tx/${tx}/?cluster=devnet`} className="text-blue-500">
            View on Explorer
          </a>
        ),
      });
    } catch (error) {
      console.error(error);
      toast({ title: "Campaign closure failed", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Full-Screen Loading Overlay */}
      {initialLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-md z-50">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      )}

      <div className={`pt-28 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto ${loading ? "animate-pulse opacity-70" : ""}`}>
        {/* Campaign & Progress Card */}
        <div className="grid lg:grid-cols-3 gap-8">
          {initialLoading ? (
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          ) : (
            <CampaignDetails campaign={campaign} formattedDate={new Date(campaign.timestamp * 1000).toLocaleDateString()} />
          )}

          {initialLoading ? (
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          ) : (
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
            />
          )}
        </div>

        {/* Transactions Table */}
        <div className="mt-8 mb-12">
          <h2 className="text-xl font-semibold mb-4">Recent Donations</h2>
          {initialLoading ? (
            <div className="h-40 bg-gray-200 rounded-lg animate-pulse" />
          ) : (
            <TransactionTable txType="Donors" donations={donations} />
          )}

          <h2 className="text-xl font-semibold my-4">Recent Withdrawals</h2>
          {initialLoading ? (
            <div className="h-40 bg-gray-200 rounded-lg animate-pulse" />
          ) : (
            <TransactionTable txType="Withdrawals" donations={withdrawTxs} />
          )}
        </div>
      </div>
    </div>
  );
}
