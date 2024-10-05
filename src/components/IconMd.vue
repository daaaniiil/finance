<template>
  <i class="material-icons" :style="style" v-bind="$attrs">
    <slot>{{ iconName }}</slot>
  </i>
</template>

<script lang="ts">
import {defineComponent, PropType, computed} from 'vue'
import type { CSSProperties } from 'vue'
import {MaterialIcons} from "../types";

export default defineComponent({
  name: 'IconMd',
  props: {
    size: {
      type: Number,
      default:20
    },
    color: {
      type: String,
    },
    glyph: {
      require: true,
      type: String as PropType<MaterialIcons>,
    },
    isPointer: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const iconName = computed(() => {
      if(!props.glyph){
        return ''
      }
      return String.fromCharCode(parseInt(props.glyph, 16))
    })

    return {
      iconName,
      style: computed<CSSProperties>(() => {
        if (!props.size && !props.color && !props.glyph && !props.isPointer) {
          return {}
        }
        return {
          ...(props.isPointer ? { '--pointer': `all` } : {}),
          ...(props.size ? { '--font-size': `${props.size}px` } : {}),
          ...(props.color ? { '--color': props.color } : {}),
          ...(props.glyph ? { '--glyph': `"\\${props.glyph}"` } : {}),
        } as CSSProperties
      }),
    }
  }
})
</script>