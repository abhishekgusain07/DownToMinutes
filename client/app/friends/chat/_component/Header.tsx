"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useAuth } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"

export default function Header({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const router = useRouter()
  const { userId } = useAuth()

  const conversationId = pathname?.split("/chat/")?.[1]
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Get our delete mutation
  const deleteConversation = useMutation(api.chat.deleteConversation)

  const handleDelete = async () => {
    if (!conversationId || !userId) return;

    try {
      setIsDeleting(true)
      await deleteConversation({
        userId,
        conversationId: conversationId as Id<"conversations">
      })

      toast.success("Chat deleted successfully")
      router.push("/chat")
    } catch (error) {
      toast.error("Failed to delete chat");
      console.error("Error deleting chat:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteAlert(false);
    }

  }

  return (
    <div className="flex-1 flex flex-col w-full">
      <div className="bg-muted dark:bg-[#202C33] p-4 flex justify-between items-center border-border dark:border-[#313D45]">
        <div className="flex justify-end w-full space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowDeleteAlert(true)}
                className="text-red-500 focus-text-red-500"
              >Delete Chat</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#E9EDEF]">Delete Chat</AlertDialogTitle>
            <AlertDialogDescription className="text-[#8696A0]">
              Are you sure you want to delete this chat? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-[#2A3942] text-[#E9EDEF] hover:bg-[#364147] hover:text-[#E9EDEF]"
              onClick={() => setShowDeleteAlert(false)}
            >Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {children}
    </div>
  )
}