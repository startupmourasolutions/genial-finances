import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, 
  Mail, 
  Bell, 
  Shield, 
  CreditCard,
  Globe,
  User,
  Calendar,
  UserPlus,
  Phone,
  Trash2,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useSharedAccounts, CreateSharedAccountData } from "@/hooks/useSharedAccounts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function Configuracoes() {
  const { profile } = useAuth()
  const { 
    sharedAccounts, 
    loading: sharedAccountsLoading, 
    createSharedAccount, 
    deleteSharedAccount,
    getMaxAccounts,
    getAccountsRemaining 
  } = useSharedAccounts()
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newAccount, setNewAccount] = useState<CreateSharedAccountData>({
    name: '',
    whatsapp_number: ''
  })
  
  const [settings, setSettings] = useState({
    // Configurações de Perfil
    displayName: "João Silva Santos",
    email: "joao.silva@empresa1.com.br",
    phone: "+55 11 99999-1111",
    
    // Configurações de Notificações
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    invoiceReminders: true,
    
    // Configurações de Privacidade
    shareData: false,
    marketingEmails: false,
    
    // Configurações de Faturamento
    billingEmail: "financeiro@empresa1.com.br",
    paymentMethod: "PIX",
    currency: "BRL",
    timezone: "America/Sao_Paulo",
    language: "pt-BR",
    dateFormat: "DD/MM/YYYY"
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Verifica se é conta empresarial
  const isBusinessAccount = profile?.clients?.client_type === 'business' || false;
  const maxAccounts = getMaxAccounts();
  const accountsRemaining = getAccountsRemaining();

  const formatWhatsAppNumber = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (2 dígitos do código de área + 9 dígitos do número)
    const limitedNumbers = numbers.slice(0, 11);
    
    // Aplica a máscara (11) 99999-9999
    if (limitedNumbers.length === 0) return '';
    if (limitedNumbers.length <= 2) return `(${limitedNumbers}`;
    if (limitedNumbers.length <= 6) return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
    
    // Formato completo: (11) 99999-9999
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7, 11)}`;
  };

  const handleWhatsAppChange = (value: string) => {
    const formatted = formatWhatsAppNumber(value);
    setNewAccount(prev => ({ ...prev, whatsapp_number: formatted }));
  };

  const handleCreateAccount = async () => {
    if (!newAccount.name.trim() || !newAccount.whatsapp_number.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    const result = await createSharedAccount(newAccount);
    if (!result.error) {
      setNewAccount({ name: '', whatsapp_number: '' });
      setIsDialogOpen(false);
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    await deleteSharedAccount(accountId);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Aqui seria implementada a lógica para salvar as configurações
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação
      
      toast({
        title: "Sucesso",
        description: "Suas configurações foram salvas com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Reset para valores padrão
    setSettings(prev => ({
      ...prev,
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      shareData: false,
      marketingEmails: false
    }));
    
    toast({
      title: "Configurações resetadas",
      description: "As configurações foram restauradas para os valores padrão"
    });
  };

  return (
    <div className="w-full space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Minhas Configurações</h1>
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <Button variant="outline" onClick={handleReset} className="w-full md:w-auto">
            Resetar
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Configurações de Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Informações Pessoais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Nome Completo</Label>
                <Input
                  id="displayName"
                  value={settings.displayName}
                  onChange={(e) => setSettings({...settings, displayName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => setSettings({...settings, phone: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notificações</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="space-y-0.5 flex-1">
                <Label>Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Receber notificações importantes por email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
              />
            </div>
            <Separator />
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="space-y-0.5 flex-1">
                <Label>Notificações por SMS</Label>
                <p className="text-sm text-muted-foreground">
                  Receber notificações por SMS (pode gerar custos)
                </p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
              />
            </div>
            <Separator />
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="space-y-0.5 flex-1">
                <Label>Notificações Push</Label>
                <p className="text-sm text-muted-foreground">
                  Receber notificações no navegador
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
              />
            </div>
            <Separator />
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="space-y-0.5 flex-1">
                <Label>Lembrete de Faturas</Label>
                <p className="text-sm text-muted-foreground">
                  Receber lembretes antes do vencimento das faturas
                </p>
              </div>
              <Switch
                checked={settings.invoiceReminders}
                onCheckedChange={(checked) => setSettings({...settings, invoiceReminders: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Faturamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Faturamento e Pagamento</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingEmail">Email para Faturamento</Label>
                <Input
                  id="billingEmail"
                  type="email"
                  value={settings.billingEmail}
                  onChange={(e) => setSettings({...settings, billingEmail: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de Pagamento Preferido</Label>
                <Select 
                  value={settings.paymentMethod} 
                  onValueChange={(value) => setSettings({...settings, paymentMethod: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="Boleto">Boleto Bancário</SelectItem>
                    <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações Regionais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Configurações Regionais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Moeda</Label>
                <Select 
                  value={settings.currency} 
                  onValueChange={(value) => setSettings({...settings, currency: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">Real (BRL)</SelectItem>
                    <SelectItem value="USD">Dólar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => setSettings({...settings, language: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Formato de Data</Label>
                <Select 
                  value={settings.dateFormat} 
                  onValueChange={(value) => setSettings({...settings, dateFormat: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/AAAA</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/AAAA</SelectItem>
                    <SelectItem value="YYYY-MM-DD">AAAA-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Select 
                value={settings.timezone} 
                onValueChange={(value) => setSettings({...settings, timezone: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                  <SelectItem value="America/New_York">Nova York (GMT-5)</SelectItem>
                  <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Conta Compartilhada */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5" />
              <span>Conta Compartilhada</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isBusinessAccount 
                      ? `Plano Empresarial: até ${maxAccounts} contas compartilhadas`
                      : `Plano Pessoal: até ${maxAccounts} conta compartilhada`
                    }
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {accountsRemaining > 0 
                      ? `${accountsRemaining} ${accountsRemaining === 1 ? 'conta disponível' : 'contas disponíveis'}`
                      : 'Limite atingido'
                    }
                  </p>
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      disabled={accountsRemaining <= 0}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nova Conta Compartilhada</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountName">Nome</Label>
                        <Input
                          id="accountName"
                          value={newAccount.name}
                          onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Digite o nome da pessoa"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="whatsappNumber">WhatsApp</Label>
                        <Input
                          id="whatsappNumber"
                          value={newAccount.whatsapp_number}
                          onChange={(e) => handleWhatsAppChange(e.target.value)}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                          Cancelar
                        </Button>
                        <Button onClick={handleCreateAccount} className="flex-1">
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {sharedAccountsLoading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                </div>
              ) : sharedAccounts.length > 0 ? (
                <div className="space-y-2">
                  {sharedAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{account.name}</p>
                          <p className="text-sm text-muted-foreground">{account.whatsapp_number}</p>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover conta compartilhada?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação irá remover {account.name} da lista de contas compartilhadas. 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteAccount(account.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma conta compartilhada cadastrada</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Privacidade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Privacidade</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="space-y-0.5 flex-1">
                <Label>Compartilhar Dados Analíticos</Label>
                <p className="text-sm text-muted-foreground">
                  Permitir que dados anônimos sejam usados para melhorar o serviço
                </p>
              </div>
              <Switch
                checked={settings.shareData}
                onCheckedChange={(checked) => setSettings({...settings, shareData: checked})}
              />
            </div>
            <Separator />
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="space-y-0.5 flex-1">
                <Label>Emails de Marketing</Label>
                <p className="text-sm text-muted-foreground">
                  Receber ofertas especiais e novidades por email
                </p>
              </div>
              <Switch
                checked={settings.marketingEmails}
                onCheckedChange={(checked) => setSettings({...settings, marketingEmails: checked})}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}