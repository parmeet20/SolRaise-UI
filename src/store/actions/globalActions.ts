import { Campaign, GlobalState, ProgramState, Transaction } from "@/utils/interface";
import { PayloadAction } from '@reduxjs/toolkit';

export const globalStateActions = {
    setCampaign: (state: GlobalState, actions: PayloadAction<Campaign>) => {
        state.campaign = actions.payload;
    },
    setDonations: (state: GlobalState, actions: PayloadAction<Transaction[]>) => {
        state.donations = actions.payload;
    },
    setWithdrawls: (state: GlobalState, actions: PayloadAction<Transaction[]>) => {
        state.withdrawals = actions.payload;
    },
    setStates: (state: GlobalState, actions: PayloadAction<ProgramState>) => {
        state.programState = actions.payload;
    },
    setDelModal: (state: GlobalState, actions: PayloadAction<string>) => {
        state.delModal = actions.payload;
    },
    setWithdrawModal: (state: GlobalState, actions: PayloadAction<string>) => {
        state.withdrawModal = actions.payload;
    },
}