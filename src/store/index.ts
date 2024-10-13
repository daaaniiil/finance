import {defineStore} from "pinia";
import {ref} from 'vue'
import {supabase} from "../resources/supabase.ts";
import {IEarnings} from "../resources/types.ts";
import {ElMessage} from "element-plus";
import {TInstanceForm} from "../resources/auth.ts";

export const useFinanceStore = defineStore('finance', () => {
    const balance = ref<number>(0)
    const income= ref<number>(0)
    const expenses = ref<number>(0)
    const earnings = ref<IEarnings[]>([])
    const loading = ref<boolean>(false)

    const getUserData = async () => {
        loading.value = true
        try {
            const {data: dataUser, error: authError} = await supabase.auth.getUser()

            if(authError || !dataUser){
                console.error(authError?.message || 'Пользователь не авторизован')
            }

            const userId: string | undefined  = dataUser.user?.id

            const {data, error} = await supabase
                .from('earnings')
                .select('month, amount')
                .eq('user_id', userId)

            if(error){
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

    const createUserData = async (form: TInstanceForm, model: IEarnings) => {
        if (!form.value) {
            console.error('Add earnings form not found')
            return
        }

        form.value.validate(async (valid: boolean) => {
            if(valid) {
                loading.value = true
                try {
                    const {data: dataUser, error: authError} = await supabase.auth.getUser()

                    if(authError || !dataUser){
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

                    if(insertError) {
                        ElMessage.error(`${insertError.message}`)
                    } else {
                        ElMessage.success('Заработок успешно добавлен!')
                        await getUserData()
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

    return {
        loading,
        balance,
        income,
        expenses,
        earnings,
        getUserData,
        createUserData
    }
})
