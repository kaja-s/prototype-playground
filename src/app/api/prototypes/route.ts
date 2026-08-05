import { NextResponse } from "next/server";
import { createPrototype } from "../../../../scripts/create-prototype";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Creating prototypes is only available when running locally" },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name : "";
  const description =
    typeof body?.description === "string" ? body.description : "";

  try {
    const { slug } = await createPrototype({ name, description });
    return NextResponse.json({ slug });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 400 }
    );
  }
}
