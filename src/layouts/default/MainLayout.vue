<template>
  <div class="main-layout">
    <el-drawer
        class="main-layout__sidebar-drawer"

        v-model="drawerState"
        :with-header="false"
        :show-close="false"
        size="300px"
        :append-to-body="false"
        direction="rtl">
      <div>
        <el-container class="main-layout__aside-container">
          <el-header ref="headerAside">
            <div class="main-layout__header-aside">
              <img src="../../../public/finance.png" alt="Logo" style="width: 25px; height: 25px">
              <p>finance</p>
            </div>
            <el-button type="danger" @click="drawerState = false">
              <el-icon class="el-icon--left">
                <CircleCloseFilled/>
              </el-icon>
              Close
            </el-button>
          </el-header>
          <el-main>
            <el-scrollbar>
              <div class="main-layout__aside-content">
                <router-link :to="{name:'main-page'}">Главная</router-link>
                <router-link :to="{name:'income-expenses-page'}">Доходы & Расходы</router-link>
                <router-link :to="{name:'analytics-page'}">Аналитика</router-link>
                <router-link :to="{name:'settings-page'}">Настройки</router-link>
              </div>
            </el-scrollbar>
          </el-main>
          <el-footer>
            <div class="main-layout__footer-menu">
              <div class="main-layout__footer-menu-social">
                <h3>Социальные сети</h3>
                <div>
                  <a href="#"><img src="../../assets/img/facebook.png" alt="facebook" width="30"></a>
                  <a href="#"><img src="../../assets/img/vk.png" alt="vk" width="30"></a>
                  <a href="#"><img src="../../assets/img/instagram.png" alt="instagram" width="30"></a>
                </div>
                <div>
                  <a href="#"><img src="../../assets/img/twitter.png" alt="twitter" width="30"></a>
                  <a href="#"><img src="../../assets/img/youtube.png" alt="youtube" width="30"></a>
                </div>
              </div>
              <div class="main-layout__footer-menu-finance">
                <img src="../../../public/finance.png" alt="Logo" width="38">
                <p>finance</p>
              </div>
              <p>© 2024 finance. Все права защищены.</p>
            </div>
          </el-footer>
        </el-container>
      </div>
    </el-drawer>
    <el-container class="main-layout__main-container">
      <el-header height="auto">
        <indent-container>
          <div class="main-layout__header">
            <el-row :gutter="20">
              <el-col :md="12" :lg="3" :xs="12" :sm="6">
                <img src="../../../public/finance.png" alt="Logo">
                <p>finance</p>
              </el-col>
              <el-col :md="12" :lg="21" :xs="12" :sm="18">
                <div class="nav-links">
                  <el-button type="primary" @click="drawerState = !drawerState">
                    <el-icon size="25">
                      <More/>
                    </el-icon>
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </indent-container>
      </el-header>
      <el-main>
        <el-scrollbar height="100vh">
          <div class="main-layout__main-content">
            <indent-container>
              <router-view name="default" class="main-layout-view" v-slot="{ Component, route }">
                <transition name="fade-down" mode="out-in" appear>
                  <div :key="route.name">
                    <component :is="Component"/>
                  </div>
                </transition>
              </router-view>
            </indent-container>
          </div>
          <el-footer>
            <div class="main-layout__footer">
              <el-row :gutter="20">
                <el-col :md="8">
                  <h3>Мой аккаунт</h3>
                  <router-link :to="{name: 'settings-page'}">Мой профиль</router-link>
                  <router-link :to="{name: 'main-page'}">Связаться с нами</router-link>
                  <router-link :to="{name: 'main-page'}">Карьера</router-link>
                  <router-link :to="{name: 'main-page'}">Специальные предложения</router-link>
                </el-col>
                <el-col :md="8">
                  <h3>Навигация</h3>
                  <router-link :to="{name: 'income-expenses-page'}">Доходы & Расходы</router-link>
                  <router-link :to="{name: 'main-page'}">Главная</router-link>
                  <router-link :to="{name: 'analytics-page'}">Аналитика</router-link>
                  <router-link :to="{name: 'settings-page'}">Настройки</router-link>
                </el-col>
                <el-col :md="8">
                  <h3>Социальные сети</h3>
                  <div>
                    <a href="#"><img src="../../assets/img/facebook.png" alt="facebook" width="30"></a>
                    <a href="#"><img src="../../assets/img/vk.png" alt="vk" width="30"></a>
                    <a href="#"><img src="../../assets/img/instagram.png" alt="instagram" width="30"></a>
                  </div>
                  <div>
                    <a href="#"><img src="../../assets/img/twitter.png" alt="twitter" width="30"></a>
                    <a href="#"><img src="../../assets/img/youtube.png" alt="youtube" width="30"></a>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :md="8">
                  <img src="../../../public/finance.png" alt="Logo" width="38">
                  <p>finance</p>
                </el-col>
                <el-col :md="8">
                  <img src="../../assets/img/letter.png" alt="letter" width="13">
                  <p>finance@greenshop.com</p>
                </el-col>
                <el-col :md="8">
                  <img src="../../assets/img/call.png" alt="call" width="12">
                  <p>+88 01911 717 490</p>
                </el-col>
              </el-row>
              <div style="margin-top: 10px;">© 2024 finance. Все права защищены.</div>
            </div>
          </el-footer>
        </el-scrollbar>
        <el-backtop target=".el-scrollbar__wrap"/>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import IndentContainer from "@/components/containers/IndentContainer.vue";
import {
  More,
  CircleCloseFilled
} from '@element-plus/icons-vue'

export default defineComponent({
  name: "MainLayout",
  components: {IndentContainer, CircleCloseFilled, More},
  setup() {
    const drawerState = ref(false)
    const headerAside = ref<HTMLElement | null>(null)

    return {
      drawerState,
      headerAside
    }
  }
})
</script>

<style lang="scss">
@use '../../styles/variable.scss' as *;

.main-layout {

  &__sidebar-drawer {
    .el-drawer__body {
      height: 100%;
      padding: 0;
    }
  }

  &__wrap,
  &__main-container,
  &__aside-container {
    height: 100%;
  }

  .el-footer {
    padding: 0;
    margin-top: $padding_medium - 1;
    border-top: $color_border_gray 1px solid;
    background: $color_background_gray;
    height: 400px;
    width: 100%;
    @media(max-width: 769px) {
      height: 760px;
    }
    @media(max-width: 376px) {
      height: 730px;
    }
  }

  &__footer {
    text-align: center;

    h3 {
      margin-bottom: $padding;
      @media(max-width: 769px) {
        margin-top: $padding_main;
      }
    }

    a {
      margin-bottom: $padding - 5;

      &.active {
        font-weight: 400;
        color: $color_text;
      }

      &:hover {
        padding-left: 0;
        color: $color_text;
      }
    }

    .el-row {
      padding-top: $padding_main;

      .el-col {
        &:nth-child(1), &:nth-child(2) {
          display: flex;
          flex-direction: column;
        }

        img {
          margin: $padding - 10;
        }
      }

      &:nth-child(2) {
        height: 76px;
        margin-top: $padding_main;
        padding-top: 0;
        background-color: $color_empty_green;
        border-top: $color_main_green 1px solid;
        border-bottom: $color_main_green 1px solid;

        .el-col {
          justify-content: center;

          &:nth-child(1) {
            display: flex;
            flex-direction: row;
            align-items: center;

            p {
              margin-left: $padding - 5;
              font-family: "Syne", sans-serif;
              user-select: none;
              color: $color_main_green;
              font-weight: 700;
              font-size: $size_average + 2;
            }
          }

          &:nth-child(2), &:nth-child(3) {
            display: flex;
            flex-direction: row;
            align-items: center;

            p {
              margin-left: $padding;
              font-family: "Montserrat", sans-serif;
            }

            @media(max-width: 769px) {
              display: none;
            }
          }
        }
      }
    }
  }

  &__header, &__footer {
    height: 100%;
    align-items: center;

    p {
      font-family: "Syne", sans-serif;
      user-select: none;
    }
  }

  &__main-content {
    margin-top: $padding;
  }

  &__main-container {
    background-color: #fff;
  }

  .el-header {
    border-bottom: $color_border_gray 1px solid;
    padding: $padding 0;

    img {
      margin-right: $padding - 5;
      height: 2em;
    }

    p {
      color: $color_main_green;
      font-weight: 700;
    }
  }

  &__header {
    .el-row {
      .el-col {
        display: flex;
        align-items: center;
      }

      .el-col:nth-child(2) {
        justify-content: flex-end;

        .nav-links {
          display: flex;
          gap: $padding_medium + 1;
        }
      }
    }
  }

  .el-main {
    padding: 0;
  }


  &__footer-menu {
    text-align: center;

    a {
      margin-bottom: $padding - 5;

      &.active {
        font-weight: 400;
        color: $color_text;
      }

      &:hover {
        padding-left: 0;
        color: $color_text;
      }
    }

    &-social {
      margin-top: $padding_main;

      h3 {
        margin-bottom: $padding;
      }

      img {
        margin: $padding - 10;
      }
    }

    &-finance {
      margin-top: $padding_main;
      padding: $padding - 5 0;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      background-color: $color_empty_green;
      border-top: $color_main_green 1px solid;
      border-bottom: $color_main_green 1px solid;

      p {
        margin-left: $padding - 5;
        font-family: "Syne", sans-serif;
        user-select: none;
        color: $color_main_green;
        font-weight: 700;
        font-size: $size_average + 2;
      }
    }

    p:nth-child(3) {
      margin-top: $padding - 10;
      font-size: $radius_medium - 1;
    }
  }

  &__aside-container {
    height: 100vh;

    .el-footer {
      max-height: 255px;
      align-items: center;
      border-top: $color_border_gray 1px solid;
    }

    .el-header {
      border-bottom: $color_border_gray 1px solid;
      border-top: $color_border_gray 1px solid;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: $padding - 5;
      padding-right: $padding - 5;
      background-color: white;
    }

    .main-layout__aside-content {
      padding: $padding - 5;
      display: flex;
      flex-direction: column;

      a {
        margin-bottom: $padding - 5;
      }
    }
  }

  &__header-aside {
    display: flex;
    align-items: center;
    user-select: none;
  }
}
</style>