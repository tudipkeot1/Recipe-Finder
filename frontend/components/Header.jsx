import React from 'react'
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Show } from "@clerk/nextjs";
import Link from 'next/link';
import Image from 'next/image';
import { Cookie, Refrigerator, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import UserDropdown from './UserDropdown';
import { checkUser } from '@/lib/checkUser';
import PricingModal from './PricingModal';
import HowToCookModal from './HowToCookModal';

const Header = async () => {
  const user = await checkUser();
  return (
    <header className="fixed top-0 w-full border-b border-stone-200 bg-stone-50/80 backdrop-blur-md z-50 supports-backdrop-filter:bg-stone-50/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={user ? "/dashboard" : "/"}>
          <Image src="/Recipefinder.png" alt="Recipe Finder Logo" width={60} height={60} className="w-16" />
        </Link>
        <div className=" md:flex items-center space-x-8 text-sm font-medium text-stone-600">
          <Link
            href="/recipes"
            className="hover:text-orange-600 transition-colors flex gap-1.5 items-center"
          >
            <Cookie className="w-4 h-4" />
            My Recipes
          </Link>
          <Link
            href="/pantry"
            className="hover:text-orange-600 transition-colors flex gap-1.5 items-center"
          >
            <Refrigerator className="w-4 h-4" />
            My Pantry
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {user && <PricingModal
            subscriptionTier={user.subscriptionTier}>
            <Badge
              variant="outline"
              className={`flex h-8 px-3 gap-1.5 rounded-full text-xs font-semibold transition-all ${user.subscriptionTier === "pro"
                  ? "bg-linear-to-r from-orange-600 to-amber-500 text-white border-none shadow-sm"
                  : "bg-stone-200/50 text-stone-600 border-stone-200 cursor-pointer hover:bg-stone-300/50 hover:border-stone-300"
                }`}
            >
              <Sparkles
                className={`h-3 w-3 ${user.subscriptionTier === "pro"
                    ? "text-white fill-white/20"
                    : "text-stone-500"
                  }`}
              />
              <span>
                {user.subscriptionTier === "pro" ? "Pro Chef" : "Free Plan"}
              </span>
            </Badge>
          </PricingModal>}
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-stone-600 font-medium px-4 py-2 rounded-full transition duration-300 hover:text-orange-600 hover:bg-orange-50">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-orange-500 text-white rounded-full px-6 py-2 font-medium transition-all duration-300 hover:bg-orange-600 hover:scale-105 hover:shadow-lg active:scale-95">
                Get Started
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserDropdown />

          </Show>
        </div>
      </nav>
    </header>
  )
}

export default Header