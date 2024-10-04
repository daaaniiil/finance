<template>
  <div class="page-login">
    <login-form>
      <template #title>
        <div class="page-login__title">
          <h1>Вход в <span>аккаунт</span></h1>
        </div>
      </template>
    </login-form>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import LoginForm from "../../forms/LoginForm.vue";
export default defineComponent({
  name: 'LoginPage',
  components: { LoginForm },
})
</script>

<style lang="scss">
@use '../../styles/variable.scss' as *;

.page-login {
  display: flex;
  justify-content: center;
  padding-top: 200px;
  height: 100%;
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
      flex: 36px;
      text-align: center;
      margin-top: 0;
      span {
        color: $color_main_green;
      }
    }

    //img {
    //  height: 32px;
    //  margin-left: auto;
    //}
  }
  form{
    width: 300px;
    margin: 0 auto;
  }
}
</style>