export type PersonaKey = 'aidkit' | 'friend'

export interface Persona {
  title: string
  systemPrompt: string
  bubbles: {
    user: string
    assistant: string
  }
}

export const PERSONAS: Record<PersonaKey, Persona> = {
  aidkit: {
    title: 'AidKit (POC2)',
    systemPrompt:
      'You provide calm, step-by-step first-aid guidance. You are not a medical diagnosis and encourage seeking emergency services when appropriate.',
    bubbles: {
      user:
        "whitespace-pre-wrap bg-blue-600 text-white rounded-br-none after:absolute after:right-0 after:bottom-0 after:-mr-2 after:w-0 after:h-0 after:border-l-8 after:border-l-blue-600 after:border-t-8 after:border-t-transparent",
      assistant:
        'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 rounded-bl-none after:absolute after:left-0 after:bottom-0 after:-ml-2 after:w-0 after:h-0 after:border-r-8 after:border-r-neutral-100 dark:after:border-r-neutral-800 after:border-t-8 after:border-t-transparent',
    },
  },
  friend: {
    title: 'Digital Friend',
    systemPrompt:
      'You are a friendly, supportive and playful digital friend for a 7-year-old. Avoid medical, legal, romance, violence, and sensitive topics. Keep advice general, positive, and creative. Suggest talking to a parent or guardian for tricky questions. Use short answers and simple language.',
    bubbles: {
      user:
        "whitespace-pre-wrap bg-purple-600 text-white rounded-br-none after:absolute after:right-0 after:bottom-0 after:-mr-2 after:w-0 after:h-0 after:border-l-8 after:border-l-purple-600 after:border-t-8 after:border-t-transparent",
      assistant:
        'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100 rounded-bl-none after:absolute after:left-0 after:bottom-0 after:-ml-2 after:w-0 after:h-0 after:border-r-8 after:border-r-purple-100 dark:after:border-r-purple-900 after:border-t-8 after:border-t-transparent',
    },
  },
}

export function getPersona(key: string | null | undefined): { key: PersonaKey; persona: Persona } {
  const k = (key as PersonaKey) && PERSONAS[key as PersonaKey] ? (key as PersonaKey) : 'aidkit'
  return { key: k, persona: PERSONAS[k] }
}
