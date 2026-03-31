'use client'

import { useState } from 'react'

export default function UploadTest() {
  const [file, setFile] = useState<File | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  async function handleUpload() {
    if (!file) return

    try {
      setIsUploading(true)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setUploadedUrl(data.url)
    } catch (error) {
      console.error(error)
      alert('Upload mislukt')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={handleUpload} disabled={!file || isUploading}>
        {isUploading ? 'Uploading...' : 'Upload to Wasabi'}
      </button>

      {uploadedUrl && (
        <div style={{ marginTop: 16 }}>
          <div style={{ wordBreak: 'break-all' }}>{uploadedUrl}</div>

          <img
            src={uploadedUrl}
            alt="Uploaded preview"
            style={{ width: 200, marginTop: 12, borderRadius: 12 }}
          />
        </div>
      )}
    </div>
  )
}