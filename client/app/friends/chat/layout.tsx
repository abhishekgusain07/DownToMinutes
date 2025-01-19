import { api } from "@/convex/_generated/api"
import { auth } from "@clerk/nextjs/server"
import { preloadQuery } from "convex/nextjs"
import ChatLayoutWrapper from "./_component/chatLayoutWrapper"

export default async function ChatLayout({ children }: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  // user information
  const preloadedUserInfo = await preloadQuery(api.users.readUser, {
    userId: userId!
  })
  // conversations + chats
  const preloadedConversations = await preloadQuery(api.chat.getConversations, {
    userId: userId!
  })

  // preloaded chat

  return (
    <ChatLayoutWrapper
      preLoadedUserInfo={preloadedUserInfo}
      preLoadedConversations={preloadedConversations}
    >
      {children}
    </ChatLayoutWrapper>
  )
}