import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileContextType {
  currentProfile: string;
  setCurrentProfile: (profile: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [currentProfile, setCurrentProfile] = useState("Pessoal");

  return (
    <ProfileContext.Provider value={{ currentProfile, setCurrentProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useCurrentProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useCurrentProfile must be used within a ProfileProvider');
  }
  return context;
}