"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RequestPage from "../friend-requests/request/page";

export const FriendRequests = () => {
  return (
    <Card className="h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Friend Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <RequestPage />
      </CardContent>
    </Card>
  );
};
