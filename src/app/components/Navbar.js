'use client'
import { useState } from 'react';
import Link from 'next/link';
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const route = useRouter();

  async function logoutHandle(){
    try{
       await axios.get("/api/logout");
      toast.success("Logout Successfully",{
        duration:2000,
        position:"top-center"
      })
      route.push("/");


    }catch(error){
      // console.log(error.message)
      toast.error(error.message,{
        duration:2000,
        position:"top-center"
      })

    }

  }

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          <Link href="/">
            <img src="https://play-lh.googleusercontent.com/0tdlMA-ZSVCA2xO9U9WZOGUYgJu2TzUvf9yZZn3TaKGn1qTiqw1_O4eKIVlIa_V4rw" alt="Logo" className="h-8 inline" /> {/* Replace with your logo */}
          </Link>
        </div>

        {/* Hamburger Menu Icon (for small screens) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              ></path>
            </svg>
          </button>
        </div>

        {/* Links for Desktop and Mobile */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } w-full md:flex md:items-center md:w-auto`}
        >
          <ul className="md:flex items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
            {/* Add any other links here */}
            <li>
              <Link href="/users" className="text-white text-lg">
                Add Users
              </Link>
            </li>
            <li>
              <Link href="/tasks" className="text-white text-lg">
                Add Tasks
              </Link>
            </li>
            
            <li>
              <Link href="/generateinvoice" className="text-white text-lg">
                Generate Invoice
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandle} // Replace with actual logout logic
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
