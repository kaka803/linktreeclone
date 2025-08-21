"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <nav className="absolute top-13 left-0 right-0 rounded-[40px] bg-white h-[70px] z-10 px-7 md:py-10 flex items-center justify-between max-w-[90%] m-auto shadow-md">
        
        {/* Logo */}
        <div className="flex items-center justify-start gap-9 w-full">
          <div>
            <img
              src="/full-logo.svg"
              alt="logo"
              className="w-28 hidden md:block"
            />
            <img
              src="/logo.svg"
              alt="logo"
              className="w-8 block md:hidden"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-10 text-[16px] font-normal text-black">
              <Link href="/dashboard">
              <li className="cursor-pointer hover:text-gray-600 transition-colors">
                dashboard
              </li>
              </Link>
              
              <li className="cursor-pointer hover:text-gray-600 transition-colors">
                Learn
              </li>
            </ul>
          </div>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex justify-center items-center gap-5">
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <button className="bg-gray-300 text-black w-[103px] h-[56px] rounded-[10px] text-nowrap transition-transform duration-300 hover:scale-105 hover:bg-gray-400">
                Log In
              </button>
            </SignInButton>
            <SignUpButton forceRedirectUrl="/profile">
              <button className="bg-gray-900 text-white rounded-full font-light text-xs sm:text-base h-[56px] px-6 transition-transform duration-300 hover:scale-105 hover:bg-gray-800 text-nowrap">
                Sign Up Free
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          {open ? (
            <X
              size={28}
              className="cursor-pointer text-black"
              onClick={() => setOpen(false)}
            />
          ) : (
            <Menu
              size={28}
              className="cursor-pointer text-black"
              onClick={() => setOpen(true)}
            />
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden z-10 absolute top-[140px] left-0 right-0 bg-white rounded-[40px] shadow-lg mx-5 py-6 px-8 flex flex-col items-center gap-6 transition-all duration-500 ${
          open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-5"
        }`}
      >
        <ul className="flex flex-col items-center gap-6 text-[18px] font-medium text-black">
          <Link href="/dashboard">
              <li className="cursor-pointer hover:text-gray-600 transition-colors">
                dashboard
              </li>
              </Link>
              
              <li className="cursor-pointer hover:text-gray-600 transition-colors">
                Learn
              </li>
        </ul>
        
        {/* Mobile Auth Buttons */}
        <div className="flex flex-col gap-4 w-full">
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <button className="bg-gray-300 text-black w-full py-3 rounded-[40px] transition-transform duration-300 hover:scale-105 hover:bg-gray-400">
                Log In
              </button>
            </SignInButton>
            <SignUpButton forceRedirectUrl="/profile">
              <button className="bg-gray-900 text-white w-full py-3 rounded-[40px] transition-transform duration-300 hover:scale-105 hover:bg-gray-800">
                Sign Up Free
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
