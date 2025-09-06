import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, CreditCard, QrCode, FileText, Calendar, Info, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PaymentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: {
    paymentMethod: string;
    dueDay: number;
  };
  onSave: (settings: { paymentMethod: string; dueDay: number }) => void;
}

export function PaymentSettingsModal({
  isOpen,
  onClose,
  currentSettings,
  onSave
}: PaymentSettingsModalProps) {
  const [paymentMethod, setPaymentMethod] = useState(currentSettings.paymentMethod);
  const [dueDay, setDueDay] = useState(currentSettings.dueDay.toString());
  const [showDueDayWarning, setShowDueDayWarning] = useState(false);
  const { toast } = useToast();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setPaymentMethod(currentSettings.paymentMethod);
      setDueDay(currentSettings.dueDay.toString());
      setShowDueDayWarning(false);
    }
  }, [isOpen, currentSettings]);

  // Dias disponíveis para vencimento (5, 10, 15, 20, 25)
  const availableDueDays = ["5", "10", "15", "20", "25"];

  const handleDueDayChange = (value: string) => {
    setDueDay(value);
    setShowDueDayWarning(true);
  };

  const handleSave = () => {
    // Validação de mudança de data
    const today = new Date();
    const currentDay = today.getDate();
    const newDueDay = parseInt(dueDay);
    
    // Se está tentando mudar a data e já passou do dia 15 do mês
    if (newDueDay !== currentSettings.dueDay && currentDay > 15) {
      toast({
        title: "Mudança não permitida",
        description: "Alterações na data de vencimento só podem ser feitas até o dia 15 de cada mês. A mudança será aplicada no próximo ciclo.",
        variant: "destructive"
      });
      return;
    }

    // Se mudou a data de vencimento
    if (newDueDay !== currentSettings.dueDay) {
      toast({
        title: "Data de vencimento alterada",
        description: `Sua nova data de vencimento (dia ${dueDay}) será aplicada a partir do próximo ciclo de faturamento.`,
      });
    }

    onSave({
      paymentMethod,
      dueDay: newDueDay
    });

    toast({
      title: "Configurações salvas",
      description: "Suas preferências de pagamento foram atualizadas com sucesso.",
    });

    onClose();
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "PIX":
        return <QrCode className="w-5 h-5" />;
      case "Boleto":
        return <FileText className="w-5 h-5" />;
      case "Cartão de Crédito":
        return <CreditCard className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações de Pagamento
          </DialogTitle>
          <DialogDescription>
            Configure sua forma de pagamento e data de vencimento preferida
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="px-6 pb-2" style={{ height: 'calc(90vh - 200px)' }}>
          <div className="space-y-6 py-4">
            {/* Forma de Pagamento */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Forma de Pagamento</Label>
              <div className="space-y-3">
                <Card 
                  className={`cursor-pointer transition-all hover:border-primary/50 ${
                    paymentMethod === "Cartão de Crédito" 
                      ? "border-primary bg-primary/5 dark:bg-primary/10" 
                      : ""
                  }`}
                  onClick={() => setPaymentMethod("Cartão de Crédito")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        paymentMethod === "Cartão de Crédito" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}>
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <Label className="text-base cursor-pointer">
                          Cartão de Crédito
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Pagamento automático todo mês. Sem preocupações com vencimento.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all hover:border-primary/50 ${
                    paymentMethod === "PIX" 
                      ? "border-primary bg-primary/5 dark:bg-primary/10" 
                      : ""
                  }`}
                  onClick={() => setPaymentMethod("PIX")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        paymentMethod === "PIX" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}>
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <Label className="text-base cursor-pointer">
                          PIX
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Pague quando quiser usando QR Code ou chave PIX.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all hover:border-primary/50 ${
                    paymentMethod === "Boleto" 
                      ? "border-primary bg-primary/5 dark:bg-primary/10" 
                      : ""
                  }`}
                  onClick={() => setPaymentMethod("Boleto")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        paymentMethod === "Boleto" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <Label className="text-base cursor-pointer">
                          Boleto Bancário
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Receba o boleto por email e pague em qualquer banco ou app.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Data de Vencimento */}
            <div className="space-y-3">
              <Label htmlFor="due-day" className="text-base font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Dia de Vencimento
              </Label>
              <Select value={dueDay} onValueChange={handleDueDayChange}>
                <SelectTrigger id="due-day">
                  <SelectValue placeholder="Selecione o dia de vencimento" />
                </SelectTrigger>
                <SelectContent>
                  {availableDueDays.map(day => (
                    <SelectItem key={day} value={day}>
                      Dia {day} de cada mês
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Informações sobre datas */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Como funciona:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• <strong>Fechamento:</strong> 5 dias antes do vencimento</li>
                    <li>• <strong>Geração da fatura:</strong> No dia do fechamento</li>
                    <li>• <strong>Vencimento:</strong> Dia {dueDay} de cada mês</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Aviso de mudança de data */}
              {showDueDayWarning && parseInt(dueDay) !== currentSettings.dueDay && (
                <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800 dark:text-orange-200">
                    <strong>Regras para mudança de vencimento:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Mudanças só podem ser feitas até o dia 15 de cada mês</li>
                      <li>• A nova data vale a partir do próximo ciclo</li>
                      <li>• Você pode mudar apenas 1 vez a cada 3 meses</li>
                      <li>• A fatura atual mantém o vencimento original</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Resumo das configurações */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Resumo das Configurações</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Forma de pagamento:</span>
                    <span className="font-medium flex items-center gap-1">
                      {getPaymentMethodIcon(paymentMethod)}
                      {paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dia de vencimento:</span>
                    <span className="font-medium">Dia {dueDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dia de fechamento:</span>
                    <span className="font-medium">
                      Dia {parseInt(dueDay) - 5 > 0 ? parseInt(dueDay) - 5 : parseInt(dueDay) + 25}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Configurações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}