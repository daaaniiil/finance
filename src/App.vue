<template>
  <component :is="layoutComponent"/>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {useRoute} from "vue-router";
import MainLayout from "./layouts/default/MainLayout.vue";
import EmptyLayout from "./layouts/default/EmptyLayout.vue";

const route = useRoute()

const layoutComponent = computed(() => {
  if(route?.meta?.layout === 'main-layout')
    return MainLayout
  return EmptyLayout
})

</script>

<style lang="scss">
@use 'styles/variable' as *;

body{
  margin: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  #app {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
</style>
