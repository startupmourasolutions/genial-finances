import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Lock } from "lucide-react"
import { toast } from "sonner"

interface ProfileToggleProps {
  profiles: string[]
  onProfileChange?: (profile: string) => void
}

export function ProfileToggle({ profiles, onProfileChange }: ProfileToggleProps) {
  const [selectedProfile, setSelectedProfile] = useState(profiles[0])
  const { profile } = useAuth()

  // Verifica se o usuário tem permissão para usar o perfil empresarial
  const hasBusinessAccess = profile?.client_type === 'business' || false
  const isSuperAdmin = false // TODO: Implementar verificação de super admin

  const handleToggle = () => {
    const newProfile = selectedProfile === profiles[0] ? profiles[1] : profiles[0]
    
    // Se está tentando mudar para empresarial e não tem acesso
    if (newProfile === "Empresarial" && !hasBusinessAccess && !isSuperAdmin) {
      toast.error("Acesso empresarial requer plano específico. Entre em contato com o administrador.", {
        duration: 4000,
      })
      return
    }

    setSelectedProfile(newProfile)
    onProfileChange?.(newProfile)
  }

  const isBusinessMode = selectedProfile === "Empresarial"
  const isLocked = !hasBusinessAccess && !isSuperAdmin

  return (
    <div className="relative inline-block">
      <button
        onClick={handleToggle}
        disabled={isLocked && !isBusinessMode}
        className={`relative w-36 h-9 bg-muted rounded-full transition-all duration-300 border-none outline-none overflow-hidden shadow-sm hover:shadow-md ${
          isLocked && !isBusinessMode ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0'
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-16 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full transition-transform duration-300 shadow-sm ${
            isBusinessMode ? 'translate-x-[4.25rem]' : 'translate-x-0'
          }`}
        />
        
        <span
          className={`absolute top-1/2 left-3 transform -translate-y-1/2 font-medium text-xs transition-colors duration-300 z-10 pointer-events-none ${
            !isBusinessMode ? 'text-primary-foreground' : 'text-muted-foreground'
          }`}
        >
          Pessoal
        </span>
        
        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center gap-1 z-10 pointer-events-none">
          {isLocked && (
            <Lock className="w-3 h-3 text-muted-foreground" />
          )}
          <span
            className={`font-medium text-xs transition-colors duration-300 ${
              isBusinessMode ? 'text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            Empresa
          </span>
        </div>
      </button>
      
      {isLocked && (
        <div className="absolute -bottom-6 left-0 right-0 text-center">
          <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded border">
            Requer plano empresarial
          </span>
        </div>
      )}
    </div>
  )
}