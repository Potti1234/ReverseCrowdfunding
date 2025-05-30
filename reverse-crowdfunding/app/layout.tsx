import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BottomNavigation } from '@/components/bottom-navigation'
import MiniKitProvider from '@/components/minikit-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Crowdfunding App',
  description: 'Vote and fund projects you care about'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <MiniKitProvider>
        <body className={inter.className}>
          <div className='flex flex-col min-h-screen max-w-md mx-auto border-x'>
            <main className='flex-1 pb-16'>{children}</main>
            <BottomNavigation />
          </div>
        </body>
      </MiniKitProvider>
    </html>
  )
}
