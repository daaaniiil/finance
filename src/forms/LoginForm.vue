<template>
  <div class="form-login">
    <badge-info solution="Введите почту и пароль" />
    <slot name="title"></slot>
    <div class="form-login-wrap">
      <el-form
        ref="form"
        :rules="rules"
        status-icon
        :model="model"
        :disabled="loading"
        @submit.prevent>
        <el-form-item
          prop="email">
          <el-input
            v-model="model.email"
            size="large"
            placeholder="Логин"
          />
        </el-form-item>

        <el-form-item
          prop="password">
          <el-input
            v-model="model.password"
            show-password
            size="large"
            placeholder="Пароль"
          />
        </el-form-item>
      </el-form>
      <el-form-item>
        <el-switch
          v-model="model.remember"
          inactive-text="Запомнить меня"
        ></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" >Вход</el-button>
      </el-form-item>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, Ref, computed, ref, reactive} from 'vue';
import type {ElForm, FormRules} from "element-plus";
import {IAuthCredential} from "../resources/types";
import BadgeInfo from "@/components/controls/BadgeInfo.vue";

export default defineComponent({
  name: 'LoginForm',
  components: {BadgeInfo},
  setup() {
    const form = ref()

    // перенести в файл auth.ts
    const loading = ref(false)
    type TInstanceForm = Ref<InstanceType<typeof ElForm> | undefined>
    const createValidatePassConfirm = (form:TInstanceForm,model:IAuthCredential) => {
      return (rule: any, value: any, callback: any) => {
        console.log(form, rule)
        if (value === '') {
          callback(new Error('Пожалуйста, введите пароль'))
        } else if (value !== model.password) {
          callback(new Error('Два пароля не совпадают!'))
        } else {
          callback()
        }
      }
    }

    const model = reactive<IAuthCredential>({
      password: '',
      checkPass: '',
      remember: false,
      email: '',
      phone: ''
    })

    const rules = computed<FormRules>(() => {
      return  {
        password: {required: true, trigger: 'blur',message:'Введите пароль'},
        checkPass: {required: true, trigger: 'blur',validator:createValidatePassConfirm(form,model)},
        remember: {required: false, trigger: 'change'},
        email:{required: true, trigger: 'blur',message:'Введите логин'}
      }
    })

    return {
      model,
      rules,
      loading,
      form
    }
  }
})
</script>

<style lang="scss">
@use '../styles/variable.scss' as *;

.form-login {
  .el-form-item {
    margin-bottom: 30px;

    .el-select .el-input {
      width: 80px;
    }
    // перенести в глобальные стили
    // el-input
    .el-input__wrapper.is-focus {
      box-shadow: 0 0 0 1px $color_main_green inset;
    }
    .el-input__wrapper {
      border-radius: $size;
    }
    // el-button
    .el-button {
      border-radius: $size;
      width: 100%; // оставить тут
      background-color: $color_main_green;
      border: none;
      transition: all linear .2s;
      &:hover {
        background-color: $color_empty_green;
      }
    }
    // el-switch
    .el-switch.is-checked .el-switch__core{
      background-color: $color_main_green;
      border-color: $color_main_green;
    }
    .el-switch {
      .is-active {
        color: $color_main_green;
      }
    }
  }
}
</style>