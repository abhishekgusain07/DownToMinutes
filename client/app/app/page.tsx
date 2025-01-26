"use client"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const MainApp = () => {
    const router = useRouter()

    useEffect(() => {
        router.push("/app/goals")
    }, [])

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <Loader2 className="animate-spin size-4" />
        </div>
    )
}

export default MainApp;