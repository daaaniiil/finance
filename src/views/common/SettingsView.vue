<template>
  <div class="settings-page">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'analytics-page' }">Аналитика</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'settings-page' }">Настройки</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h2>Профиль</h2>
      <p>email: <strong>{{emailUser}}</strong></p>
      <p>Зарегистрирован: <span>{{ createdAt }}</span></p>

      <currency-switcher/>
      <div class="settings-page__exit">
        <el-popconfirm
            width="220"
            title="Вы уверены что вы хотите выйти?"
            @confirm="store.logout()">
          <template #reference>
            <el-button type="danger">Выход</el-button>
          </template>
          <template #actions="{ confirm, cancel }">
            <el-button type="warning" size="small" @click="cancel">Нет!</el-button>
            <el-button type="danger" size="small" @click="confirm">Да</el-button>
          </template>
        </el-popconfirm>
      </div>
    </el-card>

    <high-chart-earnings :months="monthLabel" :salaries="salaryValues" />
    <!--      <el-row :gutter="20">-->
    <!--        <el-col :md="18">-->
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
    <!--        </el-col>-->
    <!--        <el-col :md="6">-->
    <!--          <p>Статус</p>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from 'vue'
// import {FormRules} from "element-plus";
import {useFinanceStore} from "@/store";
import CurrencySwitcher from "@/components/CurrencySwitcher.vue";
import HighChartEarnings from "@/components/highCharts/HighChartEarnings.vue";
import {IEarnings, IMonths} from "@/resources/types.ts";

const store = useFinanceStore()
// const form = ref()
//
// const model = reactive({
//   password: '',
// } as any)
// const rules = computed<FormRules>(() => {
//   return {
//     password: {required: true, trigger: 'blur', message: 'Введите ваш пароль'},
//   }
//})

const createdAt = computed(() => store.user?.created_at?.slice(0, 10).split('-').reverse().join('.'))
const emailUser = computed(() => store.user?.email)

const sortedEarnings = computed(() => {
  return store.earnings.slice().sort((a: IEarnings, b: IEarnings) => {
    const monthA = store.months.findIndex((month: IMonths) => month.label === a.month)
    const monthB = store.months.findIndex((month: IMonths) => month.label === b.month)
    return monthB - monthA
  })
})
const monthLabel = computed(() => sortedEarnings.value.map((e: IEarnings) => e.month).reverse())
const salaryValues = computed(() => sortedEarnings.value.map((e: IEarnings) => e.amount).reverse())

onMounted(async () => {
  await store.authUser()
  await store.getUserEarnings()
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

  &__exit {
    margin-top: $padding;
  }

  p {
    margin: $padding - 5 0;

    span {
      font-weight: 500;
    }
  }

  &__phone {
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