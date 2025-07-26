import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Mail, 
  Bell, 
  Shield, 
  Database, 
  Users, 
  CreditCard,
  Globe,
  Lock,
  Server
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Configuracoes() {
  const [settings, setSettings] = useState({
    // Configurações do Sistema
    systemName: "Gênio Financeiro",
    systemEmail: "contato@geniofinanceiro.com",
    systemUrl: "https://geniofinanceiro.com",
    
    // Configurações de Email
    emailNotifications: true,
    emailReports: true,
    emailMarketing: false,
    
    // Configurações de Segurança
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordComplexity: true,
    
    // Configurações de Usuários
    allowRegistration: true,
    emailVerification: true,
    autoApproval: false,
    
    // Configurações de Pagamento
    stripePublicKey: "",
    stripeSecretKey: "",
    paymentMethods: ["pix", "credit_card", "bank_slip"],
    
    // Configurações de Backup
    autoBackup: true,
    backupFrequency: "daily",
    retentionDays: "30"
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Aqui seria implementada a lógica para salvar as configurações
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação
      
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso"
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
      systemName: "Gênio Financeiro",
      systemEmail: "contato@geniofinanceiro.com",
      emailNotifications: true,
      twoFactorAuth: false,
      allowRegistration: true
    }));
    
    toast({
      title: "Configurações resetadas",
      description: "As configurações foram restauradas para os valores padrão"
    });
  };

  return (
    <div className="w-full space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset}>
            Resetar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Configurações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Configurações Gerais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="systemName">Nome do Sistema</Label>
                <Input
                  id="systemName"
                  value={settings.systemName}
                  onChange={(e) => setSettings({...settings, systemName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="systemEmail">Email do Sistema</Label>
                <Input
                  id="systemEmail"
                  type="email"
                  value={settings.systemEmail}
                  onChange={(e) => setSettings({...settings, systemEmail: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemUrl">URL do Sistema</Label>
              <Input
                id="systemUrl"
                type="url"
                value={settings.systemUrl}
                onChange={(e) => setSettings({...settings, systemUrl: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Email e Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Email e Notificações</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Enviar notificações importantes por email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Relatórios Automáticos</Label>
                <p className="text-sm text-muted-foreground">
                  Enviar relatórios automáticos por email
                </p>
              </div>
              <Switch
                checked={settings.emailReports}
                onCheckedChange={(checked) => setSettings({...settings, emailReports: checked})}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Marketing</Label>
                <p className="text-sm text-muted-foreground">
                  Permitir emails promocionais e marketing
                </p>
              </div>
              <Switch
                checked={settings.emailMarketing}
                onCheckedChange={(checked) => setSettings({...settings, emailMarketing: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Segurança</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Autenticação de Dois Fatores</Label>
                <p className="text-sm text-muted-foreground">
                  Exigir 2FA para administradores
                </p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})}
              />
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})}
                />
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Complexidade de Senha</Label>
                <p className="text-sm text-muted-foreground">
                  Exigir senhas complexas (maiúscula, minúscula, número, símbolo)
                </p>
              </div>
              <Switch
                checked={settings.passwordComplexity}
                onCheckedChange={(checked) => setSettings({...settings, passwordComplexity: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Usuários e Registros</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Permitir Novos Registros</Label>
                <p className="text-sm text-muted-foreground">
                  Usuários podem se registrar no sistema
                </p>
              </div>
              <Switch
                checked={settings.allowRegistration}
                onCheckedChange={(checked) => setSettings({...settings, allowRegistration: checked})}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Verificação de Email</Label>
                <p className="text-sm text-muted-foreground">
                  Exigir verificação de email no registro
                </p>
              </div>
              <Switch
                checked={settings.emailVerification}
                onCheckedChange={(checked) => setSettings({...settings, emailVerification: checked})}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Aprovação Automática</Label>
                <p className="text-sm text-muted-foreground">
                  Aprovar automaticamente novos usuários
                </p>
              </div>
              <Switch
                checked={settings.autoApproval}
                onCheckedChange={(checked) => setSettings({...settings, autoApproval: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Pagamentos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stripePublicKey">Stripe - Chave Pública</Label>
                <Input
                  id="stripePublicKey"
                  type="password"
                  value={settings.stripePublicKey}
                  onChange={(e) => setSettings({...settings, stripePublicKey: e.target.value})}
                  placeholder="pk_live_..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripeSecretKey">Stripe - Chave Secreta</Label>
                <Input
                  id="stripeSecretKey"
                  type="password"
                  value={settings.stripeSecretKey}
                  onChange={(e) => setSettings({...settings, stripeSecretKey: e.target.value})}
                  placeholder="sk_live_..."
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Métodos de Pagamento Ativos</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">PIX</Badge>
                <Badge variant="default">Cartão de Crédito</Badge>
                <Badge variant="secondary">Boleto Bancário</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Backup e Manutenção</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Backup Automático</Label>
                <p className="text-sm text-muted-foreground">
                  Realizar backups automáticos do banco de dados
                </p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => setSettings({...settings, autoBackup: checked})}
              />
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="backupFrequency">Frequência do Backup</Label>
                <select
                  id="backupFrequency"
                  className="w-full p-2 border rounded-md"
                  value={settings.backupFrequency}
                  onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
                >
                  <option value="hourly">A cada hora</option>
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="retentionDays">Retenção (dias)</Label>
                <Input
                  id="retentionDays"
                  type="number"
                  value={settings.retentionDays}
                  onChange={(e) => setSettings({...settings, retentionDays: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}