"use client";

import { FriendRequests } from "./_component/FriendRequests";
import { ActivityFeed } from "./_component/ActivityFeed";
import { Chat } from "./_component/Chat";

const FriendsPage = () => {
    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Friends</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
                {/* Left Column - Friend Requests */}
                <div className="h-full">
                    <FriendRequests />
                </div>

                {/* Middle Column - Activity Feed */}
                <div className="h-full">
                    <ActivityFeed />
                </div>

                {/* Right Column - Chat */}
                <div className="h-full">
                    <Chat />
                </div>
            </div>
        </div>
    );
};

export default FriendsPage;