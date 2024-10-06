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
        <el-button type="primary" :loading="loading" @click="login">Вход</el-button>
      </el-form-item>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {useLogin} from "../resources/auth";
import BadgeInfo from "@/components/controls/BadgeInfo.vue";

export default defineComponent({
  name: 'LoginForm',
  components: {BadgeInfo},
  setup() {
    const form = ref()
    const {model,rules,loading,login} = useLogin(form, {afterSignUp:{name:'main-page'},redirectToAttempt:true})

    return {
      model,
      rules,
      loading,
      form,
      login
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
    .el-button {
      width: 100%;
    }
  }
}
</style>