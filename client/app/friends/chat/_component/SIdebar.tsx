import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@clerk/nextjs"
import { Avatar } from "@radix-ui/react-avatar"
import { Preloaded, usePreloadedQuery } from "convex/react"
import { MoreVertical, Search, Users2 } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import SearchComponent from "./search"

interface SideBarProps {
  preloadedUserInfo: Preloaded<typeof api.users.readUser>;
  preloadedConversations: Preloaded<typeof api.chat.getConversations>;
}

const SideBar = ({ preloadedUserInfo, preloadedConversations }: SideBarProps) => {
  const pathName = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const { signOut } = useAuth();
  const router = useRouter();
  const userInfo = usePreloadedQuery(preloadedUserInfo);
  const conversations = usePreloadedQuery(preloadedConversations);

  const handleClick = (conversationId: string) => {
    router.replace(`/friends/chat/${conversationId}`)
  }

  const filteredConversations = useMemo(() => {
    if(!searchQuery) return conversations;

    return conversations?.
      filter((chat) => {
        const matchesName = chat.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesMessage = chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesName || matchesMessage
      }).sort((a, b) => {
        const aNameMatch = a.name.toLowerCase().includes(searchQuery.toLowerCase())
        const bNameMatch = b.name.toLowerCase().includes(searchQuery.toLowerCase())

        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1

        return 0
      })
  }, [conversations, searchQuery]);

  return (
    <div className="w-[70px] md:w-[380px] lg:w-1/4 h-screen flex flex-col bg-background dark:bg-[#111B21] border-r border-border dark:border-[#313D45]">
      {/* Header */}
      <div className="shrink-0 px-3 py-[18px] md:py-[14px] bg-muted dark:bg-[#202C33] flex justify-center md:justify-between items-center">
        <Link href="/profile">
          <Avatar>
            <AvatarImage className="w-8 h-8 md:w-9 md:h-9 rounded-full" src={userInfo?.profileImage} alt="Your avatar" />
          </Avatar>
        </Link>
        <div className="hidden md:flex justify-center items-center gap-2">
          <SearchComponent onSidebar={true} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => {
                signOut()
                router.push("/")
              }}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Search Input */}
      <div className="hidden md:block p-2 bg-[#111B21]">
        <div className="relative bg-[#202C33] rounded-lg flex items-center">
          <div className="pl-4 pr-2 py-2">
            <Search className="h-5 w-5 text-[#8696A0]" />
          </div>
          <input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-[#E9EDEF] placeholder:text-[#8696A0] focus:outline-none py-2 text-base"
          />
        </div>
      </div>
      
      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations?.map((chat) => (
          <div onClick={() => handleClick(chat.id)} key={chat.id}>
            <div className={`flex items-center px-2 py-2 md:px-3 md:py-3 hover:bg-[#202C33] cursor-pointer
                  ${pathName.split("/")?.[2] === chat?.id ? "bg-[#202C33]" : ""}
                `}>
              <div className="relative">
                <Avatar>
                  <AvatarImage className="w-12 h-12 rounded-full" src={chat?.chatImage} />
                  <AvatarFallback className="bg-[#6B7C85]">
                    <Users2 className="h-6 w-6 text-[#CFD9DF]" />
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Conversation details - Only visible on md and larger screens */}
              <div className="hidden md:block flex-1 min-w-0 ml-3">
                <div className="flex justify-between items-baseline">
                  <h2 className="text-[#E9EDEF] text-base font-normal truncate">
                    <HighlightText text={chat.name} searchQuery={searchQuery} />
                  </h2>
                  <span className="text-[#8696A0] text-xs ml-2 shrink-0">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[#8696A0] text-sm truncate pr-2">
                    {chat.type === "image" ? (
                      <span className="flex items-center gap-1">
                        <span className="text-[#8696A0]">📸</span> Photo
                      </span>
                    ) : (
                      <HighlightText text={chat.lastMessage} searchQuery={searchQuery} />
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

const HighlightText = ({ text, searchQuery }: {
    text: string,
    searchQuery: string
}) => {
if (!searchQuery) return <>{text}</>

const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'))

    return (
        <>
        {parts.map((part, i) => (
            part.toLowerCase() === searchQuery.toLowerCase() ?
            <span key={i} className="bg-[#00A884] text-[#111B21] px-0.5 rounded">
                {part}
            </span>
            :
            <span key={i}>{part}</span>
        ))}
        </>
    )
}

export default SideBar;