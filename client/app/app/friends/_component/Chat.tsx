"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AllFriends from "./allFriends";

export const Chat = () => {
  return (
    <Card className="h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">All Friends</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100vh-13rem)] overflow-y-auto">
        <AllFriends />
      </CardContent>
    </Card>
  );
};
