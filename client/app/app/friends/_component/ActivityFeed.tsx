"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardPage from "../dashboard/page";

export const ActivityFeed = () => {
  return (
    <Card className="h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Search Friends</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100vh-13rem)] overflow-y-auto">
        <DashboardPage />
      </CardContent>
    </Card>
  );
};
