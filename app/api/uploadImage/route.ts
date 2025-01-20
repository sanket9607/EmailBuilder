import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(request: Request) {
  const data = await request.formData()
  const file: File | null = data.get("image") as unknown as File

  if (!file) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const filename = Date.now() + file.name.replaceAll(" ", "_")
  const filepath = path.join(process.cwd(), "public", "uploads", filename)
  await writeFile(filepath, buffer)

  return NextResponse.json({ success: true, url: `/uploads/${filename}` })
}

