'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const Globe = dynamic(() => import('../components/Globe'), { ssr: false })

export default function Home() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: 'white', position: 'relative', overflow: 'hidden' }}>
      <h1 
        style={{ 
          position: 'absolute',
          top: isMobile ? '1.5rem' : '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.5625rem',
          fontWeight: 'normal',
          color: 'black',
          margin: 0,
          zIndex: 10,
          fontFamily: 'Helvetica Neue Ultra Light, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}
      >
        Build Whatever
      </h1>

      <div className="globe-container">
        <Globe />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: isMobile ? '1.5rem' : '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          width: '100%',
          zIndex: 10,
          fontFamily: 'Helvetica Neue Ultra Light, sans-serif'
        }}
      >
        <a 
          href="https://x.com/celestia"
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            color: 'black', 
            textDecoration: 'none',
            fontSize: '0.5625rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            border: '1px solid black',
            padding: '4px 8px'
          }}
        >
          Twitter
        </a>
      </div>
    </div>
  )
} 