import { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { RightPanel } from './RightPanel'
import { BgAnimation } from './BgAnimation'
import { AssistantChat } from './AssistantChat'
import { SearchOverlay } from './SearchOverlay'
import type { Task } from '@/types'

interface AppLayoutProps {
  children: React.ReactNode
  tasks?: Task[]
  showRightPanel?: boolean
  onSearch?: (query: string) => void
}

export function AppLayout({ children, tasks, showRightPanel = true, onSearch }: AppLayoutProps) {
  const [searchValue, setSearchValue] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setSidebarOpen(!e.matches)
    handler(mq)
    mq.addEventListener('change', handler as (e: MediaQueryListEvent) => void)
    return () => mq.removeEventListener('change', handler as (e: MediaQueryListEvent) => void)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((p) => !p)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleSearch = (query: string) => {
    setSearchValue(query)
    onSearch?.(query)
  }

  return (
    <div className={`app-layout${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
      <BgAnimation />
      <Sidebar collapsed={!sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      <div className="main-wrapper">
        <TopNav searchValue={searchValue} onSearch={handleSearch} onSearchClick={() => setSearchOpen(true)} />
        <button className="hamburger" onClick={() => setSidebarOpen((p) => !p)} type="button">
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
        <main className={`main-content${showRightPanel ? '' : ' main-content--full'}`}>
          {children}
        </main>
        {showRightPanel && <RightPanel tasks={tasks} />}
      </div>
      <AssistantChat />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
