"use client";

import { Tabs2 } from "@/components/ui/tabs2";

export function TabsDemo() {
  const tabs = [
    {
      title: "Friends",
      value: "friends",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Friends</p>
        </div>
      ),
    },
    {
      title: "Friend Requests",
      value: "friend-requests",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Friend Requests</p>
        </div>
      ),
    },
    {
      title: "Chats",
      value: "chats",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Chats tab</p>
        </div>
      ),
    },
    {
      title: "Share Progress",
      value: "share-progress",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Share Progress</p>

        </div>
      ),
    },
  ];

  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-40">
      <Tabs2 tabs={tabs} />
    </div>
  );
}
