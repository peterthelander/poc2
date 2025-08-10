import React from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

export default function PrivacyModal({ open, onClose }: Props) {
  return (
    <dialog open={open} onClose={onClose} className="p-4 rounded-md max-w-sm w-full">
      <h2 className="text-lg font-semibold mb-2">Privacy</h2>
      <p className="mb-2">This is a proof of concept.</p>
      <p className="mb-2">No server-side storage; your data stays in your browser.</p>
      <p className="mb-4">
        API calls are proxied through <code>/api/chat</code>.
      </p>
      <form method="dialog">
        <button className="underline text-blue-600">Close</button>
      </form>
    </dialog>
  )
}
