"use client"

import { use } from 'react'
import CalendarApp from '../components/CalendarApp'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'

interface PageProps {
  params: Promise<{
    projectId: string
  }>
}

export default function CalendarPage({ params }: PageProps) {
  // Unwrap the params Promise using React.use()
  const { projectId } = use(params)
  
  return (<>
    {/* <CalendarApp projectId={projectId} /> */}
    <Navbar/>
    <Hero/>
    </>
  )
}