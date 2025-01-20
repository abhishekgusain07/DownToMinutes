import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Runs every 10 minutes
export const maxDuration = 10; // This ensures our function doesn't timeout
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Log the current time to verify the cron is running
    const currentTime = new Date().toISOString();
    console.log(`Cron job executed at: ${currentTime}`);

    // Example: Count active users in the last 10 minutes
    // const activeUsers = await prisma.user.count({
    //   where: {
    //     lastActive: {
    //       gte: new Date(Date.now() - 10 * 60 * 1000) // Last 10 minutes
    //     }
    //   }
    // });

    // You can add your logic here
    // For example: Check for pending notifications, update user streaks, etc.

    return NextResponse.json(
      { 
        success: true, 
        message: 'Cron job executed successfully',
        executedAt: currentTime
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
