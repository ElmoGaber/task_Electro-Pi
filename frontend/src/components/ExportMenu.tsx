import { useTranslation } from 'react-i18next'
import { useState, useRef, useEffect } from 'react'
import type { Task } from '@/types'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface ExportMenuProps {
  tasks: Task[] | undefined
  pageRef?: React.RefObject<HTMLDivElement | null>
}

export function ExportMenu({ tasks, pageRef }: ExportMenuProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [exportingPDF, setExportingPDF] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const exportCSV = () => {
    if (!tasks?.length) return
    const headers = ['Title', 'Description', 'Status', 'Priority', 'Due Date']
    const rows = tasks.map((t) => [t.title, t.description, t.status, t.priority, new Date(t.dueDate).toLocaleDateString()])
    const csv = [headers.join(','), ...rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(','))].join('\n')
    download(csv, 'tasks.csv', 'text/csv')
    setOpen(false)
  }

  const exportJSON = () => {
    if (!tasks?.length) return
    const json = JSON.stringify(tasks, null, 2)
    download(json, 'tasks.json', 'application/json')
    setOpen(false)
  }

  const exportPDF = async () => {
    if (!tasks?.length) return
    setExportingPDF(true)
    try {
      const element = pageRef?.current || document.querySelector('.task-list') || document.querySelector('main')
      if (!element) return
      const canvas = await html2canvas(element as HTMLElement, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      let heightLeft = pdfHeight
      let position = 0
      const pageHeight = pdf.internal.pageSize.getHeight()
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
      heightLeft -= pageHeight
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
        heightLeft -= pageHeight
      }
      pdf.save('tasks.pdf')
    } catch {
      // fallback
    } finally {
      setExportingPDF(false)
      setOpen(false)
    }
  }

  return (
    <div className="export-menu" ref={ref}>
      <button className="button button-secondary button-sm" onClick={() => setOpen(!open)}>
        {t('dashboard.export')} ▾
      </button>
      {open && (
        <div className="export-dropdown">
          <button onClick={exportCSV}>{t('export.csv')}</button>
          <button onClick={exportJSON}>{t('export.json')}</button>
          <button onClick={exportPDF} disabled={exportingPDF}>
            {exportingPDF ? t('settings.saving', 'Exporting...') : t('export.pdf')}
          </button>
        </div>
      )}
    </div>
  )
}

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
