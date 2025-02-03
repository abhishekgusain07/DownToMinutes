"use client";

import React, { useEffect, useState } from 'react';
import HeatMap from '@uiw/react-heat-map';
import { subDays, format, startOfYear, eachDayOfInterval } from 'date-fns';

interface ActivityCalendarProps {
    data?: { date: string; count: number }[];
}

export const ActivityCalendar = ({ data }: ActivityCalendarProps) => {
    const [value, setValue] = useState<{ date: string; count: number }[]>([]);

    useEffect(() => {
        if (data) {
            setValue(data);
        } else {
            setValue([]);
        }
    }, [data]);

    return (
        <div className="activity-calendar bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <HeatMap
                value={value}
                width={720}
                style={{ color: '#148B47' }}
                startDate={subDays(new Date(), 365)}
                rectSize={12}
                space={4}
                legendCellSize={0}
                rectProps={{
                    rx: 2,
                }}
            />
            <style jsx global>{`
                .activity-calendar rect:hover {
                    stroke: #555;
                    stroke-width: 1px;
                    transition: all 0.2s ease;
                }
            `}</style>
        </div>
    );
};
