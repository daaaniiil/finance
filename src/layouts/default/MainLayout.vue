<template>
  <div class="main-layout">
    <el-container>
      <el-header>
        <div class="main-layout__header">
          <img src="../../../public/finance.png" alt="Logo">
          <p>finance</p>
        </div>
      </el-header>
      <el-main>
        <el-scrollbar>
          <div class="main-layout__main-content">
            <router-view name="default" class="main-layout-view" v-slot="{ Component, route }">
              <transition name="fade-down" mode="out-in" appear>
                <div :key="route.name">
                  <component :is="Component"/>
                </div>
              </transition>
            </router-view>
          </div>
          <!--        <el-footer></el-footer>-->
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
export default defineComponent({
  name: "EmptyLayout",
})
</script>

<style lang="scss">
@use '../../styles/variable.scss' as *;

.main-layout {
  &__header {
    display: flex;
    align-items: center;
  }

  .el-main {
    padding: 0;
  }

  .el-header {
    z-index: 1;
    width: 100%;
    position: fixed;
    padding: $radius_medium $radius_average;
    left: 0;
    top: 0;
    margin: 0;
    background-color: #fff;
    img {
      margin-right: $size;
      height: 2em;
    }

    p {
      color: #30CA2C;
      font-weight: 700;
    }
    @media (max-width: 321px) {
      padding: $radius_medium $radius_average - 10;
    }
  }

}
</style>