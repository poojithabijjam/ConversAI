import Link from "next/link";
import Avatar from "./Avatar";
import "../app/globals.css";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";


export default function Header() {
  return (
    <header className="bg-white shadow-sm text-gray-800 flex justify-between p-5">
    <Link href="/" className="flex items-center text-4xl font-thin">
     <Avatar
     seed="ConversAI:Dynamic Chatbot Creation and Management Platform"
     />   
    <div className="space-y-1">
      <h1> ConversAI </h1>
      <h2 className="text-sm"> Dynamic Chatbot Creation and Management Platform </h2>
    </div>
    </Link>
    <div className="flex">
        <SignedIn>
            <UserButton showName />
        </SignedIn>

        <SignedOut>
            <SignInButton />
        </SignedOut>
    </div>
    </header>
  )
}
