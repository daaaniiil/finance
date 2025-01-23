import {defineStore} from "pinia";
import {ref, reactive} from 'vue'
import {supabase} from "../resources/supabase.ts";
import {
    IEarnings,
    IExpenses,
    IExpensesMonthAnalytics, IExpensesMonthAnalyticsLast,
    IItemExpensesPie, IGoal,
    IMonths,
    IUser, IBackup
} from "../resources/types.ts";
import {ElMessage} from "element-plus";
import {TInstanceForm} from "@/resources/auth.ts";
import {useRouter} from "vue-router";
import {useCurrencyStore} from "@/store/currency.ts";

export const useFinanceStore = defineStore('finance', () => {
    const budget = ref<number>(0)
    const user = ref<IUser | null>(null)
    const earnings = ref<IEarnings[]>([])
    const lastYearEarnings = ref<IEarnings[]>([])
    const expenses = ref<IExpenses[]>([])
    const goals = ref<IGoal[]>([])
    const hiddenGoals = JSON.parse(localStorage.getItem('hiddenGoals') || '[]')
    const mergedExpenses = ref<IItemExpensesPie[]>([])
    const mergedEarnings = ref<IItemExpensesPie[]>([])
    const mergedExpensesCurrent = ref<IItemExpensesPie[]>([])
    const expensesDaysCurrentMonth = ref<IExpensesMonthAnalytics[]>([])
    const expensesDaysLastMonth = ref<IExpensesMonthAnalyticsLast[]>([])
    const minExpenses = ref<number>(0)
    const minExpensesCategories = ref<string | undefined>('Нету')
    const maxExpenses = ref<number>(0)
    const maxExpensesCategories = ref<string | undefined>('Нету')
    const amountExpenses = ref<number>(0)
    const amountEarnings = ref<number>(0)
    const averageExpenses = ref<number>(0)
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
    const currencyStore = useCurrencyStore()
    const isLoader = reactive({
        goals: false,
        earnings: false,
        lastYearEarnings: false,
        expenses: false,
        user: false,
        budget: false,
        earningsBackup: false
    })

    const authUser = async () => {
        if (isLoader.user) return

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
        if (isLoader.earnings) return

        loading.value = true
        try {
            await authUser()

            const {data, error} = await supabase
                .from('earnings')
                .select('id, month, amount')
                .eq('user_id', user.value?.id)

            if (error) {
                console.error(`${error.message}`)
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

                    if (model.amount !== null) {
                        model.amount *= currencyStore.getRate
                    }

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
                        if (selectedMonth === new Date().getMonth() - 1) {
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
                Number(e.date.slice(5, 7)) - 1 === selectedMonth && Number(e.date.slice(0, 4)) === new Date().getFullYear())

            if (expensesMonth.length) {
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
                if (nowMonth === new Date().getMonth() - 1) {
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
        if (isLoader.expenses) return

        loading.value = true
        try {
            await authUser()

            const {data, error} = await supabase
                .from('expenses')
                .select('*')
                .eq('user_id', user.value?.id)

            if (error) {
                console.error(`${error.message}`)
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

                    if (model.amount !== null) {
                        model.amount *= currencyStore.getRate
                    }

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
                console.error('Error deleting expenses:', error)
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

    const getLastYearEarnings = async () => {
        if(isLoader.lastYearEarnings) return

        loading.value = true
        try {
            await authUser()

            const {data, error} = await supabase
                .from('last-year-earnings')
                .select('id, month, amount, year')
                .eq('user_id', user.value?.id)

            if (error) {
                console.error(`${error.message}`)
            } else {
                lastYearEarnings.value = data || []
                isLoader.lastYearEarnings = true
            }
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }


    const getUserGoals = async () => {
        if (isLoader.goals) return

        loading.value = true
        try {
            await authUser()

            const {data, error} = await supabase
                .from('goals')
                .select('*')
                .eq('user_id', user.value?.id)

            if (error) {
                console.error(`${error.message}`)
            } else {
                goals.value = data || []
                isLoader.goals = true
            }
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const createUserGoal = async (form: TInstanceForm, model: IGoal) => {
        if (!form.value) {
            console.error('Add goal form not found')
            ElMessage.success('Заполните форму')
            return
        }

        form.value.validate(async (valid: boolean) => {
            if (valid) {
                try {
                    await getUserGoals()

                    model.targetAmount *= currencyStore.getRate

                    const deadline = new Date(model.deadline)
                    const formattedDeadline = `${deadline.getFullYear()}-${String(deadline.getMonth() + 1).padStart(2, '0')}-${String(deadline.getDate()).padStart(2, '0')}`

                    const {error: insertError} = await supabase
                        .from('goals')
                        .insert([
                            {
                                user_id: user.value?.id,
                                name: model.name,
                                targetAmount: model.targetAmount,
                                currentAmount: 0,
                                status: 'in_progress',
                                deadline: formattedDeadline
                            }
                        ])

                    if (insertError) {
                        ElMessage.error(`${insertError.message}`)
                    }
                    ElMessage.success('Цель успешно добавлена!')
                    isLoader.goals = false
                    await getUserGoals()
                    model.name = ''
                    model.targetAmount = 0
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

    const updateUserGoal = async (id: string, newAmount: number, newStatus: string) => {
        loading.value = true
        try {
            const { data, error: fetchError} = await supabase
                .from('goals')
                .select('currentAmount')
                .eq('id', id)
                .single()

            if (fetchError) {
                console.error('Ошибка получения текущей суммы цели:', fetchError)
                return
            }
            const updateAmount = (data.currentAmount || 0) + Number(newAmount.toFixed())

            const {error} = await supabase
                .from('goals')
                .update({currentAmount: updateAmount, status: newStatus})
                .eq('id', id)
            if (error) {
                console.error('Ошибка обновления цели:', error)
            }
            isLoader.goals = false
            await getUserGoals()
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const deleteGoal = async (goalId: string) => {
        loading.value = true
        try {
            const {data, error, status} = await supabase
                .from('goals')
                .delete()
                .eq('id', goalId)

            if(error) {
                console.error('Error deleting goal:', error)
            } else if (status === 204) {
                ElMessage.success('Цель удалена!')
                isLoader.goals = false
                await getUserGoals()
            } else {
                console.log('Unexpected response:', data)
            }
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const hideGoal = (goalId: string) => {
        if(!hiddenGoals.includes(goalId)) {
            hiddenGoals.push(goalId)
            localStorage.setItem('hiddenGoals', JSON.stringify(hiddenGoals))
            isLoader.goals = false
        }
    }
    // исправить место вызова
    const updateGoalStatus = async () => {
        loading.value = true
        try {
            const today = new Date().toISOString().split('T')[0]

            const updateGoals = goals.value.map(async (goal: IGoal) => {
                let newStatus = goal.status
                let deadline = goal.deadline

                if (goal.currentAmount >= goal.targetAmount && newStatus !== 'completed'){
                    newStatus = 'completed'
                    deadline = today
                }

                if(new Date(goal.deadline) <= new Date(today) && newStatus !== 'completed'){
                    newStatus = 'failed'
                }

                if(newStatus !== goal.status){
                    await supabase
                        .from('goals')
                        .update({status: newStatus, deadline})
                        .eq('id', goal.id)
                }
            })

            await Promise.all(updateGoals)
            isLoader.goals = false
            await getUserGoals()
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }


    const incomeExpensesEarnings = async () => {
        loading.value = true
        try {
            await authUser()

            const month = new Date().toLocaleDateString().slice(3,5)

            let lastMonth: number = new Date().getMonth()
            if (lastMonth === 0) {
                lastMonth = 12
            }

            const availableMonths = months.find(month => month.value === lastMonth - 1)?.label

            const earningsDate = earnings.value
                .find((e: IEarnings) => e.month === availableMonths)

            if(earningsDate) {
                earningsLastMonthAmount.value = earningsDate?.amount || 0
            } else {
                if(isLoader.earningsBackup) return

                const {data: backupEarnings, error: backupError} = await supabase
                    .from('earnings_backup')
                    .select('amount, user_id')
                    .eq('user_id', user.value?.id)
                    .eq('month', availableMonths)
                    .eq('year', new Date().getFullYear() - 1)

                if(backupError) console.error(`Ошибка при получение данных из earnings_backup: ${backupError.message}`)

                const backup: IBackup[] = backupEarnings || []
                const backupItem = backup.find((b: IBackup) => b.user_id === user.value?.id)
                earningsLastMonthAmount.value = backupItem?.amount || 0
                isLoader.earningsBackup = true
            }

            earningsLastMonthAmount.value /= currencyStore.getRate

            let expensesLastMonth: number[] = expenses.value
                .filter((e: IExpenses): boolean => Number(e.date.slice(5, 7)) === lastMonth && Number(e.date.slice(0, 4)) === new Date().getFullYear())
                .map((e: IExpenses) => e.amount)
                .filter((e: number | null): e is number => e !== null)

            if(!expensesLastMonth.length && month === '01') {
                expensesLastMonth = expenses.value
                    .filter((e: IExpenses): boolean => Number(e.date.slice(5, 7)) === lastMonth && Number(e.date.slice(0, 4)) === new Date().getFullYear() - 1)
                    .map((e: IExpenses) => e.amount)
                    .filter((e: number | null): e is number => e !== null)
            }

            expensesLastMonthAmount.value = expensesLastMonth
                .reduce((acc: number, current: number) => acc + current) || 0

            expensesLastMonthAmount.value /= currencyStore.getRate

        } catch (e) {
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

            earningsCurrentMonthAmount.value /= currencyStore.getRate

            const expensesCurrentMonth: number[] = expenses.value
                .filter((e: IExpenses): boolean => Number(e.date.slice(5, 7)) === currentMonth + 1 && Number(e.date.slice(0, 4)) === new Date().getFullYear())
                .map((e: IExpenses) => e.amount)
                .filter((e: number | null): e is number => e !== null)

            expensesCurrentMonthAmount.value = expensesCurrentMonth
                .reduce((acc: number, current: number) => acc + current) || 0

            expensesCurrentMonthAmount.value /= currencyStore.getRate
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const expensesEarningsCategories = async () => {
        loading.value = true
        try {
            await getUserExpenses()

            const mergeExpenses = (data: IItemExpensesPie[]) => {
                const resultMap: Record<string, number> = {}

                data.forEach((item) => {
                    if(item.name !== null) {
                        if(resultMap[item.name]){
                            resultMap[item.name] += item.y
                        } else {
                            resultMap[item.name] = item.y
                        }
                    }
                })

                return Object.keys(resultMap).map((e) => ({
                    name: e,
                    y: resultMap[e]
                }))
            }

            const expensesPie: IItemExpensesPie[] = expenses.value
                .filter((e: IExpenses) => Number(e.date.slice(0, 4)) === new Date().getFullYear())
                .map((e: IExpenses) => ({
                    name: e.category,
                    date: e.date,
                    y: Math.ceil((e.amount ?? 0) / currencyStore.getRate)
                }))

            const earningsPie: IItemExpensesPie[] = earnings.value
                .map((e: IEarnings) => ({
                    name: e.month,
                    y: Math.ceil((e.amount ?? 0) / currencyStore.getRate)
                }))

            const expensesCurrentMonthAmount: IItemExpensesPie[] = expenses.value
                .filter((e: IExpenses) => Number(e.date.slice(5, 7)) === new Date().getMonth() + 1 && Number(e.date.slice(0, 4)) === new Date().getFullYear())
                .map((e: IExpenses) => ({
                    name: e.category,
                    date: e.date,
                    y: Math.ceil((e.amount ?? 0) / currencyStore.getRate)
                }))

            mergedExpenses.value = mergeExpenses(expensesPie)
            mergedEarnings.value = mergeExpenses(earningsPie)
            mergedExpensesCurrent.value = mergeExpenses(expensesCurrentMonthAmount)
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const amountExpensesEarningsCategories = async () => {
        loading.value = true
        try {
            amountExpenses.value = mergedExpenses.value
                .map((e: IItemExpensesPie) => e.y)
                .filter((e: number | undefined | null): e is number => e !== undefined)
                .reduce((acc: number, current: number) => acc + current)

            amountEarnings.value = mergedEarnings.value
                .map((e: IItemExpensesPie) => e.y)
                .filter((e: number | undefined | null): e is number => e !== undefined)
                .reduce((acc: number, current: number) => acc + current)

        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const minMaxExpensesAmount = async () => {
        loading.value = true
        try {
            const amountMerge: number[] = mergedExpensesCurrent.value.map((e) => e.y)

            minExpenses.value = amountMerge.reduce((acc: number, current: number) => Math.min(acc, current))
            minExpensesCategories.value = mergedExpensesCurrent.value.find(e => e.y === minExpenses.value)?.name

            maxExpenses.value = Math.max(...amountMerge)
            maxExpensesCategories.value = mergedExpensesCurrent.value.find(e  => e.y === maxExpenses.value)?.name

            const dayPassed = new Date().getDate()
            averageExpenses.value = expensesCurrentMonthAmount.value / dayPassed
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const expensesDaysMonthCurrent = async () => {
        loading.value = true
        try {
            expensesDaysCurrentMonth.value = expenses.value
                .filter((e: IExpenses) => Number(e.date.slice(5, 7)) === new Date().getMonth() + 1 && Number(e.date.slice(0, 4)) === new Date().getFullYear())
                .sort(function(a,b){
                    if (a.date > b.date){
                        return 1
                    }
                    if (a.date < b.date){
                        return -1
                    }
                    return 0
                }).map((e: IExpenses) => ({
                    amount: Math.floor((e.amount ?? 0) / currencyStore.getRate),
                    date: e.date.slice(8, 10)
                }))

            const mergeExpensesDay = (data: IExpensesMonthAnalytics[]) => {
                const resultMap: Record<string, number> = {}

                data.forEach((item) => {
                    if(item.amount !== null){
                        if(resultMap[item.date]){
                            resultMap[item.date] += item.amount
                        } else {
                            resultMap[item.date] = item.amount
                        }
                    }
                })
                return Object.keys(resultMap).map((e) => ({
                    date: e,
                    amount: resultMap[e]
                }))
            }

            expensesDaysCurrentMonth.value = mergeExpensesDay(expensesDaysCurrentMonth.value)
            expensesDaysCurrentMonth.value.sort(function(a,b){
                if (a.date > b.date){
                    return 1
                }
                if (a.date < b.date){
                    return -1
                }
                return 0
            })
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const expensesDaysMonthLast = async () => {
        loading.value = true
        try {
            const month = new Date().toLocaleDateString().slice(3,5)
            let lastMonth: number = new Date().getMonth()
            if (lastMonth === 0) {
                lastMonth = 12
            }

            expensesDaysLastMonth.value = expenses.value
                .filter((e: IExpenses) => Number(e.date.slice(5, 7)) === lastMonth && Number(e.date.slice(0, 4)) === new Date().getFullYear())
                .sort(function(a,b){
                    if (a.date > b.date){
                        return 1
                    }
                    if (a.date < b.date){
                        return -1
                    }
                    return 0
                }).map((e: IExpenses) => ({
                    amount: Math.floor((e.amount ?? 0) / currencyStore.getRate),
                    date: e.date.slice(8, 10)
                }))

            if(!expensesDaysLastMonth.value.length && month === '01') {
                expensesDaysLastMonth.value = expenses.value
                    .filter((e: IExpenses) => Number(e.date.slice(5, 7)) === lastMonth && Number(e.date.slice(0, 4)) === new Date().getFullYear() - 1)
                    .sort(function(a,b){
                        if (a.date > b.date){
                            return 1
                        }
                        if (a.date < b.date){
                            return -1
                        }
                        return 0
                    }).map((e: IExpenses) => ({
                        amount: Math.floor((e.amount ?? 0) / currencyStore.getRate),
                        date: e.date.slice(8, 10)
                    }))
            }
            const mergeExpensesDay = (data: IExpensesMonthAnalyticsLast[]) => {
                const resultMapExpenses: Record<string, number> = {}

                data.forEach((item) => {
                    if(item.amount !== null){
                        if(resultMapExpenses[item.date]){
                            resultMapExpenses[item.date] += item.amount
                        } else {
                            resultMapExpenses[item.date] = item.amount
                        }
                    }
                })
                return Object.keys(resultMapExpenses).map((e) => ({
                    date: e,
                    amount: resultMapExpenses[e]
                }))
            }

            expensesDaysLastMonth.value = mergeExpensesDay(expensesDaysLastMonth.value)
            expensesDaysLastMonth.value.sort(function(a,b){
                if (a.date > b.date){
                    return 1
                }
                if (a.date < b.date){
                    return -1
                }
                return 0
            })
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }


    const fetchBudget = async () => {
        if (isLoader.budget) return

        loading.value = true
        try {
            const {data, error} = await supabase
                .from('budget')
                .select('budget')
                .eq('user_id', user.value?.id)
                .single()

            if(error) console.error(`Error get budget: ${error.message}`)
            budget.value = data?.budget || 0
            budget.value /= currencyStore.getRate
            isLoader.budget = true
        } catch (e) {
            console.error(`Error get budget: ${e}`)
        } finally {
            loading.value = false
        }
    }

    const initializeBudget = async () => {
        loading.value = true
        try {
            const {data: earningsData, error: earningsError} = await supabase
                .from('earnings')
                .select('amount')
                .eq('user_id', user.value?.id)

            if(earningsError) console.error(`Error initializeBudget: ${earningsError.message}`)

            const totalEarnings = (earningsData ?? []).reduce((acc: number, item: {amount: number}) => acc + item.amount, 0)

            const {data: expensesData, error: expensesError} = await supabase
                .from('expenses')
                .select('amount, date')
                .eq('user_id', user.value?.id)

            if(expensesError) console.error(`Error initializeBudget: ${expensesError.message}`)

            const totalExpenses = (expensesData ?? [])
                .filter((e: { date: string }) => Number(e.date.slice(0, 4)) === new Date().getFullYear())
                .reduce((acc: number, item: {amount: number}) => acc + item.amount, 0)

            budget.value = totalEarnings - totalExpenses
            budget.value /= currencyStore.getRate
            isLoader.budget = true

            const {error: insertError} = await supabase
                .from('budget')
                .insert({ user_id: user.value?.id, budget: budget.value })

            if(insertError) console.error(`Ошибка при инициализации бюджета: ${insertError}`)
        } catch (e) {
            console.error(`Ошибка при инициализации бюджета: ${e}`)
        } finally {
            loading.value = false
        }
    }

    const updateBudget = async (amount: number, type: 'earnings' | 'expenses') => {
        loading.value = true
        try {
            amount *= currencyStore.getRate
            const adjustment = type === 'earnings' ? amount : -amount
            budget.value *= currencyStore.getRate
            budget.value += adjustment

            const { error } = await supabase
                .from('budget')
                .update({ budget: budget.value })
                .eq('user_id', user.value?.id)

            budget.value /= currencyStore.getRate
            if(error) console.error(`Ошибка при обновление бюджета: ${error.message}`)
        } catch(e) {
            console.error(`Ошибка при обновление бюджета: ${e}`)
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
            await authUser()
            await getUserEarnings()

            const currentYear = new Date().getFullYear()
            const lastRunYear = localStorage.getItem('lastRunYear')

            if(lastRunYear === String(currentYear)) {
                //console.log('Функция уже была вызвана в этом году')
                return
            }

            localStorage.setItem('lastRunYear', String(currentYear))

            const {data: earningsData, error: earningsError} = await supabase
                .from('earnings')
                .select('*')

            if(earningsError){
                console.error(`Ошибка при получение данных из earnings: ${earningsError.message}`)
            }

            if(!earningsData || earningsData.length === 0) {
                //console.log('Пользователь новый, функция не будет выполняться')
                return
            }

            const previousYear = currentYear - 1

            const lastMonth = new Date().getMonth() === 0 ? 12 : new Date().getMonth()
            const availableMonths = months.find(month => month.value === lastMonth - 1)?.label

            const lastMonthEarnings = earnings.value
                .find((e: IEarnings) => e.month === availableMonths)

            if (lastMonthEarnings) {
                const { error: backupError } = await supabase
                    .from('earnings_backup')
                    .insert({
                        user_id: user.value?.id,
                        month: lastMonthEarnings.month,
                        amount: lastMonthEarnings.amount,
                        year: previousYear
                    })

                if (backupError) console.error(`Ошибка при сохранении зарплаты за прошлый месяц: ${backupError.message}`)
            }

            const newEarnings = earningsData.map((earning) => ({
                ...earning,
                year: previousYear
            }))

            const { error: insertError } = await supabase
                .from('last-year-earnings')
                .insert(newEarnings)

            if (insertError) console.error(`Ошибка при переносе данных: ${insertError.message}`)

            const {error: deleteError} = await supabase
                .from('earnings')
                .delete()
                .eq('user_id', user.value?.id)

            if (deleteError) console.error(`Ошибка при очистке таблицы earnings: ${deleteError.message}`)

            //console.log('Данные успешно перенесены и очищены')
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    return {
        budget,
        amountExpenses,
        isLoader,
        user,
        loading,
        earnings,
        expenses,
        goals,
        yearNow,
        months,
        expensesLastMonthAmount,
        earningsLastMonthAmount,
        earningsCurrentMonthAmount,
        expensesCurrentMonthAmount,
        mergedExpenses,
        minExpenses,
        minExpensesCategories,
        maxExpenses,
        maxExpensesCategories,
        averageExpenses,
        expensesDaysCurrentMonth,
        expensesDaysLastMonth,
        hiddenGoals,
        lastYearEarnings,
        amountEarnings,
        expensesDaysMonthLast,
        expensesDaysMonthCurrent,
        minMaxExpensesAmount,
        amountExpensesEarningsCategories,
        authUser,
        getUserEarnings,
        createUserDataEarnings,
        deleteEarningsItemData,
        updateEarningsAmount,
        getUserExpenses,
        deleteExpensesItem,
        updateEarningsExpenses,
        createUserDataExpenses,
        getUserGoals,
        createUserGoal,
        updateUserGoal,
        updateGoalStatus,
        logout,
        nowNewYear,
        incomeExpensesEarnings,
        incomeExpensesEarningsCurrent,
        expensesEarningsCategories,
        fetchBudget,
        initializeBudget,
        updateBudget,
        hideGoal,
        deleteGoal,
        getLastYearEarnings
    }
})
