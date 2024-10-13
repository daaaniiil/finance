export interface IAuthCredential {
    [key: string]: any
    password: '',
    checkPass:'',
    remember: false,
    email: '',
    phone:''
}

export interface IEarnings {
    amount: number | null
    month: string
}
