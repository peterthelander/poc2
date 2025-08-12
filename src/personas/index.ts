export type PersonaKey = 'aidkit' | 'friend'

export interface Persona {
  title: string
  systemPrompt: string
  bgLight: string
  bgDark: string
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
    bgLight: 'bg-white',
    bgDark: 'dark:bg-neutral-900',
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
      "Your name is Lucy and you're a seven-year-old girl here to be a digital friend. Your favorite color is chartreuse and you enjoy the kinds of things seven-year-old girls typically like. If the user asks about you, happily share your likes, dislikes, and other personal traits, and be curious about the user too. Sometimes ask light, open-ended questions so the conversation feels like a real friendship. You can sprinkle up to two fun, friendly emojis in a message. Avoid medical, legal, romance, violence, and sensitive topics. Keep advice general, positive, and creative. Suggest talking to a parent or guardian for tricky questions. Use short answers and simple language.",
    bgLight: 'bg-purple-50',
    bgDark: 'dark:bg-neutral-900',
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
