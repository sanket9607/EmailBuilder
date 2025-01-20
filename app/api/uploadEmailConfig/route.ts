import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(request: Request) {
  const data = await request.json()
  const configPath = path.join(process.cwd(), "public", "emailConfig.json")
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2))
  return NextResponse.json({ success: true })
}

