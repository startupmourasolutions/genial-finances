import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

interface ProfileUpdateData {
  full_name: string
  phone?: string
  profile_image_url?: string
}

export function useProfile() {
  const [uploading, setUploading] = useState(false)
  const { user, profile } = useAuth()

  const updateProfile = async (data: ProfileUpdateData) => {
    if (!user) {
      toast.error('Usuário não autenticado')
      return { error: 'User not authenticated' }
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (error) throw error

      toast.success('Perfil atualizado com sucesso!')
      return { error: null }
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error('Erro ao atualizar perfil')
      return { error: error.message }
    }
  }

  const uploadProfileImage = async (file: File) => {
    if (!user) {
      toast.error('Usuário não autenticado')
      return { error: 'User not authenticated' }
    }

    try {
      setUploading(true)
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath)

      const profileImageUrl = data.publicUrl

      await updateProfile({ 
        full_name: profile?.full_name || '',
        profile_image_url: profileImageUrl 
      })

      return { data: profileImageUrl, error: null }
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast.error('Erro ao fazer upload da imagem')
      return { error: error.message }
    } finally {
      setUploading(false)
    }
  }

  return {
    profile,
    updateProfile,
    uploadProfileImage,
    uploading
  }
}