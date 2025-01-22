"use client";
import { useAuth } from "@clerk/nextjs";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
  } from "@/components/ui/dialog";
import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquareMore, Search, UserPlus, Users2 } from "lucide-react";
import Skeleton from "@/components/skeleton";
import { searchAllUserExceptCurrent } from "@/utils/data/user/searchAllUserExceptCurrent";
import { FilteredUsers, FriendRequest } from "@/utils/types";
import { toast } from "sonner";
import sendFriendRequest from "@/utils/data/friend/sendFriendRequest";
import { checkExistingFriendship } from "@/utils/data/friend/checkExistingFriendship";

const SearchFriends = () => {
    const {userId} = useAuth()
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();
    const [searchResults, setSearchResults] = useState<FilteredUsers[]>([]);
    const router = useRouter();
    
    const debouncedSearch = useCallback(
        debounce((searchTerm: string) => {
            startTransition(() => {
                setDebouncedSearchTerm(searchTerm);
            })
        }, 300),
        []
    )
    useEffect(() => {
        const search = async () => {
            if(!debouncedSearchTerm){
                setSearchResults([])
                return;
            }
            const searchResults = await searchAllUserExceptCurrent({currentUserId: userId!, searchTerm: debouncedSearchTerm})
            setSearchResults(searchResults!)
        }
        search();

    }, [debouncedSearchTerm])

    const sendFriendRequestToUser = async(friendClerkId: string) => {
        try{
            const alreadyFriends: boolean =  await checkExistingFriendship({senderId: userId!, recipientId: friendClerkId});
            if(alreadyFriends) {
                toast.error("You are already friends with this user")
                return;
            }
             await sendFriendRequest({senderId: userId!, receiverId: friendClerkId});
            toast.success("Friend request sent ✅")
        } catch (error: any) {
            toast.error(error.message);
        }
    }
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    }
    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" className="">
                        <MessageSquareMore className="w-5 h-5 mr-2" />
                        Search friends
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-[380px] p-0">
                    <DialogTitle className="p-0"></DialogTitle>
                    <DialogHeader className="p-0">
                    {/* Header */}
                    <div className="bg-blue-600 p-4 flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-[#AEBAC1] hover:text-white"
                        onClick={() => setIsOpen(false)}
                        >
                        <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h2 className="text-[#E9EDEF] text-base font-medium">Search Accountability partners</h2>
                    </div>

                    {/* Search Input */}
                    <div className="p-2 border-black border rounded-lg" >
                        <div className="relative rounded-lg flex items-center">
                        <div className="pl-4 pr-2 py-2 ">
                            <Search className="w-5 h-5 text-[#8696A0]" />
                        </div>
                        <input
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search Contacts"
                            className="w-full bg-transparent border-none focus:outline-none py-2 text-base"
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
                            {searchResults?.map((user) => (
                            <div key={user.user_id}
                                className="flex text-[#111B21] items-center px-4 py-3 hover:bg-black hover:bg-opacity-20 hover:text-black cursor-pointer transition-colors"
                            >
                                <Avatar className="h-12 w-12 mr-3">
                                <AvatarImage src={user.profile_image_url!} />
                                <AvatarFallback className="bg-[#6B7C85]">
                                    <Users2 className="h-6 w-6 text-[#CFD9DF]" />
                                </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-[#111B21]  text-base font-normal truncate">
                                        {user.first_name} {user.last_name}
                                    </h3>
                                </div>
                                <Button variant="ghost" size="icon" className="text-[#AEBAC1] hover:text-white"
                                onClick={() => {
                                    sendFriendRequestToUser(user.user_id);
                                    setIsOpen(false);
                                }}
                                >
                                    <UserPlus className="w-5 h-5" />
                                </Button>
                            </div>
                            ))}
                            {searchResults?.length === 0 && debouncedSearchTerm && (
                            <div className="p-4 text-center text-[#8696A0]">
                                No contacts found
                            </div>
                            )}

                            {!debouncedSearchTerm && (
                            <div className="px-4 py-8 text-center">
                                <p className="text-[#8696A0] text-sm">
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
        </div>
    )
}

export default SearchFriends;