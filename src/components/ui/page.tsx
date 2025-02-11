"use client";

import { useEffect, useState } from "react";
import CampaignList from "@/components/shared/CampaignList";
import { Button } from "@/components/ui/button";
import {
  getProvider,
  programOwner,
  updatePlatformFee,
} from "@/services/blockchain";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { toast } from "@/app/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const [fee, setFee] = useState<number | string>("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [owner, setOwner] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const program = useMemo(
    () => getProvider(publicKey, signTransaction, sendTransaction),
    [publicKey, sendTransaction, signTransaction]
  );

  useEffect(() => {
    if (program) {
      const p = async () => {
        const owner = await programOwner(program!);
        setOwner(owner);
      };
      p();
    }
  }, [program, publicKey]);

  const handleSetFee = async () => {
    try {
      setLoading(true);
      if (Number(fee) <= 10) {
        const tx = await updatePlatformFee(program!, publicKey!, Number(fee));
        toast({
          title: "Platform Fee Updated Successfully",
          action: (
            <a
              target="_blank"
              href={`https://explorer.solana.com/tx/${tx}/?cluster=devnet`}
              className="text-primary underline"
            >
              Signature
            </a>
          ),
        });
        setDialogOpen(false);
      } else {
        toast({
          title: "Platform fee Error",
          description: "Fee should be less than or equal to 10%",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 bg-background">
      {owner === publicKey?.toBase58().toString() && (
        <div className="text-center mb-8">
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-full">
                Update Platform Fee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Set Withdrawal Fee</DialogTitle>
                <DialogDescription>
                  Enter new fee percentage (max 10%)
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <Input
                  type="number"
                  placeholder="Fee percentage"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  min="0"
                  max="10"
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSetFee} disabled={loading}>
                  {loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {loading ? "Updating..." : "Update Fee"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <Card className="mx-6 mb-12 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="text-center p-12">
          <h1 className="text-4xl font-bold mb-6">
            Support the Causes You Care About
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join a community of changemakers. Discover inspiring campaigns and
            make a difference today.
          </p>
          <Link href="/create">
            <Button size="lg" className="rounded-full px-8">
              Start a Campaign
            </Button>
          </Link>
        </div>
      </Card>

      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Featured Campaigns
        </h2>
        <CampaignList />
      </div>
    </div>
  );
}