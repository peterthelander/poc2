export type Theme = 'light' | 'dark' | 'system'

const KEY = 'poc2.theme'

function systemPref(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function getTheme(): Theme {
  return (localStorage.getItem(KEY) as Theme) || 'system'
}

export function applyTheme(t: Theme) {
  const root = document.documentElement
  const mode = t === 'system' ? systemPref() : t
  root.classList.toggle('dark', mode === 'dark')
  localStorage.setItem(KEY, t)
}

export function toggleTheme() {
  const t = getTheme()
  const next = t === 'dark' ? 'light' : 'dark'
  applyTheme(next)
}

export function initTheme() {
  // run before React renders
  applyTheme(getTheme())
  // keep in sync with system changes when in 'system'
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.onchange = () => {
    if (getTheme() === 'system') applyTheme('system')
  }
}

