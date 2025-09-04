import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Clock, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTrialStatus } from '@/hooks/useTrialStatus'

export function TrialBadge() {
  const trialStatus = useTrialStatus()

  if (!trialStatus.isInTrial) {
    return null
  }

  const variant = trialStatus.isExpired 
    ? "destructive" 
    : trialStatus.daysLeft <= 0 
    ? "destructive" 
    : trialStatus.daysLeft === 1 
    ? "secondary" 
    : "outline"

  const icon = trialStatus.isExpired || trialStatus.daysLeft <= 0 
    ? <AlertCircle className="w-3 h-3" />
    : <Clock className="w-3 h-3" />

  const text = trialStatus.isExpired 
    ? "Trial expirado - Assine para continuar" 
    : trialStatus.daysLeft === 0 
    ? "Último dia de trial" 
    : trialStatus.daysLeft === 1 
    ? "1 dia restante" 
    : `${trialStatus.daysLeft} dias restantes`

  return (
    <Badge 
      variant={variant}
      className="flex items-center gap-1 px-3 py-1"
    >
      {icon}
      {text}
    </Badge>
  )
}