import {computed, reactive, ref} from "vue";
import type {Ref} from "vue";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth'
import {ElForm, FormRules} from "element-plus";
import {IAuthCredential} from "./types.ts";
import type {RouteLocationRaw} from "vue-router";
import { auth } from './firebase.ts'
import {useRouter} from 'vue-router'

export type TInstanceForm = Ref<InstanceType<typeof ElForm> | undefined>
const createValidatePassConfirm = (_form:TInstanceForm,model:IAuthCredential) => {
    return (value: any, callback: any) => {
        if (value === '') {
            callback(new Error('Пожалуйста, введите пароль'))
        } else if (value !== model.password) {
            callback(new Error('Два пароля не совпадают!'))
        } else {
            callback()
        }
    }
}
export interface IUserLoginConfig{
    afterSignUp?: RouteLocationRaw
    afterLogOut?: RouteLocationRaw
    redirectToAttempt?:boolean
}

export const useLogin = (form: TInstanceForm, config: IUserLoginConfig = {}) => {
    const router = useRouter()
    const loading = ref(false)
    const model = reactive<IAuthCredential>({
        password: '',
        checkPass: '',
        remember: false,
        email: '',
        phone: ''
    }  as any)
    const rules = computed<FormRules>(() => {
        return {
            password: {required: true, trigger: 'blur',message:'Введите пароль'},
            checkPass: {required: true, trigger: 'blur',validator:createValidatePassConfirm(form,model)},
            remember: {required: false, trigger: 'change'},
            email:{required: true, trigger: 'blur',message:'Введите почту'}
        }
    })
    const login = () => {
        if (!form.value) {
            console.error('Auth form not found')
            return;
        }

        form.value.validate(async (valid: boolean) => {
            if (valid) {
                loading.value = true
                try {
                    const persistenceType = model.remember
                        ? browserLocalPersistence // сохраняет данные при перезагрузки браузера
                        : browserSessionPersistence  // сохраняет данные только в текущей сессии

                    // Устанавливаем тип сессии
                    await setPersistence(auth, persistenceType)
                    console.log("Установлен тип сессии:", persistenceType)

                    // Выполнение входа с email && password
                    await signInWithEmailAndPassword(auth, model.email, model.password)

                    // Успешный вход (добавить перенаправление на главную)
                    console.log('Login successful')

                    if (config.redirectToAttempt) {
                        await router.push(config.afterSignUp || {name: 'main-page'})
                        // Если включен редирект перенаправляем на нужную страницу
                        // router.push(config.afterSignUp ||  { name: 'main' })
                    }
                } catch (e) {
                    console.error('Error during login:', e)
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
        model,
        rules,
        login
    }
}