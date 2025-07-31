import { useState } from "react"

interface ProfileToggleProps {
  profiles: string[]
  onProfileChange?: (profile: string) => void
}

export function ProfileToggle({ profiles, onProfileChange }: ProfileToggleProps) {
  const [selectedProfile, setSelectedProfile] = useState(profiles[0])

  const handleToggle = () => {
    const newProfile = selectedProfile === profiles[0] ? profiles[1] : profiles[0]
    setSelectedProfile(newProfile)
    onProfileChange?.(newProfile)
  }

  const isBusinessMode = selectedProfile === "Empresarial"

  return (
    <div className="relative inline-block">
      <button
        onClick={handleToggle}
        className="relative w-48 h-12 bg-muted rounded-full cursor-pointer transition-all duration-300 border-none outline-none overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
      >
        <div
          className={`absolute top-1 left-1 w-20 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full transition-transform duration-300 shadow-sm ${
            isBusinessMode ? 'translate-x-24' : 'translate-x-0'
          }`}
        />
        
        <span
          className={`absolute top-1/2 left-6 transform -translate-y-1/2 font-semibold text-sm transition-colors duration-300 z-10 pointer-events-none ${
            !isBusinessMode ? 'text-primary-foreground' : 'text-muted-foreground'
          }`}
        >
          Pessoal
        </span>
        
        <span
          className={`absolute top-1/2 right-6 transform -translate-y-1/2 font-semibold text-sm transition-colors duration-300 z-10 pointer-events-none ${
            isBusinessMode ? 'text-primary-foreground' : 'text-muted-foreground'
          }`}
        >
          Empresarial
        </span>
      </button>
    </div>
  )
}