export interface Campaign {
    publicKey: string;
    cid: number;
    creator: string;
    title: string;
    description: string;
    imageUrl: string;
    goal: number;
    amountRaised: number;
    timestamp: number;
    donors: number;
    withdrawals: number;
    balance: number;
    active: boolean;
}

export interface Transaction {
    publicKey: string;
    owner: string;
    cid: number;
    amount: number;
    timestamp: number;
    credited: boolean;
}

export interface ProgramState {
    intialized: boolean;
    campaignCount: number;
    platformFee: number;
    platformAddress: string;
}

export interface GlobalState {
    campaign: Campaign | null;
    donations: Transaction[];
    withdrawals: Transaction[];
    programState: ProgramState | null;
    delModal: string;
    withdrawModal: string;
}
export interface RootState {
    globalState: GlobalState;
}