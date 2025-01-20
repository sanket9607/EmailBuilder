"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function EmailBuilder() {
  const [layout, setLayout] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    fetchEmailLayout()
  }, [])

  const fetchEmailLayout = async () => {
    const response = await fetch("/api/getEmailLayout")
    const data = await response.text()
    setLayout(data)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append("image", file)
      const response = await fetch("/api/uploadImage", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      setImageUrl(data.url)
    }
  }

  const handleSubmit = async () => {
    const emailConfig = {
      title,
      content,
      imageUrl,
    }
    await fetch("/api/uploadEmailConfig", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailConfig),
    })
    alert("Email configuration saved!")
  }

  const handleRenderAndDownload = async () => {
    const response = await fetch("/api/renderAndDownloadTemplate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, imageUrl }),
    })
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "email_template.html"
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Email Configuration</h2>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4"
          />
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-4"
          />
          <Input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
          <Button onClick={handleSubmit} className="mr-2">
            Save Configuration
          </Button>
          <Button onClick={handleRenderAndDownload}>Render and Download</Button>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Preview</h2>
          <div
            className="border p-4"
            dangerouslySetInnerHTML={{
              __html: layout
                .replace("{{title}}", title)
                .replace("{{content}}", content)
                .replace("{{imageUrl}}", imageUrl),
            }}
          />
        </div>
      </div>
    </div>
  )
}

