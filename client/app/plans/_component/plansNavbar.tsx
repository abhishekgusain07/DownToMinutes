"use client";

import { Calendar } from "@/components/ui/calendar";
import { usePlanDateStore } from '@/store/usePlanDateStore';

const PlansNavbar = () => {
    const { selectedDate, setSelectedDate } = usePlanDateStore();

    const handleDateChange = (value: Date) => {
        if (value instanceof Date) {
            setSelectedDate(value);
        }
    };

    return (
        <div className="p-4 border-b">
            <Calendar
                onDayClick={handleDateChange}
                selected={selectedDate}
                mode="single"
            />
        </div>
    );
};

export default PlansNavbar;