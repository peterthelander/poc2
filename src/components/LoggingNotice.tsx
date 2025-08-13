import React, { useState } from 'react'
import { hasLogConsent } from '../lib/remoteLog'

export default function LoggingNotice() {
  const [hidden, setHidden] = useState(false)
  const consent = localStorage.getItem('poc2.logConsent')
  if (hasLogConsent() || consent === 'no' || hidden) return null
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-100 text-gray-800 text-sm p-2 flex items-center justify-center gap-2">
      <span className="text-center">
        Logging lets a parent review messages for this session. No personal data beyond message text is intentionally collected.
      </span>
      <button
        className="underline"
        onClick={() => {
          localStorage.setItem('poc2.logConsent', 'yes')
          setHidden(true)
        }}
      >
        Allow
      </button>
      <button
        className="underline"
        onClick={() => {
          localStorage.setItem('poc2.logConsent', 'no')
          setHidden(true)
        }}
      >
        Not now
      </button>
    </div>
  )
}
