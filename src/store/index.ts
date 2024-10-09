import { ElNotification } from 'element-plus'
import {defineStore} from "pinia";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {auth, db} from '../resources/firebase';
import {ref} from 'vue'

export const useFinanceStore = defineStore('finance', () => {
    const balance = ref<number>(0)
    const income= ref<number>(0)
    const expenses = ref<number>(0)
    const loading = ref<boolean>(false)

    const getUserData = async () => {
        try {
            loading.value = true
            const user = auth.currentUser
            if (user) {
                const userId = user.uid
                const userDoc = await getDoc(doc(db, 'users', userId))

                if (userDoc.exists()) {
                    const data = userDoc.data()
                    balance.value = data.balance
                    income.value = data.income
                    expenses.value = data.expenses
                    return data
                } else {
                    console.log('Документ не найден')
                }
            } else {
                console.log('Пользователь не авторизован')
            }
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const createUserData = async (balance: number, income: number, expenses: number) => {
        try {
            loading.value = true
            const user = auth.currentUser
            if(user) {
                const userId = user.uid

                const userData = {
                    balance: balance,
                    income: income,
                    expenses: expenses
                }

                await setDoc(doc(db, 'users', userId), userData)
                await getUserData()

                ElNotification({
                    title: 'Успешно',
                    message: 'Данные успешно записаны!',
                    type: 'success',
                })
            } else {
                console.log('Пользователь не авторизован')
            }
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
