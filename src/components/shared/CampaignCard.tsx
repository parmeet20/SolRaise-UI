import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface CampaignProps {
  title: string;
  description: string;
  imageUrl: string;
  goal: number;
  amountRaised: number;
  publicKey: string;
}

const CampaignCard = (campaign: CampaignProps) =>{
  const progress = (campaign.amountRaised / campaign.goal) * 100;

  return (
    <Card className="w-[350px] overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="relative">
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-sm">
          🌱 Active
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold mb-2 line-clamp-2">
          {campaign.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {campaign.description}
        </p>

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Raised</p>
              <p className="font-semibold">{campaign.amountRaised} SOL</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-muted-foreground">Goal</p>
              <p className="font-semibold">
                {campaign.goal.toLocaleString()} SOL
              </p>
            </div>
          </div>

          <Progress value={progress} className="h-2" />

          <Link href={`/campaigns/${campaign.publicKey}`}>
            <Button className="w-full mt-4">View Details</Button>
            </Link>
        </div>
      </div>
    </Card>
  );
}
export default CampaignCard;