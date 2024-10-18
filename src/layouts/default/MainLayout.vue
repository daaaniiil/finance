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
              <div class="main-layout__footer">
                <p>Footer</p>
              </div>
            </el-footer>
          </el-container>
        </div>
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
            <h1>Footer</h1>
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
    margin-top: $padding_medium - 1;
    height: 200px;
    background-color: darkgrey;
    width: 100%;
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


  &__aside-container {
    height: 100vh;

    .el-header, .el-footer {
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