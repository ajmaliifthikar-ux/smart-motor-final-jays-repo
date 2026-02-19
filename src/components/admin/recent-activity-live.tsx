'use client'

import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Activity, Clock, User as UserIcon, CheckCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function RecentActivityLive() {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'bookings'),
      orderBy('createdAt', 'desc'),
      limit(10)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to Date if needed
        date: (doc.data() as any).date?.toDate ? (doc.data() as any).date.toDate() : new Date(),
        createdAt: (doc.data() as any).createdAt?.toDate ? (doc.data() as any).createdAt.toDate() : new Date(),
      }))
      setActivities(data)
      setLoading(false)
    }, (error) => {
      console.error('Activity feed error:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-2xl" />
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/30">
        <Activity size={32} className="text-gray-200 mb-4" />
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">No Recent Activity</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div 
          key={activity.id}
          className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 bg-white hover:border-[#E62329]/10 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#121212] group-hover:text-white transition-colors">
              <UserIcon size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-black text-[#121212] uppercase tracking-tight">
                  {activity.guestName || 'Guest'}
                </p>
                <div className={cn(
                  "px-2 py-0.5 rounded-full text-[7px] font-black uppercase border",
                  activity.status === 'CONFIRMED' ? "bg-green-50 text-green-600 border-green-100" :
                  activity.status === 'PENDING' ? "bg-yellow-50 text-yellow-600 border-yellow-100" :
                  "bg-gray-50 text-gray-400 border-gray-100"
                )}>
                  {activity.status}
                </div>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                {activity.serviceId} • {activity.vehicleBrand} {activity.vehicleModel}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5 text-[#E62329]">
              <Clock size={12} />
              <span className="text-[10px] font-black uppercase tracking-tighter">
                {activity.slot}
              </span>
            </div>
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">
              {formatDate(activity.date)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
