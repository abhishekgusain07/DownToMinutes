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
            const validData = data
                .filter(item => item.count > 0)
                .map(item => ({
                    date: format(new Date(item.date), 'yyyy/MM/dd'),
                    count: item.count
                }));
            setValue(validData);
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
                startDate={startOfYear(new Date())}
                rectSize={12}
                space={4}
                legendCellSize={0}
                panelColors={{
                    0: '#EBEDF0',
                    4: '#9BE9A8',
                    8: '#40C463',
                    12: '#30A14E',
                    32: '#216E39',
                }}
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
