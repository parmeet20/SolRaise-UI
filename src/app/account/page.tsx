"use client";
import  CampaignCard  from "@/components/shared/CampaignCard";
import { fetchUserCampaigns, getProvider } from "@/services/blockchain";
import { Campaign } from "@/utils/interface";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useMemo, useState } from "react";

const MyCampaignsPage = () => {
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const program = useMemo(
    () => getProvider(publicKey, signTransaction, sendTransaction),
    [publicKey, sendTransaction, signTransaction]
  );
  const fet = async () => {
    if (program && publicKey) {
      const cpns = await fetchUserCampaigns(program, publicKey);
      setCampaigns(cpns);
    }
  };
  useEffect(() => {
    fet();
  }, [publicKey]);
  return (
    <div className="flex flex-col space-y-6 pt-28">
      <div className="font-extrabold text-2xl text-center">My Campaigns</div>
      <div className="flex p-10 flex-wrap gap-4">
        {campaigns.map((item) => (
          <CampaignCard
          publicKey={item.publicKey}
            key={item.cid}
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
            goal={item.goal}
            amountRaised={item.amountRaised}
          />
        ))}
      </div>
    </div>
  );
};

export default MyCampaignsPage;
