import {defineStore} from "pinia";
import {ref, reactive} from 'vue'
import {supabase} from "../resources/supabase.ts";
import {IEarnings, IExpenses, IMonths, IUser} from "../resources/types.ts";
import {ElMessage} from "element-plus";
import {TInstanceForm} from "@/resources/auth.ts";
import {useRouter} from "vue-router";


export const useFinanceStore = defineStore('finance', () => {
    const user = ref<IUser | null>(null)
    const earnings = ref<IEarnings[]>([])
    const expenses = ref<IExpenses[]>([])
    const expensesLastMonthAmount = ref<number>(0)
    const earningsLastMonthAmount = ref<number>(0)
    const earningsCurrentMonthAmount = ref<number>(0)
    const expensesCurrentMonthAmount = ref<number>(0)
    const months: IMonths[] = [
        {label: 'Январь', value: 0},
        {label: 'Февраль', value: 1},
        {label: 'Март', value: 2},
        {label: 'Апрель', value: 3},
        {label: 'Май', value: 4},
        {label: 'Июнь', value: 5},
        {label: 'Июль', value: 6},
        {label: 'Август', value: 7},
        {label: 'Сентябрь', value: 8},
        {label: 'Октябрь', value: 9},
        {label: 'Ноябрь', value: 10},
        {label: 'Декабрь', value: 11},
    ]
    const yearNow = new Date().getFullYear()
    const loading = ref<boolean>(false)
    const router = useRouter()
    const isLoader = reactive({
        earnings: false,
        expenses: false,
        user: false
    })

    const authUser = async () => {
        if(isLoader.user) return

        try {
            const {data, error: authError} = await supabase.auth.getUser()

            if (authError || !data) {
                console.error(authError?.message || 'Пользователь не авторизован')
            } else {
                user.value = data.user || []
                isLoader.user = true
            }
        } catch (e) {
            console.error(e)
        }
    }

    const getUserEarnings = async () => {
        if(isLoader.earnings) return

        loading.value = true
        try {
            await authUser()

            const {data, error} = await supabase
                .from('earnings')
                .select('id, month, amount')
                .eq('user_id', user.value?.id)

            if (error) {
                ElMessage.error(`${error.message}`)
            } else {
                earnings.value = data || []
                isLoader.earnings = true
            }
        } catch (e) {
            console.error('Ошибка при получение данных', e)
        } finally {
            loading.value = false
        }
    }

    const createUserDataEarnings = async (form: TInstanceForm, model: IEarnings) => {
        if (!form.value) {
            console.error('Add earnings form not found')
            return
        }

        form.value.validate(async (valid: boolean) => {
            if (valid) {
                loading.value = true
                try {
                    await authUser()

                    const {error: insertError} = await supabase
                        .from('earnings')
                        .insert([
                            {
                                user_id: user.value?.id,
                                month: model.month,
                                amount: model.amount
                            }
                        ])
                    const selectedMonth = months.find(m => m.label === model.month)?.value

                    if (insertError) {
                        ElMessage.error(`${insertError.message}`)
                    } else {
                        ElMessage.success('Заработок успешно добавлен!')
                        isLoader.earnings = false
                        await getUserEarnings()
                        if(selectedMonth === new Date().getMonth() - 1){
                            await incomeExpensesEarnings()
                        }
                        model.amount = null
                        model.month = ''
                    }
                } catch (e) {
                    console.error('Ошибка при добавление данных', e)
                } finally {
                    loading.value = false
                }
            } else {
                console.error('Form validation failed')
                loading.value = false
            }
        })
    }

    const deleteEarningsItemData = async (id: string | undefined, month: string) => {
        loading.value = true
        try {
            const selectedMonth = months.find(m => m.label === month)?.value

            const expensesMonth = expenses.value.filter((e: IExpenses) =>
                Number(e.date.slice(5,7)) - 1 === selectedMonth && Number(e.date.slice(0,4)) === new Date().getFullYear())

            if(expensesMonth.length) {
                ElMessage.warning('У вас в этом месяце есть расходы, вы не можете его удалить')
            } else {
                const {data, error, status} = await supabase
                    .from('earnings')
                    .delete()
                    .eq('id', id)

                if (error) {
                    console.error('Error deleting item:', error)
                } else if (status === 204) {
                    isLoader.earnings = false
                    await getUserEarnings()
                    ElMessage.success('Удалено успешно!')
                } else {
                    console.log('Unexpected response:', data)
                }
            }
        } catch (e) {
            console.error('Error during delete:', e)
        } finally {
            loading.value = false
        }
    }

    const updateEarningsAmount = async (id: string | undefined, newAmount: number | null, month: string) => {
        loading.value = true
        try {
            const nowMonth = months.find(m => m.label === month)?.value
            const {error} = await supabase
                .from('earnings')
                .update({amount: newAmount})
                .eq('id', id)

            if (error) {
                console.error('Ошибка обновления суммы:', error)
            } else {
                isLoader.earnings = false
                await getUserEarnings()
                if(nowMonth === new Date().getMonth() - 1){
                    await incomeExpensesEarnings()
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const getUserExpenses = async () => {
        if(isLoader.expenses) return

        loading.value = true
        try {
            await authUser()

            const {data, error} = await supabase
                .from('expenses')
                .select('*')
                .eq('user_id', user.value?.id)

            if (error) {
                ElMessage.error(`${error.message}`)
            } else {
                expenses.value = data || []
                isLoader.expenses = true
            }
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const createUserDataExpenses = async (form: TInstanceForm, model: IExpenses) => {
        if (!form.value) {
            console.error('Expenses form not found')
            return
        }

        form.value.validate(async (valid: boolean) => {
            if (valid) {
                try {
                    await authUser()

                    const {error: insertError} = await supabase
                        .from('expenses')
                        .insert([
                            {
                                user_id: user.value?.id,
                                category: model.category,
                                amount: model.amount,
                                date: model.date
                            }
                        ])

                    if (insertError) {
                        ElMessage.error(`${insertError.message}`)
                    }
                    ElMessage.success('Расход успешно добавлен!')
                    isLoader.expenses = false
                    await getUserExpenses()
                    model.amount = null
                    model.category = ''
                    model.date = ''
                } catch (e) {
                    console.error(e)
                } finally {
                    loading.value = false
                }
            } else {
                console.error('Form validation failed')
                loading.value = false
            }
        })
    }

    const updateEarningsExpenses = async (id: string | undefined, newAmount: number | null) => {
        loading.value = true
        try {
            const {error} = await supabase
                .from('expenses')
                .update({amount: newAmount})
                .eq('id', id)

            if (error) {
                console.error('Ошибка обновления суммы:', error)
            }
            isLoader.expenses = false
            await getUserExpenses()
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const deleteExpensesItem = async (id: string) => {
        loading.value = true
        try {
            const {data, error, status} = await supabase
                .from('expenses')
                .delete()
                .eq('id', id)

            if (error) {
                console.error('Error deleting item:', error)
            } else if (status === 204) {
                ElMessage.success('Удалено успешно!')
                isLoader.expenses = false
                await getUserExpenses()
            } else {
                console.log('Unexpected response:', data)
            }
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const logout = async () => {
        loading.value = true
        try {
            const {error} = await supabase.auth.signOut()
            if (error) {
                console.error(error)
            } else {
                await router.push({name: 'login-page'})
                ElMessage.success('Вы вышли из аккаунта!')
            }
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const nowNewYear = async () => {
        loading.value = true
        try {
            if (yearNow === yearNow + 1) {
                // заносить данные в last-year-earnings и удалять из earnings
                console.log('Данные очищены')
            } else {
                console.log('Новый год еще не наступил')
            }
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const incomeExpensesEarnings = async () => {
        loading.value = true
        try {
            let lastMonth: number = new Date().getMonth()
            if(lastMonth === 0){
                lastMonth = 12
            }

            const availableMonths = months.find(month => month.value === lastMonth - 1)?.label

            earningsLastMonthAmount.value = earnings.value
                .find((e: IEarnings) => e.month === availableMonths)?.amount || 0

            const expensesLastMonth: number[] = expenses.value
                .filter((e: IExpenses): boolean => Number(e.date.slice(5,7)) === lastMonth)
                .map((e: IExpenses) => e.amount)
                .filter((e: number | null): e is number => e !== null)

            expensesLastMonthAmount.value = expensesLastMonth
                .reduce((acc: number, current: number) => acc + current)

        } catch (e){
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const incomeExpensesEarningsCurrent = async () => {
        loading.value = true
        try {
            const currentMonth = new Date().getMonth()
            const availableMonths = months.find(month => month.value === currentMonth)?.label

            earningsCurrentMonthAmount.value = earnings.value
                .find((e: IEarnings) => e.month === availableMonths)?.amount || 0


            const expensesCurrentMonth: number[] = expenses.value
                .filter((e: IExpenses): boolean => Number(e.date.slice(5,7)) === currentMonth + 1)
                .map((e: IExpenses) => e.amount)
                .filter((e: number | null): e is number => e !== null)

            expensesCurrentMonthAmount.value = expensesCurrentMonth
                .reduce((acc: number, current: number) => acc + current)

        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    return {
        isLoader,
        user,
        loading,
        earnings,
        expenses,
        yearNow,
        months,
        expensesLastMonthAmount,
        earningsLastMonthAmount,
        earningsCurrentMonthAmount,
        expensesCurrentMonthAmount,
        authUser,
        getUserEarnings,
        createUserDataEarnings,
        deleteEarningsItemData,
        updateEarningsAmount,
        getUserExpenses,
        deleteExpensesItem,
        updateEarningsExpenses,
        createUserDataExpenses,
        logout,
        nowNewYear,
        incomeExpensesEarnings,
        incomeExpensesEarningsCurrent
    }
})
