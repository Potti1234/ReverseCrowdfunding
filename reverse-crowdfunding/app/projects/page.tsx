'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { handleVerify } from './verify'

// Sample project data
const initialProjects = [
  {
    id: 1,
    title: 'Community Garden Expansion',
    description:
      'Expand the local community garden with more plots and a greenhouse.',
    image: '/placeholder.svg?height=200&width=400',
    requestedAmount: 250000,
    currentAmount: 125000,
    votes: 24,
    userVote: null
  },
  {
    id: 2,
    title: 'Youth Coding Workshop',
    description:
      'Fund a series of coding workshops for underprivileged youth in our community.',
    image: '/placeholder.svg?height=200&width=400',
    requestedAmount: 150000,
    currentAmount: 85000,
    votes: 18,
    userVote: 'up'
  },
  {
    id: 3,
    title: 'Public Art Installation',
    description:
      'Commission local artists to create public art installations in the downtown area.',
    image: '/placeholder.svg?height=200&width=400',
    requestedAmount: 300000,
    currentAmount: 120000,
    votes: -5,
    userVote: 'down'
  },
  {
    id: 4,
    title: 'Homeless Shelter Renovation',
    description:
      'Renovate the local homeless shelter with new beds, kitchen equipment, and facilities.',
    image: '/placeholder.svg?height=200&width=400',
    requestedAmount: 500000,
    currentAmount: 350000,
    votes: 42,
    userVote: null
  },
  {
    id: 5,
    title: 'Clean Energy Initiative',
    description:
      'Install solar panels on community buildings to reduce energy costs and carbon footprint.',
    image: '/placeholder.svg?height=200&width=400',
    requestedAmount: 400000,
    currentAmount: 180000,
    votes: 31,
    userVote: null
  }
]

export default function ProjectsPage () {
  const [projects, setProjects] = useState(initialProjects)
  const [isVerified, setIsVerified] = useState(false)

  const handleVote = (id: number, voteType: 'up' | 'down') => {
    if (!isVerified) {
      handleVerify(setIsVerified)
      return
    }
    setProjects(
      projects.map(project => {
        if (project.id === id) {
          // If user already voted this way, remove the vote
          if (project.userVote === voteType) {
            return {
              ...project,
              votes: voteType === 'up' ? project.votes - 1 : project.votes + 1,
              userVote: null
            }
          }
          // If user voted the opposite way, change the vote (counts as 2)
          else if (project.userVote !== null) {
            return {
              ...project,
              votes: voteType === 'up' ? project.votes + 2 : project.votes - 2,
              userVote: voteType
            }
          }
          // If user hasn't voted yet
          else {
            return {
              ...project,
              votes: voteType === 'up' ? project.votes + 1 : project.votes - 1,
              userVote: voteType
            }
          }
        }
        return project
      })
    )
  }

  return (
    <div className='p-4 space-y-6'>
      <h1 className='text-2xl font-bold'>Projects</h1>

      <div className='space-y-4'>
        {projects.map(project => (
          <Card key={project.id} className='overflow-hidden'>
            <Image
              src={project.image || '/placeholder.svg'}
              alt={project.title}
              width={400}
              height={200}
              className='w-full h-48 object-cover'
            />
            <CardHeader className='pb-2'>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className='pb-2'>
              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span>
                    ${(project.currentAmount / 100).toFixed(0)} raised
                  </span>
                  <span>
                    ${(project.requestedAmount / 100).toFixed(0)} goal
                  </span>
                </div>
                <Progress
                  value={
                    (project.currentAmount / project.requestedAmount) * 100
                  }
                  className='h-2'
                />
              </div>
            </CardContent>
            <CardFooter className='flex justify-between pt-0'>
              <div className='flex items-center gap-1'>
                <button
                  onClick={() => handleVote(project.id, 'up')}
                  className='p-2'
                >
                  <ArrowUp
                    className={cn(
                      'h-5 w-5',
                      project.userVote === 'up'
                        ? 'fill-green-500 text-green-500'
                        : 'text-muted-foreground'
                    )}
                  />
                </button>
                <span
                  className={cn(
                    'font-medium',
                    project.votes > 0
                      ? 'text-green-500'
                      : project.votes < 0
                      ? 'text-red-500'
                      : ''
                  )}
                >
                  {project.votes}
                </span>
                <button
                  onClick={() => handleVote(project.id, 'down')}
                  className='p-2'
                >
                  <ArrowDown
                    className={cn(
                      'h-5 w-5',
                      project.userVote === 'down'
                        ? 'fill-red-500 text-red-500'
                        : 'text-muted-foreground'
                    )}
                  />
                </button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
