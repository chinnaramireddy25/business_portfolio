import React, { useState } from 'react'
import Landing from './components/Landing'
import Admin from './components/Admin'

export default function App() {
  const [view, setView] = useState('landing')
  return (
    <div className="app">
      <header className="topbar">
        <h1>Flipr - Assignment MVP</h1>
        <nav>
          <button onClick={() => setView('landing')}>Landing</button>
          <button onClick={() => setView('admin')}>Admin</button>
        </nav>
      </header>
      <main>{view === 'landing' ? <Landing /> : <Admin />}</main>
    </div>
  )
}
