import {defineStore} from "pinia";
import {ref} from 'vue'
import {supabase} from "../resources/supabase.ts";
import {IEarnings, IExpenses} from "../resources/types.ts";
import {ElMessage} from "element-plus";
import {TInstanceForm} from "@/resources/auth.ts";
import {useRouter} from "vue-router";


export const useFinanceStore = defineStore('finance', () => {
    const earnings = ref<IEarnings[]>([])
    const expenses = ref<IExpenses[]>([])
    const yearNow = new Date().getFullYear()
    const loading = ref<boolean>(false)
    const router = useRouter()

    const getUserEarnings = async () => {
        loading.value = true
        try {
            const {data: dataUser, error: authError} = await supabase.auth.getUser()

            if (authError || !dataUser) {
                console.error(authError?.message || 'Пользователь не авторизован')
            }

            const userId: string | undefined = dataUser.user?.id

            const {data, error} = await supabase
                .from('earnings')
                .select('id, month, amount')
                .eq('user_id', userId)

            if (error) {
                ElMessage.error(`${error.message}`)
            } else {
                earnings.value = data || []
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
                    const {data: dataUser, error: authError} = await supabase.auth.getUser()

                    if (authError || !dataUser) {
                        console.error(authError?.message || 'Пользователь не авторизован')
                    }

                    const userId: string | undefined = dataUser.user?.id

                    const {error: insertError} = await supabase
                        .from('earnings')
                        .insert([
                            {
                                user_id: userId,
                                month: model.month,
                                amount: model.amount
                            }
                        ])

                    if (insertError) {
                        ElMessage.error(`${insertError.message}`)
                    } else {
                        ElMessage.success('Заработок успешно добавлен!')
                        await getUserEarnings()
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

    const deleteEarningsItemData = async (id: string) => {
        loading.value = true
        try {
            const {data, error, status} = await supabase
                .from('earnings')
                .delete()
                .eq('id', id)

            if (error) {
                console.error('Error deleting item:', error)
            } else if (status === 204) {
                ElMessage.success('Удалено успешно!')
                await getUserEarnings()
            } else {
                console.log('Unexpected response:', data)
            }
        } catch (e) {
            console.error('Error during delete:', e)
        } finally {
            loading.value = false
        }
    }

    const updateEarningsAmount = async (id: string | undefined, newAmount: number | null) => {
        loading.value = true
        try {
            const {data, error} = await supabase
                .from('earnings')
                .update({amount: newAmount})
                .eq('id', id)

            if (error) {
                console.error('Ошибка обновления суммы:', error)
            }
            return {data}
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
                    const {data: dataUser, error: authError} = await supabase.auth.getUser()

                    if (authError || !dataUser) {
                        console.error(authError?.message || 'Пользователь не авторизован')
                    }

                    const userId: string | undefined = dataUser.user?.id

                    const {error: insertError} = await supabase
                        .from('expenses')
                        .insert([
                            {
                                user_id: userId,
                                category: model.category,
                                amount: model.amount,
                                date: model.date
                            }
                        ])

                    if (insertError) {
                        ElMessage.error(`${insertError.message}`)
                    }
                    ElMessage.success('Расход успешно сохранен!')
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

    const getUserExpenses = async () => {
        loading.value = true
        try {
            const {data: dataUser, error: authError} = await supabase.auth.getUser()

            if (authError || !dataUser) {
                console.error(authError?.message || 'Пользователь не авторизован')
            }

            const userId: string | undefined = dataUser.user?.id

            const {data, error} = await supabase
                .from('expenses')
                .select('*')
                .eq('user_id', userId)

            if (error) {
                ElMessage.error(`${error.message}`)
            }
            expenses.value = data || []
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const updateEarningsExpenses = async (id: string | undefined, newAmount: number | null) => {
        loading.value = true
        try {
            const {data, error} = await supabase
                .from('expenses')
                .update({amount: newAmount})
                .eq('id', id)

            if (error) {
                console.error('Ошибка обновления суммы:', error)
            }
            await getUserExpenses()
            return {data}
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

    return {
        loading,
        earnings,
        expenses,
        yearNow,
        getUserEarnings,
        createUserDataEarnings,
        deleteEarningsItemData,
        updateEarningsAmount,
        getUserExpenses,
        deleteExpensesItem,
        updateEarningsExpenses,
        createUserDataExpenses,
        logout,
        nowNewYear
    }
})
