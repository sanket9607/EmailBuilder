import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(request: Request) {
  const data = await request.json()
  const layoutPath = path.join(process.cwd(), "public", "layout.html")
  let layout = fs.readFileSync(layoutPath, "utf-8")

  layout = layout
    .replace("{{title}}", data.title)
    .replace("{{content}}", data.content)
    .replace("{{imageUrl}}", data.imageUrl)

  return new NextResponse(layout, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": "attachment; filename=email_template.html",
    },
  })
}

