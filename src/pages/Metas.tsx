import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { Plus, Edit, Target as TargetIcon, DollarSign, Trash2 } from "lucide-react"
import { useFinancialGoals } from "@/hooks/useFinancialGoals"
import { FinancialGoalFormModal } from "@/components/FinancialGoalFormModal"
import { toast } from "sonner"

const Metas = () => {
  const { goals, loading, createGoal, updateGoal, deleteGoal, addContribution } = useFinancialGoals()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<any>(null)
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null)

  const handleCreateGoal = () => {
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
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Metas Financeiras</h1>
          <p className="text-muted-foreground">Defina e acompanhe seus objetivos</p>
        </div>
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleCreateGoal}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <TargetIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma meta criada</h3>
            <p className="text-muted-foreground mb-6">
              Crie sua primeira meta financeira para começar a acompanhar seus objetivos
            </p>
            <Button onClick={handleCreateGoal} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Meta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progressPercentage = goal.target_amount > 0 ? (Number(goal.current_amount) / Number(goal.target_amount)) * 100 : 0
            const remaining = Number(goal.target_amount) - Number(goal.current_amount)
            const daysUntilTarget = goal.target_date ? 
              Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 
              null
            
            return (
              <Card key={goal.id} className="shadow-card hover:shadow-lg transition-smooth">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <TargetIcon className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleAddContribution(goal.id)}
                        title="Adicionar contribuição"
                      >
                        <DollarSign className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditGoal(goal)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => setDeleteGoalId(goal.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  {goal.description && (
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Progresso</span>
                      <span className="text-sm text-muted-foreground">
                        {progressPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>R$ {Number(goal.current_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      <span>R$ {Number(goal.target_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">Faltam</p>
                      <p className="font-semibold text-foreground">
                        R$ {Math.max(remaining, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">Prazo</p>
                      <p className={`font-semibold ${
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
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => handleAddContribution(goal.id)}
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