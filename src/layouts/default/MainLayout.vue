<template>
  <div class="main-layout">
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
                  <router-link :to="{name:'main-page'}">Главная</router-link>
                  <router-link :to="{name:'analytics-page'}">Аналитика</router-link>
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
import {defineComponent} from "vue";
import IndentContainer from "@/components/containers/IndentContainer.vue";

export default defineComponent({
  name: "EmptyLayout",
  components: {IndentContainer},
  setup() {


    return {}
  }
})
</script>

<style lang="scss">
@use '../../styles/variable.scss' as *;

.main-layout {

  &__wrap,
  &__main-container {
    height: 100%;
  }

  .el-footer {
    margin-top: $size_average;
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

  &__main-container {
    background-color: #fff;
  }

  .el-header {
    padding: $radius_medium 0;

    img {
      margin-right: $size;
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
          gap: $size_big;
        }
      }
    }
  }

  .el-main {
    padding: 0;
  }
}
</style>