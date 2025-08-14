import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { Plus, Edit, Target as TargetIcon, DollarSign, Trash2 } from "lucide-react"
import { FloatingActionButton } from "@/components/FloatingActionButton"
import { useFinancialGoals } from "@/hooks/useFinancialGoals"
import { FinancialGoalFormModal } from "@/components/FinancialGoalFormModal"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

const Metas = () => {
  const { goals, loading, createGoal, updateGoal, deleteGoal, addContribution } = useFinancialGoals()
  const { profile } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<any>(null)
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null)

  const handleCreateGoal = () => {
    // Verificar se o perfil está carregado antes de abrir o modal
    if (!profile?.clients || profile.clients.length === 0) {
      toast.error('Perfil não carregado completamente. Aguarde um momento e tente novamente.')
      return
    }
    setEditingGoal(null)
    setIsModalOpen(true)
  }

  const handleEditGoal = (goal: any) => {
    setEditingGoal(goal)
    setIsModalOpen(true)
  }

  const handleSubmitGoal = async (formData: any) => {
    if (editingGoal) {
      const { error } = await updateGoal(editingGoal.id, formData)
      if (!error) {
        toast.success('Meta atualizada com sucesso!')
        setIsModalOpen(false)
      }
      return { error }
    } else {
      const { error } = await createGoal(formData)
      if (!error) {
        toast.success('Meta criada com sucesso!')
        setIsModalOpen(false)
      }
      return { error }
    }
  }

  const handleDeleteGoal = async () => {
    if (deleteGoalId) {
      const { error } = await deleteGoal(deleteGoalId)
      if (!error) {
        toast.success('Meta excluída com sucesso!')
      }
      setDeleteGoalId(null)
    }
  }

  const handleAddContribution = async (goalId: string) => {
    const amount = prompt('Digite o valor a contribuir:')
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      const { error } = await addContribution(goalId, Number(amount))
      if (!error) {
        toast.success('Contribuição adicionada com sucesso!')
      }
    }
  }

  if (loading) {
    return <div className="p-8">Carregando metas...</div>
  }

  return (
    <div className="p-2 sm:p-4 lg:p-8 space-y-4 lg:space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Metas Financeiras</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Defina e acompanhe seus objetivos</p>
        </div>
        <div className="hidden sm:flex">
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleCreateGoal}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Meta
          </Button>
        </div>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 lg:py-12">
            <TargetIcon className="w-12 h-12 lg:w-16 lg:h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-base lg:text-lg font-semibold mb-2">Nenhuma meta criada</h3>
            <p className="text-sm lg:text-base text-muted-foreground mb-4 lg:mb-6">
              Crie sua primeira meta financeira para começar a acompanhar seus objetivos
            </p>
            <Button onClick={handleCreateGoal} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Meta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {goals.map((goal) => {
            const progressPercentage = goal.target_amount > 0 ? (Number(goal.current_amount) / Number(goal.target_amount)) * 100 : 0
            const remaining = Number(goal.target_amount) - Number(goal.current_amount)
            const daysUntilTarget = goal.target_date ? 
              Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 
              null
            
            return (
              <Card key={goal.id} className="shadow-card hover:shadow-lg transition-smooth">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <TargetIcon className="w-4 h-4 lg:w-5 lg:h-5 text-primary flex-shrink-0" />
                      <CardTitle className="text-base lg:text-lg truncate">{goal.title}</CardTitle>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 w-7 lg:h-8 lg:w-8 p-0"
                        onClick={() => handleAddContribution(goal.id)}
                        title="Adicionar contribuição"
                      >
                        <DollarSign className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 w-7 lg:h-8 lg:w-8 p-0"
                        onClick={() => handleEditGoal(goal)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 w-7 lg:h-8 lg:w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => setDeleteGoalId(goal.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  {goal.description && (
                    <p className="text-sm text-muted-foreground mt-2">{goal.description}</p>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-3 lg:space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Progresso</span>
                      <span className="text-sm text-muted-foreground">
                        {progressPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="truncate">R$ {Number(goal.current_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      <span className="truncate">R$ {Number(goal.target_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 lg:gap-4 text-center">
                    <div className="bg-muted/50 rounded-lg p-2 lg:p-3">
                      <p className="text-xs lg:text-sm text-muted-foreground">Faltam</p>
                      <p className="font-semibold text-foreground text-sm lg:text-base truncate">
                        R$ {Math.max(remaining, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2 lg:p-3">
                      <p className="text-xs lg:text-sm text-muted-foreground">Prazo</p>
                      <p className={`font-semibold text-sm lg:text-base ${
                        !daysUntilTarget ? 'text-muted-foreground' :
                        daysUntilTarget < 0 ? 'text-destructive' : 
                        daysUntilTarget < 30 ? 'text-orange-500' : 'text-foreground'
                      }`}>
                        {!daysUntilTarget ? 'Sem prazo' :
                         daysUntilTarget < 0 ? 'Atrasado' : `${daysUntilTarget} dias`}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm lg:text-base"
                      onClick={() => handleAddContribution(goal.id)}
                      size="sm"
                    >
                      Adicionar Dinheiro
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <FloatingActionButton onClick={handleCreateGoal} />

      {/* Modal de formulário */}
      <FinancialGoalFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleSubmitGoal}
        initialData={editingGoal}
        mode={editingGoal ? 'edit' : 'create'}
      />

      {/* Modal de confirmação de exclusão */}
      <DeleteConfirmationDialog
        isOpen={!!deleteGoalId}
        onClose={() => setDeleteGoalId(null)}
        onConfirm={handleDeleteGoal}
        title="Excluir Meta"
        description="Tem certeza que deseja excluir esta meta financeira? Esta ação não pode ser desfeita."
      />
    </div>
  )
}

export default Metas