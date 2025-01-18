'use client';
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { fetchLogsForToday } from "@/utils/data/logs/fetchLogsForToday"
import { DayEntry, Entry } from "@/utils/types"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generateDaySummary } from "@/utils/data/gemini/ai";

const AllLogs = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [dayEntry, setDayEntry] = useState<Entry[] | null>(null);
    const [daySummary, setDaySummary] = useState<String | null>(null);
    const [summaryLoading, setSummaryLoading] = useState(false);
    useEffect(() => {
        const fetchDayEntry = async() => {
            const dayEntry: Entry[] | null = await fetchLogsForToday()
            setDayEntry(dayEntry)
            setIsLoading(false)
        }
        fetchDayEntry()
    }, [])
    if(isLoading){
        return (
            <div className="h-screen w-screen flex items-center justify-center"><Loader2 className="animate-spin size-4" /></div>
        )
    }
    async function createDaySummary(dayEntry: Entry[]){
        try {
            setSummaryLoading(true)
            const summary = await generateDaySummary(dayEntry)
            setDaySummary(summary)
        } catch (error) {
            toast.error("Failed to generate day summary")
        } finally {
            setSummaryLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mt-8">
                <h1 className="text-2xl font-bold">All Logs</h1>
            </div>
            <div className="m-6 p-6">
                {
                    dayEntry && dayEntry.length > 0 ? (
                        dayEntry.map((entry, index) => (
                            <div key={index} className="mb-4">
                                <h3 className="text-lg font-bold">{entry.title}</h3>
                                <p className="text-gray-600">{entry.description}</p>
                            </div>
                        ))
                    ) : (
                        <p>No logs found for today.</p>
                    )
                }
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Link href="/logs/create/log">
                    <Button variant="outline">
                        Create Log
                    </Button>
                </Link>
            </div>


            <div className="m-6 p-6">
                <Button variant="outline" onClick={() =>createDaySummary(dayEntry!)} disabled={!dayEntry || dayEntry.length === 0}>
                    {summaryLoading ? "Generating..." : "Generate Day Summary"}
                </Button>
                {
                    daySummary && (
                        <div className="mt-4">
                            <h3 className="text-lg font-bold">Day Summary</h3>
                            <p className="text-gray-600">{daySummary}</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default AllLogs;