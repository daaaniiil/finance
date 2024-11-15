<template>
  <div class="settings-page">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'analytics-page' }">Аналитика</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'settings-page' }">Настройки</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h2>Профиль</h2>

<!--      <p>Имя: <span>Даниил</span></p>-->
      <p>email: <strong>diniilmelnikov@gmail.com</strong></p>
      <p>Телефон: <span>+375333904420</span></p>
      <p>Зарегистрирован: <span>{{ createdAt }}</span></p>

      <el-row :gutter="20">
        <el-col :md="18">
          <currency-switcher />

<!--          <div class="settings-page__password">-->
<!--            <h3>Добавьте ваш телефон</h3>-->
<!--            <el-form ref="form" :rules="rules" :model="model" status-icon @submit.prevent>-->
<!--              <el-form-item prop="password">-->
<!--                <el-input v-model="model.password" type="password" placeholder="Введите ваш телефон"/>-->
<!--              </el-form-item>-->
<!--              <el-button type="primary">Сохранить</el-button>-->
<!--            </el-form>-->
<!--          </div>-->

<!--          <h2>Смена пароля</h2>-->
<!--          <div class="settings-page__password">-->
<!--            <h3>Подтвердите пароль</h3>-->
<!--            <el-form ref="form" :rules="rules" :model="model" status-icon @submit.prevent>-->
<!--              <el-form-item prop="password">-->
<!--                <el-input v-model="model.password" type="password" placeholder="Введите ваш пароль"/>-->
<!--              </el-form-item>-->
<!--              <el-button type="primary">Сменить</el-button>-->
<!--            </el-form>-->
<!--          </div>-->
        </el-col>
        <el-col :md="6">
          <p>Статус</p>
          <el-button type="danger" @click="store.logout()">Выход</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {computed, reactive, ref, onMounted} from 'vue'
import {FormRules} from "element-plus";
import {useFinanceStore} from "@/store";
import CurrencySwitcher from "@/components/CurrencySwitcher.vue";

const store = useFinanceStore()
const form = ref()

const model = reactive({
  password: '',
} as any)
const rules = computed<FormRules>(() => {
  return {
    password: {required: true, trigger: 'blur', message: 'Введите ваш пароль'},
  }
})

const createdAt = computed(() => store.user?.created_at?.slice(0,10).split('-').reverse().join('.'))

onMounted(async () => {
  await store.authUser()
})
</script>

<style lang="scss">
@use '../../styles/variable.scss' as *;

.settings-page {
  hr {
    margin: 0 0 $padding 0;
  }

  h2 {
    border-bottom: 1px solid gray;
    padding-bottom: $padding_main;
    margin-bottom: $padding_main;

    span {
      color: $color_main_green;
    }
    &:nth-child(2) {
      margin-top: $padding_average;
      padding-bottom: $padding - 5;
      border-bottom: 1px solid black;
    }
  }

  p {
    margin: $padding - 5 0;

    span {
      font-weight: 500;
    }
  }
  &__password {
    margin-top: $padding_main;
    h3 {
      margin-bottom: $padding - 5;
    }
    .el-input {
      max-width: 300px;
    }
  }
}
</style>