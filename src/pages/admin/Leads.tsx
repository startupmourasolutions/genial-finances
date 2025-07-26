import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  lead_source?: string;
  status: string;
  notes?: string;
  created_at: string;
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    lead_source: "",
    status: "novo",
    notes: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de leads",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingLead) {
        const { error } = await supabase
          .from('leads')
          .update(formData)
          .eq('id', editingLead.id);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Lead atualizado com sucesso"
        });
      } else {
        const { error } = await supabase
          .from('leads')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Lead criado com sucesso"
        });
      }

      setIsDialogOpen(false);
      setEditingLead(null);
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        company_name: "",
        lead_source: "",
        status: "novo",
        notes: ""
      });
      fetchLeads();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar lead",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      full_name: lead.full_name,
      email: lead.email,
      phone: lead.phone || "",
      company_name: lead.company_name || "",
      lead_source: lead.lead_source || "",
      status: lead.status,
      notes: lead.notes || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Lead removido com sucesso"
      });
      fetchLeads();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover lead",
        variant: "destructive"
      });
    }
  };

  const handleNewDialog = () => {
    setEditingLead(null);
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      company_name: "",
      lead_source: "",
      status: "novo",
      notes: ""
    });
    setIsDialogOpen(true);
  };

  const filteredLeads = leads.filter(lead =>
    lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.company_name && lead.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'novo': return 'bg-blue-100 text-blue-800';
      case 'contato': return 'bg-yellow-100 text-yellow-800';
      case 'qualificado': return 'bg-purple-100 text-purple-800';
      case 'convertido': return 'bg-green-100 text-green-800';
      case 'perdido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'novo': return 'Novo';
      case 'contato': return 'Em Contato';
      case 'qualificado': return 'Qualificado';
      case 'convertido': return 'Convertido';
      case 'perdido': return 'Perdido';
      default: return status;
    }
  };

  return (
    <div className="w-full space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leads</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingLead ? 'Editar Lead' : 'Cadastrar Novo Lead'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome Completo *</Label>
                <Input
                  id="full_name"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
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
                <Label htmlFor="company_name">Empresa</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead_source">Origem</Label>
                <Input
                  id="lead_source"
                  placeholder="Site, indicação, redes sociais..."
                  value={formData.lead_source}
                  onChange={(e) => setFormData({...formData, lead_source: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="novo">Novo</SelectItem>
                    <SelectItem value="contato">Em Contato</SelectItem>
                    <SelectItem value="qualificado">Qualificado</SelectItem>
                    <SelectItem value="convertido">Convertido</SelectItem>
                    <SelectItem value="perdido">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                {editingLead ? 'Atualizar Lead' : 'Cadastrar Lead'}
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
              placeholder="Buscar leads..."
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.full_name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone || '-'}</TableCell>
                    <TableCell>{lead.company_name || '-'}</TableCell>
                    <TableCell>{lead.lead_source || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(lead.status)}>
                        {getStatusLabel(lead.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(lead)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(lead.id)}
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