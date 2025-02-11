import { LAMPORTS_PER_SOL } from "@solana/web3.js"

export const formatToSol = (amount:number):string=>{
    const sol = (amount/LAMPORTS_PER_SOL);
    return sol.toString();
}