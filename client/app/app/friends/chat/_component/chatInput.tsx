"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { fetchMutation } from "convex/nextjs"
import { useMutation } from "convex/react"
import { Mic, Paperclip, Send, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface FormInputs {
  message: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    } & {
      isFinal: boolean;
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: 'not-allowed' | 'no-speech' | 'network' | string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: (event: Event) => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition?: {
      new (): SpeechRecognition;
    };
  }
}

export default function FormChat({ conversationId, userId }: {
  conversationId: string,
  userId: string
}) {
  // const { userId } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm<FormInputs>()

  const [attachments, setAttachments] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const sendMessage = useMutation(api.chat.sendMessage)

  const onSubmit = async (data: FormInputs) => {
    try {
      for (const imageUrl of attachments) {
        await sendMessage({
          type: "image",
          conversationId: conversationId as Id<"conversations">,
          senderId: userId!,
          content: "Image",
          mediaUrl: imageUrl
        })
      }

      if (data.message.trim()) {
        await sendMessage({
          type: "text",
          conversationId: conversationId as Id<"conversations">,
          senderId: userId!,
          content: data.message
        })
      }

      reset()
      setAttachments([])
    } catch (error) {
      console.log("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  }

  const handleImageUplaod = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return;

    try {
      setIsUploading(true)

      const postUrl = await fetchMutation(api.chat.generateUploadUrl)
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file
      })

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText}`)
      }

      const { storageId } = await result.json()

      const url = await fetchMutation(api.chat.getUploadUrl, {
        storageId
      })

      if (url) {
        setAttachments([...attachments, url])
      }

    } catch (error) {
      console.log("Upload failed:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-muted dark:bg-[#202C33]">
      {attachments?.length > 0 && (
        <div className="p-2 flex gap-2 flex-wrap border-b border-border dark:border-[#313D45]">
          {attachments.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt="attachment"
                className="h-20 w-20 object-cover rounded-md"
              />
              <button onClick={() => removeAttachment(index)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}
        className={`bg-muted dark:bg-[#202C33] p-4 flex items-center space-x-2  ${attachments?.length > 0 && "pb-[5rem]" } `}
      >
        <div className="relative">
          <label htmlFor="file-upload"
            className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium
            ring-offset-background transition-colors focus-visible::outline-none focus-visible:ring-2
            focus-visible:ring-ring focus-visible:ring-offset-2
            disabled:pointer-events-none disabled:opacity-50
            hover:bg-accent hover:text-accent-foreground h-10 w-10"
          >
            <Paperclip className="w-5 h-5" />
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUplaod}
            disabled={isUploading}
          />

        </div>
        <Input
          {...register("message")}
          placeholder={
            isUploading ? "Uploading..." : "Type a message"
          }
          className="flex-1 bg-background dark:bg-[#2A3942] border-none placeholder:text-muted-foreground"
        />
        <Button type="submit" size="icon" disabled={isUploading || !attachments.length && !watch("message")}>
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  )
}