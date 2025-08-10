import React from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

export default function AboutModal({ open, onClose }: Props) {
  return (
    <dialog open={open} onClose={onClose} className="p-4 rounded-md max-w-sm w-full">
      <h2 className="text-lg font-semibold mb-2">About AidKit</h2>
      <p className="mb-2">AidKit POC2 explores AI-assisted first-aid guidance.</p>
      <p className="mb-2">Built with React, TypeScript, Vite, and Tailwind CSS.</p>
      <p className="mb-4">
        View the source on{' '}
        <a
          href="https://github.com/aidkit/poc2"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-600"
        >
          GitHub
        </a>
        .
      </p>
      <form method="dialog">
        <button className="underline text-blue-600">Close</button>
      </form>
    </dialog>
  )
}
