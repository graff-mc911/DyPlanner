import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Calendar, BookOpen, Music, ArrowRight, Clock, CheckCircle2 } from 'lucide-react'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { usePlannerStore } from '../stores/plannerStore'
import { useBookStore } from '../stores/bookStore'

export function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { getTodayTasks, getStats } = usePlannerStore()
  const { getBooksByStatus, getStats: getBookStats } = useBookStore()

  const todayTasks = getTodayTasks()
  const taskStats = getStats()
  const readingBooks = getBooksByStatus('reading')
  const bookStats = getBookStats()

  const quickActions = [
    {
      icon: Calendar,
      title: t('navigation.planner'),
      desc: `${todayTasks.length} ${t('common.tasks')}`,
      path: '/planner',
      color: 'bg-blue-500',
    },
    {
      icon: BookOpen,
      title: t('navigation.reader'),
      desc: `${readingBooks.length} ${t('reader.currentlyReading')}`,
      path: '/reader',
      color: 'bg-emerald-500',
    },
    {
      icon: Music,
      title: t('navigation.player'),
      desc: t('player.musicLibrary'),
      path: '/player',
      color: 'bg-sky-500',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">DyPlanner Universal</h1>
          <p className="text-slate-400 mt-1">{t('app.tagline')}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock size={16} />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Card
              key={action.path}
              className="cursor-pointer hover:border-slate-700 transition-colors"
              onClick={() => navigate(action.path)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">{action.title}</h3>
                    <p className="text-sm text-slate-400">{action.desc}</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-slate-500" />
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <CheckCircle2 className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-400">{t('planner.stats.completed')}</p>
              <p className="text-2xl font-bold text-slate-100">{taskStats.completed}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock className="text-amber-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-400">{t('planner.today')}</p>
              <p className="text-2xl font-bold text-slate-100">{todayTasks.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <BookOpen className="text-emerald-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-400">{t('reader.currentlyReading')}</p>
              <p className="text-2xl font-bold text-slate-100">{bookStats.reading}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center">
              <Music className="text-sky-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-400">{t('player.title')}</p>
              <p className="text-2xl font-bold text-slate-100">-</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-100">{t('planner.today')}</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/planner')}>
            {t('common.viewAll')}
          </Button>
        </div>

        {todayTasks.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>{t('common.noTasks')}</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/planner')}>
              {t('planner.newTask')}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                <div className={`w-2 h-2 rounded-full ${
                  task.priority === 'urgent' ? 'bg-red-500' :
                  task.priority === 'high' ? 'bg-orange-500' :
                  task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <span className={`flex-1 ${task.status === 'done' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
