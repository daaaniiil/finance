<script lang="ts">
import {h, defineComponent} from "vue";
export default defineComponent({
  name: "IndentContainer",
  setup(props,{slots}){
    return ()=> {
      const children = slots.default ? slots.default(props) : []
      return  h('div',{class:'indent-container'},
          h('div',{class:'indent-container__wrap'},children))
    }
  }
})
</script>

<style lang="scss">

.indent-container {
  width: 100%;
  margin: 0 auto;
  &__wrap{
    margin: 0 20px;
    @media (max-width: 1200px) {
      margin: 0 16px;
      @media (max-width: 920px) {
        margin: 0 16px;
      }
    }
  }
  @media (min-width: 1200px) {
    max-width: 1200px;
  }

}
</style>
