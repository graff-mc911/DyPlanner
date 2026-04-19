import { useTranslation } from 'react-i18next'
import { Music, Video, Upload } from 'lucide-react'
import { Button } from '../common/Button'
import { Card } from '../common/Card'

export function PlayerPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">{t('player.title')}</H1>
        <Button>
          <Upload className="mr-2" size={20} />
          {t('player.importMedia')}
        </Button>
      </div>

      {/* Placeholder */}
      <Card className="p-8 text-center">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
          <Music className="text-slate-500" size={48} />
        </div>
        <p className="text-slate-500">{t('common.loading')}</p>
        <p className="text-sm text-slate-400 mt-2">
          Media player functionality will be implemented here.
        </p>
        <div className="flex gap-2 justify-center mt-4">
          <Button variant="outline">
            <Music className="mr-2" size={20} />
            {t('player.audio')}
          </Button>
          <Button variant="outline">
            <Video className="mr-2" size={20} />
            {t('player.video')}
          </Button>
        </div>
      </Card>
    </div>
  )
}