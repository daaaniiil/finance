<template>
  <div class="page-register">
    <login-form>
      <template #title>
        <div class="page-register__title">
          <h1>Регистрация</h1>
        </div>
      </template>
    </login-form>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import LoginForm from '../../forms/LoginForm.vue';
export default defineComponent({
  name: 'RegisterPage',
  components: { LoginForm },
})
</script>

<style lang="scss">
@use '../../styles/variable.scss' as *;

.page-register {
  display: flex;
  justify-content: center;
  padding-top: 200px;
  height: 100%;
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
      margin-bottom: 24px;
      flex: auto;
      font-size: 36px;
      text-align: center;
    }

    img {
      height: 32px;
      margin-left: auto;
    }
  }
  form{
    width: 300px;
    margin: 0 auto;
  }
}
</style>