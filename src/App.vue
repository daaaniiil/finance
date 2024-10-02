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
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  #app {
    color: $color_text;
    background-color: $color_white_text;
    max-width: 426px;
    margin: 0;
    padding: 50px 40px 20px;
    @media (max-width: 321px) {
      padding: 50px 20px 20px;
    }
  }
}
</style>
