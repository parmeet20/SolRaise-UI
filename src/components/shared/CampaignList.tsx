"use client";
import React, { useEffect, useMemo, useState } from "react";
const CampaignCard = dynamic(() => import("./CampaignCard"));
import { fetchActiveCampaigns, getProvider } from "@/services/blockchain";
import { useWallet } from "@solana/wallet-adapter-react";
import { Campaign } from "@/utils/interface";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";

const CampaignList = () => {
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const program = useMemo(
    () => getProvider(publicKey, signTransaction, sendTransaction),
    [publicKey, sendTransaction, signTransaction]
  );
  const fet = async () => {
    setCampaigns(await fetchActiveCampaigns(program!));
  };

  useEffect(() => {
    if (publicKey) {
      fet();
    }
  }, [program]);

  return (
    <div>
      {!publicKey && <p className="text-slate-600 font-mono font-extrabold">Login to view campaigns</p>}
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

export default CampaignList;
