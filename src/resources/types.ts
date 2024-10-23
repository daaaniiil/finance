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
}

export interface IExpenses {
    id?: string | undefined
    amount: number | null
    date: string
    category: string
}

export interface IMonths {
    label: string
    value: number
}

export interface IUser {
    id: string
}