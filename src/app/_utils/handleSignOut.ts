import { auth } from "@/lib/firebaseConfig";
import { signOut } from "firebase/auth";

export const handleSignOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
    }
};