<template>
  <div class="form-login">
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
            placeholder="Почта"
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
        <el-button v-if="route.name === 'login-page'" type="primary" :loading="loading" @click="login">Вход</el-button>
        <el-button v-else type="primary" :loading="loading" @click="register">Зарегистрироваться</el-button>
      </el-form-item>
      <router-link v-if="route.name === 'register-page'" :to="{name: 'login-page'}">Уже есть аккаунт?</router-link>
      <router-link v-else :to="{name: 'register-page'}">Еще нет аккаунта?</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {useLogin} from "../resources/auth";
import {useRoute} from "vue-router";

export default defineComponent({
  name: 'LoginForm',
  setup() {
    const route = useRoute()
    const form = ref()
    const {model,rules,loading,login,register} = useLogin(form, {afterSignUp:{name:'main-page'},redirectToAttempt:true})

    return {
      model,
      rules,
      loading,
      form,
      route,
      login,
      register
    }
  }
})
</script>

<style lang="scss">
@use '../styles/variable.scss' as *;

.form-login {
  .el-form-item {
    &:nth-child(1) {
      margin-bottom: $padding_average;
    }
    &:nth-child(3) {
      margin-bottom: $padding - 5;
    }
    .el-select .el-input {
      width: 80px;
    }
    .el-button {
      width: 100%;
    }
  }
  &-wrap {
    a {
      color: $color_empty_green_2;
      font-size: $size_default - 3;
      border-bottom: none;
      font-weight: 700;
      background-size: 0;
    }
  }
}
</style>