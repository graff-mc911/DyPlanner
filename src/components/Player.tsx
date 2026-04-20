import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Video } from 'lucide-react'

interface MediaFile {
  id: string
  title: string
  file: File
  type: 'audio' | 'video'
  duration: number
}

export function Player({ language }: { language: 'uk' | 'en' }) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [currentFile, setCurrentFile] = useState<MediaFile | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(80)
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const t = {
    uk: {
      title: 'Медіа-плеєр',
      uploadAudio: 'Завантажити аудіо',
      uploadVideo: 'Завантажити відео',
      supported: 'MP3, WAV, OGG, MP4, WEBM',
      empty: 'Немає файлів. Завантажте медіа.',
      nowPlaying: 'Зараз грає',
      playlist: 'Плейлист'
    },
    en: {
      title: 'Media Player',
      uploadAudio: 'Upload Audio',
      uploadVideo: 'Upload Video',
      supported: 'MP3, WAV, OGG, MP4, WEBM',
      empty: 'No files. Upload media.',
      nowPlaying: 'Now Playing',
      playlist: 'Playlist'
    }
  }[language]

  useEffect(() => {
    const saved = localStorage.getItem('player-files')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setFiles(parsed.map((f: any) => ({ ...f, file: null })))
      } catch (e) {
        console.error('Failed to parse files')
      }
    }
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'video') => {
    const file = e.target.files?.[0]
    if (!file) return

    const mediaFile: MediaFile = {
      id: Date.now().toString(),
      title: file.name.replace(/\.[^/.]+$/, ''),
      file,
      type,
      duration: 0
    }

    const newFiles = [mediaFile, ...files]
    setFiles(newFiles)
    localStorage.setItem('player-files', JSON.stringify(newFiles.map(f => ({ ...f, file: null }))))
    setCurrentFile(mediaFile)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play()
    }
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play()
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t.title}</h2>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileUpload(e, 'audio')}
        accept="audio/*,video/*"
        className="hidden"
      />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors flex flex-col items-center gap-2"
        >
          <Music size={24} className="text-violet-500" />
          <span className="text-sm">{t.uploadAudio}</span>
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors flex flex-col items-center gap-2"
        >
          <Video size={24} className="text-pink-500" />
          <span className="text-sm">{t.uploadVideo}</span>
        </button>
      </div>

      <p className="text-xs text-slate-500 text-center mb-4">{t.supported}</p>

      {/* Player Controls */}
      {currentFile && (
        <div className="bg-slate-800 rounded-lg p-4 mb-4">
          <p className="text-sm text-slate-400 mb-2">{t.nowPlaying}</p>
          <p className="font-medium mb-4 truncate">{currentFile.title}</p>

          {currentFile.type === 'video' && (
            <video
              ref={videoRef}
              src={currentFile.file ? URL.createObjectURL(currentFile.file) : ''}
              className="w-full rounded-lg mb-4 max-h-[300px]"
              controls
            />
          )}

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-700 rounded">
              <SkipBack size={20} />
            </button>
            <button 
              onClick={togglePlay}
              className="p-3 bg-sky-600 hover:bg-sky-700 rounded-full"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button className="p-2 hover:bg-slate-700 rounded">
              <SkipForward size={20} />
            </button>
            
            <div className="flex-1 mx-4">
              <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sky-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Volume2 size={18} className="text-slate-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-20"
              />
            </div>
          </div>

          <audio
            ref={audioRef}
            src={currentFile.file && currentFile.type === 'audio' ? URL.createObjectURL(currentFile.file) : ''}
            onTimeUpdate={(e) => { const t = e.target as HTMLAudioElement; setProgress((t.currentTime / t.duration) * 100) }}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      )}

      {/* Playlist */}
      <h3 className="text-lg font-medium mb-2">{t.playlist}</h3>
      {files.length === 0 ? (
        <p className="text-slate-500 text-center py-8">{t.empty}</p>
      ) : (
        <div className="space-y-2">
          {files.map(file => (
            <button
              key={file.id}
              onClick={() => setCurrentFile(file)}
              className={`w-full p-3 rounded-lg flex items-center gap-3 transition-colors ${
                currentFile?.id === file.id 
                  ? 'bg-sky-600/20 border border-sky-600/50' 
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              {file.type === 'audio' ? <Music size={18} className="text-violet-500" /> : <Video size={18} className="text-pink-500" />}
              <span className="flex-1 text-left truncate">{file.title}</span>
              {currentFile?.id === file.id && isPlaying && (
                <span className="text-xs text-sky-400">▶</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}