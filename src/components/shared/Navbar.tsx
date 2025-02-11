"use client";

import React from "react";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// ShadCN UI components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Lucide icon for the hamburger menu
import { Menu } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-br from-slate-100/80 to-stone-100/80 backdrop-blur-lg rounded-2xl border-b border-slate-200/20 fixed top-4 left-4 right-4 z-50 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand */}
        <Link
          href="/"
          className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-teal-500 to-violet-500 bg-clip-text"
        >
          SolRaise
        </Link>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex space-x-6">
          <Link
            href="/account"
            className="text-slate-800 hover:text-teal-500 transition-colors"
          >
            Account
          </Link>
          <Link
            href="/create"
            className="text-slate-800 hover:text-teal-500 transition-colors"
          >
            Create Campaign
          </Link>
        </div>

        {/* Wallet Button and Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Desktop Wallet Button */}
          <div className="hidden md:block">
            <WalletMultiButton className="bg-slate-800 rounded-2xl" />
          </div>

          {/* Mobile Dropdown Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white shadow-md rounded-md p-2">
                <DropdownMenuItem asChild>
                  <Link href="/account" className="w-full">
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/create" className="w-full">
                    Create Campaign
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  {/* You can either render the wallet button here directly or trigger a modal */}
                  <WalletMultiButton className="bg-slate-800 rounded-2xl" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
