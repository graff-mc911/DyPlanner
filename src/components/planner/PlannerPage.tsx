import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Calendar, List, LayoutGrid } from 'lucide-react'
import { Button } from '../common/Button'
import { Card } from '../common/Card'

export function PlannerPage() {
  const { t } = useTranslation()
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'calendar'>('list')
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">{t('planner.title')}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List size={20} />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid size={20} />
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('calendar')}
          >
            <Calendar size={20} />
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2" size={20} />
            {t('planner.newTask')}
          </Button>
        </div>
      </div>

      {/* Content Placeholder */}
      <Card className="p-8 text-center">
        <p className="text-slate-500 mb-4">{t('common.loading')}</p>
        <p className="text-sm text-slate-400">
          Planner functionality will be implemented here.
        </p>
      </Card>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">{t('planner.newTask')}</h2>
            <p className="text-slate-400 mb-4">Task creation form will be here.</p>
            <Button onClick={() => setShowAddModal(false)}>{t('common.close')}</Button>
          </Card>
        </div>
      )}
    </div>
  )
}