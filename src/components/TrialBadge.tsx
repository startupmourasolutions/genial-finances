import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function TrialBadge() {
  const { profile } = useAuth()
  const [daysLeft, setDaysLeft] = useState<number | null>(null)

  useEffect(() => {
    if (profile?.clients?.[0]?.trial_end_date && !profile?.clients?.[0]?.subscription_active) {
      const trialEndDate = new Date(profile.clients[0].trial_end_date)
      const today = new Date()
      const diffTime = trialEndDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      setDaysLeft(Math.max(0, diffDays))
    }
  }, [profile])

  if (!profile?.clients?.[0] || profile?.clients?.[0]?.subscription_active || daysLeft === null) {
    return null
  }

  return (
    <Badge 
      variant={daysLeft <= 2 ? "destructive" : daysLeft <= 5 ? "secondary" : "outline"}
      className="flex items-center gap-1 px-3 py-1"
    >
      <Clock className="w-3 h-3" />
      {daysLeft === 0 
        ? "Trial expirado" 
        : daysLeft === 1 
        ? "1 dia restante" 
        : `${daysLeft} dias restantes`
      }
    </Badge>
  )
}