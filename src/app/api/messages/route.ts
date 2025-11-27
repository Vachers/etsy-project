// ========================================
// Project Messages API
// ========================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer, getProjectChannel, PUSHER_EVENTS, PusherMessage } from "@/lib/pusher";

// GET /api/messages?projectId=xxx - Get messages for a project
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const cursor = searchParams.get("cursor");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // TODO: Check if user is a member of this project
    // const isMember = await checkProjectMembership(session.user.id, projectId);
    // if (!isMember) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const messages = await prisma.projectMessage.findMany({
      where: { projectId },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      messages: messages.reverse(),
      nextCursor: messages.length === limit ? messages[0].id : null,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/messages - Send a new message
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { projectId, content } = body;

    if (!projectId || !content?.trim()) {
      return NextResponse.json(
        { error: "Project ID and content are required" },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // TODO: Check if user is a member of this project
    // const isMember = await checkProjectMembership(user.id, projectId);
    // if (!isMember) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    // Create message
    const message = await prisma.projectMessage.create({
      data: {
        content: content.trim(),
        projectId,
        senderId: user.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Trigger Pusher event
    const pusherMessage: PusherMessage = {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      senderName: message.sender.name || "Anonymous",
      senderAvatar: message.sender.image || undefined,
      projectId: message.projectId,
      createdAt: message.createdAt.toISOString(),
    };

    await pusherServer.trigger(
      getProjectChannel(projectId),
      PUSHER_EVENTS.NEW_MESSAGE,
      pusherMessage
    );

    // Log activity
    await prisma.projectActivityLog.create({
      data: {
        action: "COMMENT_ADDED",
        description: `Yeni mesaj gönderildi`,
        projectId,
        userId: user.id,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


