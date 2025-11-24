"use client";
import { signOut } from "next-auth/react"
import { FaSignOutAlt } from "react-icons/fa";

const SignoutButton = () => {
    return (
        <button onClick={() => signOut()} className="btn-primary text-white hover:bg-error/10 flex items-center space-x-1.5 px-3 py-1.5 rounded">
            <FaSignOutAlt className="w-4 h-4" />
            <span>Sign out</span>
        </button>
    );
}
export default SignoutButton;