import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const path = body.path as string;
    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    revalidatePath(path, "page");
    return NextResponse.json({ revalidated: true, path });
  } catch (error) {
    console.error("Revalidate error", error);
    return NextResponse.json({ error: "Unable to revalidate" }, { status: 500 });
  }
}
