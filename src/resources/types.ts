export interface IAuthCredential {
    [key: string]: any
    password: '',
    checkPass:'',
    remember: false,
    email: '',
    phone:''
}

export interface IEarnings {
    id?: string | undefined
    amount: number | null
    month: string
}
