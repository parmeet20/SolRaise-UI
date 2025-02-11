"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useWallet } from "@solana/wallet-adapter-react";
import { useMemo, useState } from "react";
import { createCampaign, getProvider } from "@/services/blockchain";
import { toast } from "../hooks/use-toast";

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(50, {
      message: "Title must not excees 642 characters",
    }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(642, {
      message: "Title must not excees 642 characters",
    }),
  imageUrl: z.string().url({
    message: "Please enter a valid image URL.",
  }),
  goal: z.coerce.number().min(1, {
    message: "Goal must be at least $1.",
  }),
});

const CreateCampaignPage = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      goal: 0,
    },
  });

  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const program = useMemo(
    () => getProvider(publicKey, signTransaction, sendTransaction),
    [publicKey, sendTransaction, signTransaction]
  );
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const tx = await createCampaign(
        program!,
        publicKey!,
        values.title,
        values.description,
        values.imageUrl,
        values.goal
      );
      toast({
        title: "Campaign created successfully",
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
  }

  return (
    <div className="flex min-h-screen items-center pt-28 justify-center bg-gradient-to-br from-violet-50 to-teal-50 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-slate-800">
            Create New Campaign
          </CardTitle>
          <CardDescription className="text-slate-600">
            Launch your vision into reality. Fill in the details below to create
            your new campaign.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter campaign title"
                        {...field}
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell the world about your campaign..."
                        {...field}
                        className="min-h-[120px] focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription>
                      This will be displayed publicly on your campaign page.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">
                      Cover Image URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Paste your image URL here"
                        {...field}
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a high-quality image that represents your
                      campaign.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">
                      Funding Goal ($)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter funding goal"
                        {...field}
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription>
                      Set a realistic funding target for your campaign.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${loading ? "animate-pulse" : ""}`}
                >
                  {!loading ? "Launch Campaign" : "Loading..."}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCampaignPage;
