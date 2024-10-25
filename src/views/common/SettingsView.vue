<template>
  <div class="settings-page">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'analytics-page' }">Аналитика</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'settings-page' }">Настройки</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h2>Профиль</h2>
      <hr>
      <p>Имя: <span>Даниил</span></p>
      <p>email: <strong>diniilmelnikov@gmail.com</strong></p>
      <p>Телефон: <span>+375333904420</span></p>

      <el-row :gutter="20">
        <el-col :md="18">
          <div class="settings-page__currency-selector">
            <el-radio-group v-model="selectedCurrency">
              <el-radio-button label="BYN">
                <el-tag type="success">
                  <div>
                    <el-image src="/src/assets/img/flag/belarus-flag-icon.png" alt="Беларусь" />
                    BYN
                  </div>
                </el-tag>
              </el-radio-button>
              <el-radio-button label="RUB">
                <el-tag type="warning">
                  <div>
                    <el-image src="/src/assets/img/flag/russian-flag-icon.png" alt="Россия" />
                    RUB
                  </div>
                </el-tag>
              </el-radio-button>
              <el-radio-button label="USD">
                <el-tag type="info">
                  <div>
                    <el-image src="/src/assets/img/flag/usa-flag-icon.png" alt="США" class="flag-usa" />
                    USD
                  </div>
                </el-tag>
              </el-radio-button>
            </el-radio-group>
          </div>

          <div class="settings-page__password">
            <h3>Подтвердите пароль</h3>
            <el-form ref="form" :rules="rules" :model="model" status-icon @submit.prevent>
              <el-form-item prop="password">
                <el-input v-model="model.password" type="password" placeholder="Введите ваш пароль"/>
              </el-form-item>
              <el-button type="primary">Сменить</el-button>
            </el-form>
          </div>
        </el-col>
        <el-col :md="6">
          <p>Статус</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from 'vue'
import {FormRules} from "element-plus";

const form = ref()

const model = reactive({
  password: '',
} as any)
const rules = computed<FormRules>(() => {
  return {
    password: {required: true, trigger: 'blur', message: 'Введите ваш пароль'},
  }
})

const selectedCurrency = ref('BYN')
</script>

<style lang="scss">
@use '../../styles/variable.scss' as *;

.settings-page {
  hr {
    margin: 0 0 $padding 0;
  }

  h2 {
    margin-bottom: $padding_main;

    span {
      color: $color_main_green;
    }
  }

  p {
    margin: $padding - 5 0;

    span {
      font-weight: 500;
    }
  }

  &__currency-selector {
    margin-top: $padding - 10;
    display: flex;
    gap: 8px;
    align-items: center;

    .el-radio-button.is-active .el-radio-button__original-radio:not(:disabled) + .el-radio-button__inner {
      background-color: #d8ffd7;
      border-color: $color_main_green_2;
      box-shadow: -1px 0 0 0 $color_main_green_2;
    }

    .el-radio-button .el-radio-button__inner {
      padding: $padding - 15;
      margin-right: $padding_main;
      border-radius: $radius_tiny;
      box-shadow: -1px 0 0 0 $color_border_gray;
    }

    .el-tag {
      div {
        display: flex;
        align-items: center;
        flex-direction: row;
      }
    }
    .el-image {
      width: 22px;
      height: 13px;
      margin-right: $padding - 10;
      border-radius: $radius_tiny - 3;
    }
    .flag-usa {
      height: 22px;
    }
  }
  &__password {
    margin-top: $padding_average;
    h3 {
      margin-bottom: $padding - 5;
    }
    .el-input {
      max-width: 300px;
    }
  }
}
</style>