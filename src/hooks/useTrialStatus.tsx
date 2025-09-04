import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { differenceInDays } from 'date-fns';

interface TrialStatus {
  isInTrial: boolean;
  isExpired: boolean;
  daysLeft: number;
  canAddData: boolean;
  trialEndDate: Date | null;
}

export const useTrialStatus = () => {
  const { profile } = useAuth();
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    isInTrial: false,
    isExpired: false,
    daysLeft: 0,
    canAddData: true,
    trialEndDate: null
  });

  useEffect(() => {
    if (!profile?.clients?.[0]) {
      setTrialStatus({
        isInTrial: false,
        isExpired: false,
        daysLeft: 0,
        canAddData: true,
        trialEndDate: null
      });
      return;
    }

    const client = profile.clients[0];
    
    // Se já tem assinatura ativa, pode usar normalmente
    if (client.subscription_active) {
      setTrialStatus({
        isInTrial: false,
        isExpired: false,
        daysLeft: 0,
        canAddData: true,
        trialEndDate: null
      });
      return;
    }

    // Se está em trial
    if (client.subscription_status === 'trial' && client.trial_end_date) {
      const trialEnd = new Date(client.trial_end_date);
      const now = new Date();
      const daysLeft = differenceInDays(trialEnd, now);
      
      setTrialStatus({
        isInTrial: true,
        isExpired: daysLeft < 0,
        daysLeft: Math.max(0, daysLeft),
        canAddData: daysLeft >= 0, // Pode adicionar dados se o trial não expirou
        trialEndDate: trialEnd
      });
    } else {
      // Sem trial e sem assinatura - não pode adicionar dados
      setTrialStatus({
        isInTrial: false,
        isExpired: true,
        daysLeft: 0,
        canAddData: false,
        trialEndDate: null
      });
    }
  }, [profile]);

  return trialStatus;
};