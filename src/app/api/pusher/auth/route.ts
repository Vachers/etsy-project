// ========================================
// Pusher Auth Endpoint
// ========================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.text();
    const params = new URLSearchParams(body);
    const socket_id = params.get("socket_id");
    const channel_name = params.get("channel_name");

    if (!socket_id || !channel_name) {
      return NextResponse.json(
        { error: "Missing socket_id or channel_name" },
        { status: 400 }
      );
    }

    // For private channels, verify user has access
    if (channel_name.startsWith("private-project-")) {
      const projectId = channel_name.replace("private-project-", "");
      
      // TODO: Check if user is a member of this project
      // const isMember = await checkProjectMembership(session.user.id, projectId);
      // if (!isMember) {
      //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      // }
    }

    // Authorize the user for the channel
    const auth = pusherServer.authorizeChannel(socket_id, channel_name, {
      user_id: session.user.id || session.user.email || "anonymous",
      user_info: {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
    });

    return NextResponse.json(auth);
  } catch (error) {
    console.error("Pusher auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


