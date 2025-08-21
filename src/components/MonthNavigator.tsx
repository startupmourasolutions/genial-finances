import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MonthNavigatorProps {
  selectedMonth: number
  selectedYear: number
  onMonthChange: (month: number, year: number) => void
  className?: string
}

export function MonthNavigator({ selectedMonth, selectedYear, onMonthChange, className }: MonthNavigatorProps) {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const navigateMonth = (direction: 'prev' | 'next') => {
    let newMonth = selectedMonth
    let newYear = selectedYear

    if (direction === 'prev') {
      newMonth -= 1
      if (newMonth < 0) {
        newMonth = 11
        newYear -= 1
      }
    } else {
      newMonth += 1
      if (newMonth > 11) {
        newMonth = 0
        newYear += 1
      }
    }

    // Não permitir navegar para o futuro
    if (newYear > currentYear || (newYear === currentYear && newMonth > currentMonth)) {
      return
    }

    onMonthChange(newMonth, newYear)
  }

  const isCurrentMonth = selectedMonth === currentMonth && selectedYear === currentYear
  const isFutureMonth = selectedYear > currentYear || (selectedYear === currentYear && selectedMonth > currentMonth)

  // Gerar lista de anos (últimos 5 anos)
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateMonth('prev')}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2 min-w-[200px]">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select
            value={`${selectedMonth}`}
            onValueChange={(value) => onMonthChange(parseInt(value), selectedYear)}
          >
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => {
                const disabled = selectedYear > currentYear || (selectedYear === currentYear && index > currentMonth)
                return (
                  <SelectItem 
                    key={index} 
                    value={`${index}`}
                    disabled={disabled}
                  >
                    {month}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          
          <Select
            value={`${selectedYear}`}
            onValueChange={(value) => onMonthChange(selectedMonth, parseInt(value))}
          >
            <SelectTrigger className="w-[80px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={`${year}`}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateMonth('next')}
          disabled={isFutureMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {!isCurrentMonth && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onMonthChange(currentMonth, currentYear)}
          className="text-sm"
        >
          Voltar ao mês atual
        </Button>
      )}
    </div>
  )
}