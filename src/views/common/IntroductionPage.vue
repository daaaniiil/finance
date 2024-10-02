<template>
  <div class="introduction-page">
    <h1>Добро пожаловать в <span>finance</span>!</h1>
    <p>Здесь вы сможете:</p>
    <ul>
      <strong>Отслеживать свои расходы:</strong> <li>Записывайте каждую транзакцию и получайте полное представление о своих финансах</li>
      <strong>Устанавливать бюджеты:</strong> <li>Определяйте лимиты для различных категорий расходов, чтобы контролировать свои траты</li>
      <strong>Анализировать финансовые данные:</strong> <li>Получайте отчеты и диаграммы, чтобы понимать, где и как вы можете сэкономить</li>
<!--      <strong>Получать напоминания:</strong> <li>Настривайте уведомления о предстоящих платежах или превышении бюджета</li>-->
      <strong>Безопасно хранить информацию:</strong> <li>Все ваши данные защищены, и вы можете быть уверены в их конфиденциальности</li>
      <p>
        Начните управлять своими финансами уже сегодня!
      </p>
    </ul>
    <router-link to="/main">
      <el-button>
        Начать
      </el-button>
    </router-link>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
@use '../../styles/variable.scss' as *;

.introduction-page {
  h1 {
    span {
      color: $color_main_green;
    }
  }
  ul {
    li {
      margin-bottom: $size * 2;
      color: $color_gray_text;
    }
    list-style-type: none;

    text-align: center;
    margin-top: $radius_medium;
    margin-bottom: $size_average;
  }
  .el-button {
    width: 193px;
    height: 44px;
    color: white;
    background-color: $color_main_green;
    span {
      list-style-type: none;
      font-size: $size_average;
      @media (max-width: 376px) {
        font-size: $size_average - 5;
      }
    }
    @media (max-width: 376px) {
      width: 180px;
      height: 40px;
    }
  }
}
</style>