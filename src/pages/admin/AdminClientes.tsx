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
import { Plus, Search, Edit, Trash2, Building, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  client_type: string;
  company_name?: string;
  subscription_plan?: string;
  subscription_active: boolean;
  trial_start_date: string;
  trial_end_date: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  monthly_fee?: number;
  profile: {
    full_name: string;
    email: string;
    phone?: string;
    account_status: string;
  };
}

export default function AdminClientes() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    clientType: "personal",
    companyName: "",
    subscriptionPlan: "",
    subscriptionActive: false,
    monthlyFee: "",
    accountStatus: "active"
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          id,
          client_type,
          company_name,
          subscription_plan,
          subscription_active,
          trial_start_date,
          trial_end_date,
          subscription_start_date,
          subscription_end_date,
          monthly_fee,
          profile:profiles(
            full_name,
            email,
            phone,
            account_status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de clientes",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingClient) {
        // Lógica para editar cliente existente
        toast({
          title: "Sucesso",
          description: "Cliente atualizado com sucesso"
        });
      } else {
        // Lógica para criar novo cliente
        toast({
          title: "Sucesso",
          description: "Cliente criado com sucesso"
        });
      }

      setIsDialogOpen(false);
      setEditingClient(null);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        clientType: "personal",
        companyName: "",
        subscriptionPlan: "",
        subscriptionActive: false,
        monthlyFee: "",
        accountStatus: "active"
      });
      fetchClients();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar cliente",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      fullName: client.profile?.full_name || "",
      email: client.profile?.email || "",
      phone: client.profile?.phone || "",
      clientType: client.client_type,
      companyName: client.company_name || "",
      subscriptionPlan: client.subscription_plan || "",
      subscriptionActive: client.subscription_active,
      monthlyFee: client.monthly_fee?.toString() || "",
      accountStatus: client.profile?.account_status || "active"
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Cliente removido com sucesso"
      });
      fetchClients();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover cliente",
        variant: "destructive"
      });
    }
  };

  const handleNewDialog = () => {
    setEditingClient(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      clientType: "personal",
      companyName: "",
      subscriptionPlan: "",
      subscriptionActive: false,
      monthlyFee: "",
      accountStatus: "active"
    });
    setIsDialogOpen(true);
  };

  const filteredClients = clients.filter(client =>
    client.profile?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.profile?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company_name && client.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isTrialActive = (client: Client) => {
    const now = new Date();
    const trialEnd = new Date(client.trial_end_date);
    return now <= trialEnd;
  };

  return (
    <div className="w-full space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientType">Tipo de Cliente</Label>
                <Select value={formData.clientType} onValueChange={(value) => setFormData({...formData, clientType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Pessoa Física</SelectItem>
                    <SelectItem value="business">Pessoa Jurídica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.clientType === "business" && (
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="subscriptionPlan">Plano de Assinatura</Label>
                <Input
                  id="subscriptionPlan"
                  value={formData.subscriptionPlan}
                  onChange={(e) => setFormData({...formData, subscriptionPlan: e.target.value})}
                  placeholder="Ex: Básico, Premium..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyFee">Valor Mensal (R$)</Label>
                <Input
                  id="monthlyFee"
                  type="number"
                  step="0.01"
                  value={formData.monthlyFee}
                  onChange={(e) => setFormData({...formData, monthlyFee: e.target.value})}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="subscriptionActive"
                  checked={formData.subscriptionActive}
                  onCheckedChange={(checked) => setFormData({...formData, subscriptionActive: checked})}
                />
                <Label htmlFor="subscriptionActive">Assinatura Ativa</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountStatus">Status da Conta</Label>
                <Select value={formData.accountStatus} onValueChange={(value) => setFormData({...formData, accountStatus: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="suspended">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                {editingClient ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
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
              placeholder="Buscar clientes..."
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
                  <TableHead>Cliente</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Trial</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {client.client_type === 'business' ? 
                          <Building className="w-4 h-4" /> : 
                          <User className="w-4 h-4" />
                        }
                        <div>
                          <div className="font-medium">{client.profile?.full_name}</div>
                          {client.company_name && (
                            <div className="text-sm text-muted-foreground">{client.company_name}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{client.profile?.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {client.client_type === 'business' ? 'Empresa' : 'Pessoa Física'}
                      </Badge>
                    </TableCell>
                    <TableCell>{client.subscription_plan || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={client.subscription_active ? 'default' : 'secondary'}>
                        {client.subscription_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isTrialActive(client) ? 'default' : 'destructive'}>
                        {isTrialActive(client) ? 'Trial Ativo' : 'Trial Expirado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(client)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(client.id)}
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
    </div>
  );
}