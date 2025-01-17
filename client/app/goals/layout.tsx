import { ReactNode } from "react"
import { isAuthorized } from "@/utils/data/user/isAuthorized"
import { currentUser } from "@clerk/nextjs/server"
import { Loader2 } from "lucide-react"
import NotAuthorized from "@/components/not-authorized"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await currentUser()
  const { authorized, message } = await isAuthorized(user?.id!)
  if (authorized == true) {
    return <NotAuthorized />
  }
  return (
    <div className="min-h-screen w-full">
        {children}
    </div>
  )
}
