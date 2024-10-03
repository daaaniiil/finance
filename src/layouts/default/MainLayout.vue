<template>
  <div class="main-layout">
    <el-container>
      <el-header height="auto">
        <indent-container>
          <div class="main-layout__header">
            <el-row :gutter="20">
              <el-col :md="12" :lg="20">
                <img src="../../../public/finance.png" alt="Logo">
                <p>finance</p>
              </el-col>
              <el-col :md="12" :lg="4">
                <router-link :to="{name:'main'}">
                  Главная
                </router-link>
                <router-link :to="{name:'transaction'}">
                  Транзакции
                </router-link>
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
          <!--        <el-footer></el-footer>-->
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


    return {

    }
  }
})
</script>

<style lang="scss">
@use '../../styles/variable.scss' as *;

.main-layout {
  &__header {
    display: flex;
    align-items: center;
    .el-row {
      .el-col {
        display: flex;
        align-items: center;
      }
      .el-col:nth-child(2) {
        a {
          margin-left: 15px;
        }
      }
    }
  }

  .el-main {
    padding: 0;
  }
  .el-backtop {
    .el-icon {
      color: $color_main_green;
    }
  }

  .el-header {
    padding: $radius_medium $radius_average;
    img {
      margin-right: $size;
      height: 2em;
    }

    p {
      color: $color_main_green;
      font-weight: 700;
    }
    @media (max-width: 321px) {
      padding: $radius_medium $size;
    }
  }

}
</style>