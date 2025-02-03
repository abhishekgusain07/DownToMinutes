"use client";

import { Calendar } from "@/components/ui/calendar";
import { usePlanDateStore } from "@/store/usePlanDateStore";
import { ActivityCalendar } from "./activityCalendar";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { format } from "date-fns";
import { getActivityData } from "@/utils/data/plans/getActivityData";
import { Loader2 } from "lucide-react";

const PlansNavbar = () => {
    const { selectedDate, setSelectedDate } = usePlanDateStore();
    const [activityData, setActivityData] = useState<{ date: string; count: number }[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    useEffect(() => {
        const fetchActivityData = async () => {
            setLoading(true);
            try {
                const data: { date: string; count: number }[] = await getActivityData();
                const transformedData = data?.reduce<{ date: string; count: number }[]>((acc, plan) => {
                    const date = format(new Date(plan.date), 'yyyy/MM/dd');
                const existingDay = acc.find(d => d.date === date);

                if (existingDay) {
                    existingDay.count += plan.count;
                } else {
                    acc.push({ date, count: plan.count });
                }

                return acc;
            }, []) || [];
                if (isMounted) {
                    setActivityData(transformedData);
                }
            } catch (error) {
                console.error('Error fetching activity data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isMounted) {
            fetchActivityData();
        }
    }, [isMounted]);

    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date);
        }
    };

    if (loading || !isMounted) {
        return <Loader2 className="animate-spin size-4" />;
    }

    return (
        <div className="p-6 border-b bg-gray-50/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-start gap-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                        <Calendar
                            onDayClick={handleDateChange}
                            selected={selectedDate}
                            className="rounded-md"
                        />
                    </div>
                    <div className="flex-1 w-full overflow-x-auto">
                        <ActivityCalendar data={activityData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlansNavbar;