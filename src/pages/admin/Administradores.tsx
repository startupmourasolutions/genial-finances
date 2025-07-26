import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

interface Administrator {
  id: string;
  profile: {
    full_name: string;
    email: string;
    phone?: string;
    profile_image_url?: string;
    account_status: string;
  };
  role: string;
  created_at: string;
}

export default function Administradores() {
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "guest",
    status: true,
    profileImage: "https://lmbltwldalrbyzgucfsx.supabase.co/storage/v1/object/public/profiles//profile.png"
  });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, adminId: '', adminName: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchAdministrators();
  }, []);

  const fetchAdministrators = async () => {
    try {
      // Primeiro buscar os super administradores
      const { data: admins, error: adminsError } = await supabase
        .from('super_administrators')
        .select('id, role, created_at, profile_id');

      if (adminsError) throw adminsError;

      // Depois buscar os perfis correspondentes
      const profileIds = admins?.map(admin => admin.profile_id) || [];
      
      if (profileIds.length === 0) {
        setAdministrators([]);
        return;
      }

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, profile_image_url, account_status')
        .in('id', profileIds);

      if (profilesError) throw profilesError;

      // Combinar os dados
      const combinedData = admins?.map(admin => {
        const profile = profiles?.find(p => p.id === admin.profile_id);
        return {
          id: admin.id,
          role: admin.role,
          created_at: admin.created_at,
          profile: profile || {
            full_name: '',
            email: '',
            phone: '',
            profile_image_url: '',
            account_status: 'inactive'
          }
        };
      }) || [];

      setAdministrators(combinedData);
    } catch (error) {
      console.error('Erro ao buscar administradores:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de administradores",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    if (formData.fullName && formData.email && formData.password) {
      try {
        // Criar usuário no auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: formData.fullName,
              user_type: 'super_administrator'
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          // Aguardar um pouco para o trigger criar o profile
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Buscar o profile criado
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', authData.user.id)
            .single();

          if (profileError) throw profileError;

          // Atualizar o profile com os dados do formulário
          const { error: updateProfileError } = await supabase
            .from('profiles')
            .update({
              full_name: formData.fullName,
              phone: formData.phone,
              profile_image_url: formData.profileImage,
              account_status: formData.status ? 'active' : 'inactive',
              user_type: 'super_administrator'
            })
            .eq('id', profileData.id);

          if (updateProfileError) throw updateProfileError;

          // Criar registro na tabela super_administrators
          const { error: adminError } = await supabase
            .from('super_administrators')
            .insert({
              profile_id: profileData.id,
              role: formData.role as any
            });

          if (adminError) throw adminError;
        }

        toast({
          title: "Sucesso",
          description: "Administrador criado com sucesso"
        });
        setIsDialogOpen(false);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          role: "guest",
          status: true,
          profileImage: "https://lmbltwldalrbyzgucfsx.supabase.co/storage/v1/object/public/profiles//profile.png"
        });
        fetchAdministrators();
      } catch (error: any) {
        console.error('Erro ao criar administrador:', error);
        toast({
          title: "Erro",
          description: error.message || "Erro ao criar administrador",
          variant: "destructive"
        });
      }
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('super_administrators')
        .delete()
        .eq('id', deleteDialog.adminId);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Administrador removido com sucesso"
      });
      setDeleteDialog({ isOpen: false, adminId: '', adminName: '' });
      fetchAdministrators();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover administrador",
        variant: "destructive"
      });
    }
  };

  const openDeleteDialog = (id: string, name: string) => {
    setDeleteDialog({ isOpen: true, adminId: id, adminName: name });
  };

  const isFormValid = formData.fullName && formData.email && formData.password && formData.confirmPassword;

  const filteredAdministrators = administrators.filter(admin =>
    admin.profile?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.profile?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_administrator': return 'bg-red-100 text-red-800';
      case 'administrator': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Administradores</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Administrador
            </Button>
          </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Administrador</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Foto de Perfil */}
                <div className="flex flex-col items-center space-y-2">
                  <Label>Foto de Perfil</Label>
                  <div className="relative">
                    <Avatar className="w-32 h-32 cursor-pointer group" onClick={() => document.getElementById('profileImageInput')?.click()}>
                      <AvatarImage src={formData.profileImage} />
                      <AvatarFallback className="text-3xl">
                        {formData.fullName?.charAt(0) || '+'}
                      </AvatarFallback>
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </Avatar>
                    <input
                      id="profileImageInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setFormData({...formData, profileImage: event.target?.result as string});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Primeira linha - Nome e Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo *</Label>
                    <Input
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                {/* Segunda linha - Celular e Perfil */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Celular</Label>
                    <Input
                      id="phone"
                      type="tel"
                      maxLength={15}
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 11) {
                          value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                          if (value.length <= 14) {
                            value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                          }
                        }
                        setFormData({...formData, phone: value});
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Cargo *</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guest">Convidado</SelectItem>
                        <SelectItem value="administrator">Administrador</SelectItem>
                        <SelectItem value="super_administrator">Super Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Terceira linha - Senha e Confirmar Senha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={formData.status}
                    onCheckedChange={(checked) => setFormData({...formData, status: checked})}
                  />
                  <Label htmlFor="status">Ativo</Label>
                </div>

                <Button type="submit" className="w-full" disabled={!isFormValid}>
                  Cadastrar Administrador
                </Button>
              </form>
            </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Buscar administradores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Administrador</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdministrators.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={admin.profile?.profile_image_url} />
                          <AvatarFallback>
                            {admin.profile?.full_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{admin.profile?.full_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{admin.profile?.email}</TableCell>
                    <TableCell>{admin.profile?.phone || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(admin.role)}>
                        {admin.role === 'super_administrator' ? 'Super Admin' : 
                         admin.role === 'administrator' ? 'Administrador' : 'Convidado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={admin.profile?.account_status === 'active' ? 'default' : 'secondary'}>
                        {admin.profile?.account_status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openDeleteDialog(admin.id, admin.profile?.full_name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, adminId: '', adminName: '' })}
        onConfirm={handleDelete}
        itemName={deleteDialog.adminName}
        title="Excluir Administrador"
      />
    </div>
  );
}