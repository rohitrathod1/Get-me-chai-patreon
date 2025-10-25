"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-gray-900 shadow-xl text-white flex justify-between items-center px-4 md:h-16">
      {/* Logo */}
      <Link href="/" className="logo font-bold text-lg flex items-center gap-2">
        <Image src="/tea.gif" width={44} height={44} alt="logo" className="invertImg" />
        <span className="text-xl md:text-base">Get Me a Chai!</span>
      </Link>

      {/* Account / Login */}
      <div className="relative flex items-center gap-4">
        {session ? (
          <>
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
              className="text-white mx-2 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-3 py-2 inline-flex items-center"
            >
              Account
              <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute left-0 top-12 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44">
                <ul className="py-2 text-sm text-gray-700">
                  <li><Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link></li>
                  <li><Link href={`/${session.user.name}`} className="block px-4 py-2 hover:bg-gray-100">Your Page</Link></li>
                  <li><button onClick={() => signOut()} className="w-full text-left px-4 py-2 hover:bg-gray-100">Sign Out</button></li>
                </ul>
              </div>
            )}

            <button
              onClick={() => signOut()}
              className="text-white w-fit bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">
            <button className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
