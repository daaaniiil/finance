// import { ElNotification } from 'element-plus'
import {defineStore} from "pinia";
import {ref} from 'vue'

export const useFinanceStore = defineStore('finance', () => {
    const balance = ref<number>(0)
    const income= ref<number>(0)
    const expenses = ref<number>(0)
    const loading = ref<boolean>(false)

    const getUserData = async () => {
        try {
            loading.value = true

        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const createUserData = async (_balance: number, _income: number, _expenses: number) => {
        try {
            loading.value = true

        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        balance,
        income,
        expenses,
        getUserData,
        createUserData
    }
})
