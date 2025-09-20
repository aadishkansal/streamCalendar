import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

export default async function RootPage() {
  const session = await getServerSession()
  
  if (session) {
    redirect('/dashboard')
  }
  
  // Import your existing home page component
  const HomePage = await import('./(app)/page')
  return <HomePage.default params={Promise.resolve({ projectId: '' })} />
}
