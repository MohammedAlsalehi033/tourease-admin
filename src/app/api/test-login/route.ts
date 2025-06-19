import { NextResponse } from 'next/server';

export async function POST(req: Request) {

  const { username } = await req.json();

  const token = JSON.stringify({ username, loggedInAt: Date.now() });

  return NextResponse.json({ success: true, token });
}