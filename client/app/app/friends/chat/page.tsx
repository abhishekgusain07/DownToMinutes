import { Laptop } from "lucide-react";
import SearchComponent from "./_component/search";
// import SearchComponent from "./_components/search";

export default function ChatHomeScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background text-center">
      <div className="max-w-md space-y-6 p-8">
        <Laptop className="w-72 h-72 mx-auto text-muted-foreground/30" />
        <div className="space-y-4">
          <h2 className="text-foreground text-4xl font-semibold tracking-tight">
            Connect & Chat
          </h2>
          <p className="text-muted-foreground text-lg">
            Start a conversation with your friends.
          </p>
          <SearchComponent onSidebar={false} />
        </div>
      </div>
    </div>
  )
}