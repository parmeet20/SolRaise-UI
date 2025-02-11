"use client";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction } from "@/utils/interface";
import { formatToSol } from "@/heplers/helpers";

interface DonationTableProps {
  txType: string;
  donations: Transaction[];
}

export const TransactionTable = ({ txType, donations }: DonationTableProps) => (
  <div className="border w-full md:w-[70%] rounded-2xl overflow-hidden">
    {/* Wrapping the table inside a div to allow horizontal scrolling on mobile */}
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableCell>{txType}</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.map((donation) => (
            <TableRow key={donation.timestamp}>
              <TableCell>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://explorer.solana.com/address/${donation.publicKey}?cluster=devnet`}
                  className="hover:underline"
                >
                  {donation.owner}
                </a>
              </TableCell>
              <TableCell>{formatToSol(donation.amount)} SOL</TableCell>
              <TableCell>
                {new Date(donation.timestamp * 1000).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);
