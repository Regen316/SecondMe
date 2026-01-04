import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to dashboard for now
  // Later this can be a landing page for unauthenticated users
  redirect('/dashboard')
}
