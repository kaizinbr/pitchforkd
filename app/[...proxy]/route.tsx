export const runtime = "nodejs"

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This route was previously a catch-all proxy to a third-party backend.
// In this project the backend is handled via the local API routes, so
// we keep a minimal handler here to avoid accidental usage.

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  return new NextResponse("Not Found", { status: 404 });
}

export async function POST(_req: NextRequest) {
  return new NextResponse("Not Found", { status: 404 });
}
