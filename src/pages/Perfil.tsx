import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Camera, 
  Save, 
  Mail, 
  Phone,
  Calendar,
  Building,
  Crown,
  Shield
} from "lucide-react"
import { useProfile } from "@/hooks/useProfile"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

const Perfil = () => {
  const { profile, updateProfile, uploadProfileImage, uploading } = useProfile()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || ''
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await updateProfile(formData)
    setSaving(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande. Máximo 5MB.')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Apenas imagens são permitidas.')
      return
    }

    await uploadProfileImage(file)
  }

  const getUserInitial = () => {
    return profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?'
  }

  const getAccountTypeBadge = () => {
    if (profile?.user_type === 'super_administrator') {
      return <Badge className="bg-purple-500"><Shield className="w-3 h-3 mr-1" />Super Admin</Badge>
    }
    
    const clientType = profile?.clients?.[0]?.client_type
    if (clientType === 'business') {
      return <Badge className="bg-blue-500"><Building className="w-3 h-3 mr-1" />Empresarial</Badge>
    }
    
    return <Badge variant="outline"><User className="w-3 h-3 mr-1" />Pessoal</Badge>
  }

  const isSubscriptionActive = profile?.clients?.[0]?.subscription_active
  const trialEndDate = profile?.clients?.[0]?.trial_end_date

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e configurações</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card do Perfil */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Foto do Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profile?.profile_image_url} />
                <AvatarFallback className="text-2xl">{getUserInitial()}</AvatarFallback>
              </Avatar>
              
              <div className="text-center">
                <h3 className="font-semibold text-lg">{profile?.full_name || 'Usuário'}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="mt-2">
                  {getAccountTypeBadge()}
                </div>
              </div>

              <div className="w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profile-image"
                  disabled={uploading}
                />
                <Label htmlFor="profile-image" className="cursor-pointer">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    disabled={uploading}
                    asChild
                  >
                    <span>
                      <Camera className="w-4 h-4 mr-2" />
                      {uploading ? 'Enviando...' : 'Alterar Foto'}
                    </span>
                  </Button>
                </Label>
              </div>
            </div>

            {/* Informações da Conta */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Membro desde:</span>
                <span>{new Date(profile?.created_at || '').toLocaleDateString('pt-BR')}</span>
              </div>
              
              {!isSubscriptionActive && trialEndDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Crown className="w-4 h-4 text-orange-500" />
                  <span className="text-muted-foreground">Trial até:</span>
                  <span className="text-orange-600">
                    {new Date(trialEndDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Formulário de Dados */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Nome Completo</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Para alterar o e-mail, entre em contato com o suporte
                  </p>
                </div>

                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <Label>Tipo de Conta</Label>
                  <div className="mt-2">
                    {getAccountTypeBadge()}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-brand-orange hover:bg-brand-orange/90"
                >
                  {saving ? (
                    'Salvando...'
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Perfil