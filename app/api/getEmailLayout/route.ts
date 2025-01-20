import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  const layoutPath = path.join(process.cwd(), "public", "layout.html")
  const layout = fs.readFileSync(layoutPath, "utf-8")
  return new NextResponse(layout)
}

