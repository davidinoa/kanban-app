import { type Metadata } from 'next'
import HomePage from './home-page'

export const metadata: Metadata = {
  title: 'Kanban',
}

export default function Page() {
  return <HomePage />
}
