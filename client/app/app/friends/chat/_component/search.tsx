"use client"
import { useAuth } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
  } from "@/components/ui/dialog";

import {api} from "@/convex/_generated/api";
import debounce from 'lodash/debounce';
import { ArrowLeft, MessageSquareMore, Search, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Skeleton from "./Skeleton";
import { 
    Avatar,
    AvatarFallback,
    AvatarImage,
    
} from "@/components/ui/avatar";

const SearchComponent = ({ onSidebar }: { onSidebar: boolean }) => {
    const {userId} = useAuth();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const createConversation = useMutation(api.chat.createOrGetConversation);

    const debouncedSearch = useCallback(
        debounce((searchTerm: string) => {
            startTransition(() => {
                setDebouncedSearchTerm(searchTerm);
            })
        }, 300),
        []
    )

    const searchResult = useQuery(
        api.users.searchUsers,
        {
            searchTerm: debouncedSearchTerm,
            currentUserId: userId || " ",
        }
    )

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    }

    const handleStartChat = async (selectedUserId: string) => {
        try{
            const conversationId = await createConversation({participantUserId: selectedUserId, currentUserId: userId!});
            setIsOpen(false);
            router.replace(`/friends/chat/${conversationId}`);
        }catch(error) {
            console.log("Error creating conversation:", error);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {onSidebar ? (
                    <Button variant="ghost" size="icon">
                        <MessageSquareMore className="w-5 h-5" />
                    </Button>
                ) : (
                    <div className="mt-5">
                        <Button 
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            Start New Chat
                        </Button>
                    </div>
                )}
            </DialogTrigger>
            <DialogContent className="w-full max-w-[380px] p-0 bg-background border-border">
                <DialogHeader className="p-0">
                    {/* Header with DialogTitle for accessibility */}
                    <div className="bg-muted p-4 flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => setIsOpen(false)}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <DialogTitle className="text-foreground text-base font-medium">
                            New Chat
                        </DialogTitle>
                    </div>

                    {/* Search Input */}
                    <div className="p-2 bg-background">
                        <div className="relative bg-muted rounded-lg flex items-center">
                            <div className="pl-4 pr-2 py-2">
                                <Search className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <input
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search Contacts"
                                className="w-full bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none py-2 text-base"
                            />
                        </div>
                    </div>

                    {/* Results with fixed height container */}
                    <div className="overflow-y-auto max-h-[400px] min-h-[300px]">
                        {isPending ? (
                            <>
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                            </>
                        ) : (
                            <>
                                {searchResult?.map((user) => (
                                    <div 
                                        key={user.userId}
                                        onClick={() => handleStartChat(user.userId)}
                                        className="flex items-center px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors"
                                    >
                                        <Avatar className="h-12 w-12 mr-3">
                                            <AvatarImage src={user.profileImage} />
                                            <AvatarFallback className="bg-muted">
                                                <Users2 className="h-6 w-6 text-muted-foreground" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-foreground text-base font-normal truncate">
                                                {user.name}
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                                {searchResult?.length === 0 && debouncedSearchTerm && (
                                    <div className="p-4 text-center text-muted-foreground">
                                        No contacts found
                                    </div>
                                )}

                                {!debouncedSearchTerm && (
                                    <div className="px-4 py-8 text-center">
                                        <p className="text-muted-foreground text-sm">
                                            Search for users to start a new chat
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default SearchComponent;