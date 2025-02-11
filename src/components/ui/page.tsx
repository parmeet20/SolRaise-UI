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
} from "@/components/ui/dialog";
import { toast } from "@/app/hooks/use-toast";

export default function Home() {
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const [fee, setFee] = useState<number | string>(""); // Store input fee value
  const [isDialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility
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
        console.log(tx);
        toast({
          title: "Platform Fee Updated Successfully",
          action: (
            <a
              target="_blank"
              href={`https://explorer.solana.com/tx/${tx}/?cluster=devnet`}
            >
              Signature
            </a>
          ),
        });
        setDialogOpen(!isDialogOpen);
      } else {
        toast({
          title: "Platform fee Error",
          description: "should be less than or equal to 10%",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFee("");
    setDialogOpen(!isDialogOpen);
  };

  return (
    <div className="pt-28 bg-gray-50">
      {owner === publicKey?.toBase58().toString() && (
        <div className="text-center">
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="p-5" onClick={() => setDialogOpen(true)}>
                Update Withdraw Percent Fee
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogTitle>Set Withdrawal Fee</DialogTitle>
              <DialogDescription>
                Enter the new fee percentage for withdrawals.
              </DialogDescription>

              <input
                type="number"
                placeholder="Enter Fee Percentage"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                className="mt-2 w-full p-3 border rounded-md"
              />
              <div className="mt-4 flex justify-end space-x-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button disabled={loading} onClick={handleSetFee} className={`${loading?"animate-pulse":""}`}>{loading?"Set Fee":"Loading..."}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
      <div className="text-center m-5 rounded-2xl py-20 bg-gradient-to-r from-teal-500 to-violet-500 text-white">
        <h1 className="text-4xl font-bold mb-4">
          Support the Causes You Care About
        </h1>
        <p className="text-lg mb-6">
          Join a community of changemakers. Discover inspiring campaigns and
          make a difference today.
        </p>
        <Link href="/create">
          <Button className="p-5">Start a Campaign</Button>
        </Link>
      </div>

      {/* Featured Campaigns Section */}
      <div className="container mx-auto pt-12 px-6">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          Featured Campaigns
        </h2>

        {/* Campaign List Component */}
        <div className="py-12">
          <CampaignList />
        </div>
      </div>

      {/* Button to trigger the fee dialog */}
    </div>
  );
}
