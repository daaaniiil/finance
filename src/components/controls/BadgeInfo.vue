<template>
  <div class="badge-info">
    <el-tooltip :content="props.solution" :placement="props.placement ?? 'top'">
      <icon-md :glyph="MaterialIcons.help_outline" :is-pointer="true"/>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import {MaterialIcons} from "../../types";
import IconMd from "../IconMd.vue";

const props = defineProps<{
  placement?:string
  solution:string
}>()
</script>

<style lang="scss">
@use 'sass:math';
.badge-info {
  position: relative;
  border: none;
  cursor: pointer;
  $size:22px;
  color: gray;
  height: $size;
  .material-icons{
    height: $size;
    width: $size;
    right: 7px;
    top: math.div($size, 1.2);
    position: absolute;
    &::before{
      --font-size:#{$size} !important;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>