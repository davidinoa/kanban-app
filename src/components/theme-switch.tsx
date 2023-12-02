'use client'

import { Switch } from '@nextui-org/switch'

import { useTheme } from 'next-themes'
import DarkThemeIcon from '../assets/icon-dark-theme.svg'
import LightThemeIcon from '../assets/icon-light-theme.svg'

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="dark:bg-gra flex h-12 w-full items-center justify-center gap-6 rounded-lg bg-gray-50 dark:bg-gray-400">
      <LightThemeIcon />
      <Switch
        isSelected={theme === 'dark'}
        onChange={(e) => {
          const newTheme = e.target.checked ? 'dark' : 'light'
          setTheme(newTheme)
        }}
        classNames={{
          thumb: 'w-4 h-4',
          wrapper:
            'w-11 h-6 m-0 group-data-[selected=true]:bg-purple-100 bg-gray-100',
        }}
      />
      <DarkThemeIcon />
    </div>
  )
}
