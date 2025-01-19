import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

const FriendsPage = () => {
    return (
        <div className="min-h-screen min-w-screen flex flex-col items-center justify-center">
            <h1>Friends Page</h1>
            <div className="flex items-center justify-center mt-4">
                <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    <Link href="/friends/dashboard">Add Friend</Link>
                </Button>
                <SignOutButton />
            </div>
        </div>
    );
};
export default FriendsPage;