<template>
  <div class="empty-layout">
    <router-view class="empty-layout-view" v-slot="{ Component }">
      <transition name="fade-down" mode="out-in" appear>
        <component :is="Component"/>
      </transition>
    </router-view>
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

.empty-layout {
  .empty-layout-view {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
}
</style>