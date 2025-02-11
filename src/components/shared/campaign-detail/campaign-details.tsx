// components/campaign-detail/campaign-details.tsx
"use client";

import { Campaign } from "@/utils/interface";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface CampaignDetailsProps {
  campaign: Campaign;
  formattedDate: string;
}

export const CampaignDetails = ({ campaign, formattedDate }: CampaignDetailsProps) => (
  <div className="lg:col-span-2 space-y-6">
    <AspectRatio ratio={16 / 9}>
      <img
        src={campaign.imageUrl}
        alt={campaign.title}
        className="rounded-lg object-cover w-full h-full"
      />
    </AspectRatio>

    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{campaign.title}</h1>
        <Badge variant={campaign.active ? "default" : "destructive"}>
          {campaign.active ? "Active" : "Ended"}
        </Badge>
      </div>

      <p className="text-muted-foreground">{campaign.description}</p>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Campaign Details</h2>
        <p className="text-muted-foreground">
          Created by: <span className="text-foreground">{campaign.creator}</span>
        </p>
        <p className="text-muted-foreground">
          Launch Date: <span className="text-foreground">{formattedDate}</span>
        </p>
      </div>
    </div>
  </div>
);