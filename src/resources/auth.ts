import {computed, reactive, ref} from "vue";
import type {Ref} from "vue";
import {ElForm, FormRules} from "element-plus";
import {IAuthCredential} from "./types.ts";
import type {RouteLocationRaw} from "vue-router";
import {supabase} from './supabase.ts';
import {useRouter} from 'vue-router'
import { ElNotification } from 'element-plus'

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

export const useLogin = (form: TInstanceForm, _config: IUserLoginConfig = {}) => {
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
            password: {required: true, trigger: 'blur',message:'Введите пароль', min: 6},
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
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email: model.email,
                        password: model.password
                    })

                    if(error){
                        console.error('Ошибка при входе:', error.message)
                        ElNotification({
                                title: 'Ошибка!',
                                message: 'Не верный логин или пароль',
                                type: 'error',
                            })
                    } else if(data.session) {
                        if(model.remember){
                            await supabase.auth.setSession(data.session)
                        } else {
                            await supabase.auth.setSession(data.session)
                            sessionStorage.setItem('supabase.auth.token', JSON.stringify(data.session))
                        }

                        console.log('Пользователь успешно вошел:', data.user)
                        ElNotification({
                            title: 'Вход выполнен!',
                            message: 'Вы успешно вошли в аккаунт',
                            type: 'success',
                        })

                        await router.push({name:'main-page'})
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
    const register = () => {
        if (!form.value) {
            console.error('Auth form not found')
            return;
        }

        form.value.validate(async (valid: boolean) => {
            if(valid) {
                loading.value = true
                try {
                    const { data, error } = await supabase.auth.signUp({
                        email: model.email,
                        password: model.password
                    })

                    if(data.session) {
                        if(!model.remember){
                            await supabase.auth.setSession(data.session)
                            sessionStorage.setItem('supabase.auth.token', JSON.stringify(data.session))
                        } else {
                            await supabase.auth.setSession(data.session)
                        }

                        console.log('Пользователь успешно зарегистрирован:', data.user)
                        ElNotification({
                            title: 'Вы успешно зарегистрировались!',
                            message: 'Регистрация прошла успешно',
                            type: 'success',
                        })

                        await router.push({name:'main-page'})
                    } else if(error) {
                        console.error('Ошибка при регистрации:', error.message)
                        ElNotification({
                            title: 'Ошибка!',
                            message: 'Произошла ошибка',
                            type: 'error',
                        })
                    }
                } catch (e) {
                    console.error('Error during register:', e)
                } finally {
                    loading.value = false
                }
            } else {
                console.error('Register form not found')
                return
            }
        })
    }
    return {
        loading,
        model,
        rules,
        login,
        register
    }
}