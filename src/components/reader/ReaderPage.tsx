import { useTranslation } from 'react-i18next'
import { Upload, BookOpen } from 'lucide-react'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { useBookStore } from '../../stores/bookStore'

export function ReaderPage() {
  const { t } = useTranslation()
  const { books } = useBookStore()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">{t('reader.title')}</h1>
        <Button>
          <Upload className="mr-2" size={20} />
          {t('reader.importBooks')}
        </Button>
      </div>

      {books.length === 0 ? (
        <Card className="p-8 text-center">
          <BookOpen className="mx-auto mb-4 text-slate-500" size={48} />
          <p className="text-slate-500">{t('common.noBooks')}</p>
          <Button className="mt-4">
            <Upload className="mr-2" size={20} />
            {t('reader.importBooks')}
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {books.map((book) => (
            <Card key={book.id} className="group cursor-pointer">
              <div className="aspect-[2/3] bg-slate-800 rounded-lg mb-3 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                  <BookOpen className="text-slate-600" size={32} />
                </div>
              </div>
              <h3 className="font-medium text-slate-200 truncate">{book.title}</h3>
              <p className="text-sm text-slate-500 truncate">{book.author}</p>
              <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5">
                <div
                  className="bg-sky-500 h-full rounded-full"
                  style={{ width: `${book.progress}%` }}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
