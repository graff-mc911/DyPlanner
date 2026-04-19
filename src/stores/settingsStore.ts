import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppSettings, LanguageCode, Theme } from '../types'

const defaultSettings: AppSettings = {
  language: 'uk',
  theme: 'dark',
  fontScale: 1,
  reader: {
    fontSize: 18,
    fontFamily: 'sans',
    lineHeight: 1.6,
    margins: 20,
    textAlign: 'justify',
    theme: 'dark',
    brightness: 1,
  },
  player: {
    autoPlay: false,
    volume: 0.8,
    playbackRate: 1,
    miniPlayer: true,
  },
  planner: {
    defaultView: 'day',
    startOfWeek: 1,
    pomodoroDuration: 25,
  },
}

interface SettingsState extends AppSettings {
  setLanguage: (lang: LanguageCode) => void
  setTheme: (theme: Theme) => void
  updateReader: (settings: Partial<AppSettings['reader']>) => void
  updatePlayer: (settings: Partial<AppSettings['player']>) => void
  updatePlanner: (settings: Partial<AppSettings['planner']>) => void
  reset: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),

      updateReader: (settings) =>
        set((state) => ({ reader: { ...state.reader, ...settings } })),

      updatePlayer: (settings) =>
        set((state) => ({ player: { ...state.player, ...settings } })),

      updatePlanner: (settings) =>
        set((state) => ({ planner: { ...state.planner, ...settings } })),

      reset: () => set(defaultSettings),
    }),
    { name: 'dyplanner-settings' }
  )
)
