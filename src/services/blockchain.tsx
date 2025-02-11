import { CFunding } from "@/conf/c_funding";
import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from "@solana/web3.js";
import idl from "@/conf/c_funding.json";
import { Campaign, Transaction } from "@/utils/interface";
import { store } from "@/store";
import { globalActions } from "@/store/globalSlices";

const idl_object = JSON.parse(JSON.stringify(idl));
const RPC_URL: string = "https://api.devnet.solana.com";
const { setCampaign, setDonations } = globalActions;

export const getProvider = (
  publicKey: PublicKey | null,
  signTransaction: unknown,
  sendTransaction: unknown
): Program<CFunding> | null => {
  if (!publicKey || !signTransaction) {
    return null;
  }
  const connection = new Connection(RPC_URL, "confirmed");
  const provider = new AnchorProvider(
    connection,
    { publicKey, signTransaction, sendTransaction } as unknown as Wallet,
    { commitment: "processed" }
  );

  return new Program<CFunding>(idl_object, provider);
};

export const getProviderReadonly = (): Program<CFunding> => {
  const connection = new Connection(RPC_URL, "confirmed");

  const walllet = {
    publicKey: PublicKey.default,
    signTransaction: async () => {
      throw new Error("Read-only provider cannot sign transactions.");
    },
    signAllTransaction: async () => {
      throw new Error("Read-only provider cannot sign transactions.");
    },
  };

  const provider = new AnchorProvider(
    connection,
    walllet as unknown as Wallet,
    { commitment: "processed" }
  );

  return new Program<CFunding>(idl_object, provider);
};

export const createCampaign = async (
  program: Program<CFunding>,
  publicKey: PublicKey,
  title: string,
  description: string,
  image_url: string,
  goal: number
): Promise<TransactionSignature> => {
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );

  const state = await program.account.programState.fetch(programStatePda);
  const CID = state.campaignCount.add(new BN(1));

  const [campaignPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("campaign"), CID.toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  const goalBN = new BN(goal * 1_000_000_000);
  const tx = await program.methods
    .createCampaign(title, description, image_url, goalBN)
    .accountsPartial({
      programState: programStatePda,
      campaign: campaignPda,
      creator: publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  const connection = new Connection(
    program.provider.connection.rpcEndpoint,
    "confirmed"
  );

  await connection.confirmTransaction(tx, "finalized");
  return tx;
};

export const updateCampaign = async (
  program: Program<CFunding>,
  publicKey: PublicKey,
  pda: string,
  title: string,
  description: string,
  image_url: string,
  goal: number
): Promise<TransactionSignature> => {
  const campaign = await program.account.campaign.fetch(pda);
  const [campaignPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("campaign"), campaign.cid.toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  const goalBN = new BN(goal * 1_000_000_000);
  const tx = await program.methods
    .updateCampaign(campaign.cid, title, description, image_url, goalBN)
    .accountsPartial({
      campaign: campaignPda,
      creator: publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  const connection = new Connection(
    program.provider.connection.rpcEndpoint,
    "confirmed"
  );

  await connection.confirmTransaction(tx, "finalized");
  return tx;
};

interface RawCampaign {
  publicKey: PublicKey;
  account: {
    cid: BN;
    creator: PublicKey;
    title: string;
    description: string;
    imageUrl: string;
    goal: BN;
    amountRaised: BN;
    donors: BN;
    withdrawals: BN;
    timestamp: BN;
    active: boolean;
    balance: BN;
  };
}

interface RawTransaction {
  publicKey: PublicKey;
  account: {
    cid: BN;
    owner: PublicKey;
    amount: BN;
    timestamp: BN;
    credited: boolean;
  };
}

// ... rest of your existing code remains the same until the functions ...

export const fetchActiveCampaigns = async (
  program: Program<CFunding>
): Promise<Campaign[]> => {
  const campaigns = await program.account.campaign.all() as unknown as RawCampaign[];
  const activeCampaigns = campaigns.filter((c: RawCampaign) => c.account.active);
  return serializedCampaigns(activeCampaigns);
};

export const fetchCampaign = async (
  program: Program<CFunding>,
  campaignPda: string
): Promise<Campaign> => {
  const campaign = await program.account.campaign.fetch(campaignPda) as {
    cid: BN;
    creator: PublicKey;
    title: string;
    description: string;
    imageUrl: string;
    goal: BN;
    amountRaised: BN;
    donors: BN;
    withdrawals: BN;
    timestamp: BN;
    active: boolean;
    balance: BN;
  };

  const serializedCampaign: Campaign = {
    ...campaign,
    publicKey: campaignPda,
    cid: Number(campaign.cid),
    creator: campaign.creator.toBase58(),
    goal: Number(campaign.goal),
    withdrawals: Number(campaign.withdrawals),
    donors: Number(campaign.donors),
    amountRaised: Number(campaign.amountRaised),
    timestamp: Number(campaign.timestamp),
    balance: Number(campaign.balance),
  };

  store.dispatch(setCampaign(serializedCampaign));
  return serializedCampaign;
};

const serializedCampaigns = (campaigns: RawCampaign[]): Campaign[] => {
  return campaigns.map((c: RawCampaign) => ({
    ...c.account,
    publicKey: c.publicKey.toBase58(),
    cid: c.account.cid.toNumber(),
    creator: c.account.creator.toBase58(),
    goal: c.account.goal.toNumber() / 1e9,
    amountRaised: c.account.amountRaised.toNumber() / 1e9,
    timestamp: c.account.timestamp.toNumber() * 1000,
    donors: c.account.donors.toNumber(),
    withdrawals: c.account.withdrawals.toNumber(),
    balance: c.account.balance.toNumber() / 1e9,
  }));
};

export const fetchAllWithdrawTransactions = async (
  program: Program<CFunding>,
  pda: string
): Promise<Transaction[]> => {
  const campaign = await program.account.campaign.fetch(pda);
  const transactions = await program.account.transaction.all();
  const donations = transactions.filter(
    (c) => c.account.cid.eq(campaign.cid) && !c.account.credited
  );
  store.dispatch(setDonations(serializedTxs(donations)));
  return serializedTxs(donations);
};

export const fetchAllTransactions = async (
  program: Program<CFunding>,
  pda: string
): Promise<Transaction[]> => {
  const campaign = await program.account.campaign.fetch(pda) as {
    cid: BN;
  };
  const transactions = await program.account.transaction.all() as unknown as RawTransaction[];
  const donations = transactions.filter(
    (c: RawTransaction) => c.account.cid.eq(campaign.cid) && c.account.credited
  );
  store.dispatch(setDonations(serializedTxs(donations)));
  return serializedTxs(donations);
};

export const dontateToCampaign = async (
  program: Program<CFunding>,
  publicKey: PublicKey,
  pda: string,
  amount: number
): Promise<TransactionSignature> => {
  const campaign = await program.account.campaign.fetch(pda);
  const [transactionPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("donor"),
      publicKey.toBuffer(),
      campaign.cid.toArrayLike(Buffer, "le", 8),
      campaign.donors.add(new BN(1)).toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );
  const [campaignPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("campaign"), campaign.cid.toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  const donationAmount = new BN(Math.round(amount) * 1_000_000_000);
  const tx = await program.methods
    .donate(campaign.cid, donationAmount)
    .accountsPartial({
      campaign: campaignPda,
      transaction: transactionPda,
      donor: publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
  const connection = new Connection(
    program.provider.connection.rpcEndpoint,
    "confirmed"
  );
  await connection.confirmTransaction(tx, "finalized");
  return tx;
};

const serializedTxs = (transactions: RawTransaction[]): Transaction[] => {
  return transactions.map((c: RawTransaction) => ({
    ...c.account,
    publicKey: c.publicKey.toBase58(),
    cid: Number(c.account.cid),
    owner: c.account.owner.toBase58(),
    amount: Number(c.account.amount),
    timestamp: Number(c.account.timestamp),
  }));
};

export const fetchUserCampaigns = async (
  program: Program<CFunding>,
  publicKey: PublicKey
): Promise<Campaign[]> => {
  const campaigns = await program.account.campaign.all() as unknown as RawCampaign[];
  const userCampaigns = campaigns.filter(
    (c: RawCampaign) => c.account.creator.toBase58() === publicKey.toBase58()
  );
  return serializedCampaigns(userCampaigns);
};

export const withdrawFromCampaigh = async (
  program: Program<CFunding>,
  pda: string,
  publicKey: PublicKey,
  amount: number
): Promise<TransactionSignature> => {
  const campaign = await program.account.campaign.fetch(pda);
  const [campaignPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("campaign"), campaign.cid.toArrayLike(Buffer, "le", 8)],
    program.programId
  );
  const [transactionPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("withdraw"),
      publicKey.toBuffer(),
      campaign.cid.toArrayLike(Buffer, "le", 8),
      campaign.withdrawals.add(new BN(1)).toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );
  const programState = await program.account.programState.fetch(
    programStatePda
  );

  const withdraw_amount = new BN(amount * 1_000_000_000);
  const tx = await program.methods
    .withdraw(campaign.cid, withdraw_amount)
    .accountsPartial({
      campaign: campaignPda,
      transaction: transactionPda,
      creator: publicKey,
      programState: programStatePda,
      platformAddress: programState.platformAddress,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
  const connection = new Connection(
    program.provider.connection.rpcEndpoint,
    "confirmed"
  );
  await connection.confirmTransaction(tx, "finalized");
  return tx;
};

export const closeCampaign = async (
  program: Program<CFunding>,
  publicKey: PublicKey,
  pda: string
): Promise<TransactionSignature> => {
  const campaign = await program.account.campaign.fetch(pda);
  const [campaignPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("campaign"), campaign.cid.toArrayLike(Buffer, "le", 8)],
    program.programId
  );
  const tx = await program.methods
    .deleteCampaign(campaign.cid)
    .accountsPartial({
      creator: publicKey,
      campaign: campaignPda,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
  return tx;
};


export const updatePlatformFee = async(program:Program<CFunding>,publicKey:PublicKey,updatedPricePercent:number):Promise<TransactionSignature>=>{
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],program.programId
  )
  const updatedFee = new BN(updatedPricePercent);
  const tx = await program.methods.updatePlatformSettings(updatedFee).accountsPartial({
    updater:publicKey,
    programState:programStatePda,
  }).rpc();
  return tx;
}

export const programOwner = async(program:Program<CFunding>):Promise<string>=>{
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );
  const programState = await program.account.programState.fetch(
    programStatePda
  );
  return programState.platformAddress.toBase58().toString();
}