export interface IBackup {
    user_id: string
    amount: number
}

export interface IAuthCredential {
    [key: string]: any
    password: '',
    checkPass:'',
    email: '',
    phone:''
}

export interface IEarnings {
    id?: string | undefined
    amount: number | null
    month: string
    year?: number
}

export interface IExpenses {
    id?: string | undefined
    amount: number | null
    date: string
    category: string
}

export interface IExpensesMonthAnalytics {
    amount: number | null
    date: number | string
}

export interface IExpensesMonthCategory {
    amount: number | null
    category: string
}

export interface IExpensesMonthAnalyticsLast {
    amount: number | null
    date: number | string
}

export interface IExpensesMonth {
    id?: string | undefined
    amount: number
    date: string
    category: string
}

export interface IMonths {
    label: string
    value: number
}

export interface IUser {
    id: string
    created_at?: string
    email?: string
}

export interface IItemExpensesPie {
    name: string
    y: number
}

export interface IGoal {
    id: string
    name: string
    targetAmount: number
    currentAmount: number
    type: 'saving' | 'spending'
    category?: string
    deadline: Date | string
    status: 'in_progress' | 'completed' | 'failed'
}