import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { RightPanel } from './RightPanel'
import { BgAnimation } from './BgAnimation'
import { AssistantChat } from './AssistantChat'
import type { Task } from '@/types'

interface AppLayoutProps {
  children: React.ReactNode
  tasks?: Task[]
  showRightPanel?: boolean
  onSearch?: (query: string) => void
}

export function AppLayout({ children, tasks, showRightPanel = true, onSearch }: AppLayoutProps) {
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (query: string) => {
    setSearchValue(query)
    onSearch?.(query)
  }

  return (
    <div className="app-layout">
      <BgAnimation />
      <Sidebar />
      <div className="main-wrapper">
        <TopNav searchValue={searchValue} onSearch={handleSearch} />
        <main className={`main-content${showRightPanel ? '' : ' main-content--full'}`}>
          {children}
        </main>
        {showRightPanel && <RightPanel tasks={tasks} />}
      </div>
      <AssistantChat />
    </div>
  )
}
