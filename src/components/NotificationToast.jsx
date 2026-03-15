import { useProgress } from '../contexts/ProgressContext'

export default function NotificationToast() {
  const { notifications } = useProgress()
  const icons   = { xp:'⚡', achievement:'🏆', streak:'🔥', success:'✅', error:'❌' }
  const colors  = { xp:'bg-lime-400 text-green-900', achievement:'bg-yellow-400 text-yellow-900', streak:'bg-orange-400 text-white', success:'bg-green-400 text-white', error:'bg-red-400 text-white' }
  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {notifications.map(n => (
        <div key={n.id} className={`${colors[n.type] || colors.success} px-4 py-3 rounded-2xl shadow-lg font-bold text-sm flex items-center gap-2 animate-slide-down`}>
          <span>{icons[n.type] || '✅'}</span>
          <span>{n.msg}</span>
        </div>
      ))}
    </div>
  )
}
