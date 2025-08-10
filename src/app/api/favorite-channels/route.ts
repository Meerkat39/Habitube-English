import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

// GET: お気に入りチャンネル一覧取得
export async function GET() {
  const channels = await prisma.favoriteChannel.findMany();
  return NextResponse.json(channels);
}

// POST: お気に入りチャンネル追加
// 新しいチャンネルIDをDBに登録し、登録内容を返却
export async function POST(req: Request) {
  // 追加処理: リクエストボディからchannelIdを取得
  const { channelId } = await req.json();
  // channelIdが未指定ならエラー返却
  if (!channelId) {
    return NextResponse.json(
      { error: "channelId is required" },
      { status: 400 }
    );
  }
  // DBに新しいお気に入りチャンネルを登録
  const created = await prisma.favoriteChannel.create({
    data: { channelId, userId: 1 }, // MVP: userIdは仮
  });
  // 登録したチャンネル情報を返却
  return NextResponse.json(created);
}

// PUT: お気に入りチャンネル編集
// URL例: /api/favorite-channels?id=1
export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  const { channelId } = await req.json();
  if (!id || !channelId) {
    return NextResponse.json(
      { error: "id and channelId are required" },
      { status: 400 }
    );
  }
  // 指定IDのチャンネルIDを更新
  const updated = await prisma.favoriteChannel.update({
    where: { id },
    data: { channelId },
  });
  return NextResponse.json(updated);
}

// DELETE: お気に入りチャンネル削除
// URL例: /api/favorite-channels?id=1
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  // 指定IDのチャンネルを削除
  await prisma.favoriteChannel.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
