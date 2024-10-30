<template>
  <div class="currency-selector">
    <el-radio-group v-model="selectedCurrency" @change="updateCurrency">
      <el-radio-button value="BYN">
        <el-tag type="success">
          <div>
            <el-image src="/src/assets/img/flag/belarus-flag-icon.png" alt="Беларусь" />
            BYN
          </div>
        </el-tag>
      </el-radio-button>
      <el-radio-button value="RUB">
        <el-tag type="warning">
          <div>
            <el-image src="/src/assets/img/flag/russian-flag-icon.png" alt="Россия" />
            RUB
          </div>
        </el-tag>
      </el-radio-button>
      <el-radio-button value="USD">
        <el-tag type="info">
          <div>
            <el-image src="/src/assets/img/flag/usa-flag-icon.png" alt="США" class="flag-usa" />
            USD
          </div>
        </el-tag>
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {ref, watch} from "vue";
import {useCurrencyStore} from "@/store/currency";

export default defineComponent({
  name: "CurrencySwitcher",
  setup() {
    const currencyStore = useCurrencyStore()
    const selectedCurrency = ref(currencyStore.selectedCurrency)

    const updateCurrency = () => {
      currencyStore.setCurrency(selectedCurrency.value)
    }

    watch(() => selectedCurrency, () => {
      currencyStore.setCurrency(selectedCurrency.value)
    })
    return {
      selectedCurrency,
      updateCurrency
    }
  }
})
</script>

<style lang="scss">
@use '../styles/variable.scss' as *;

.currency-selector {
  margin-top: $padding - 10;
  display: flex;
  gap: 8px;
  align-items: center;

  .el-radio-button.is-active .el-radio-button__original-radio:not(:disabled) + .el-radio-button__inner {
    background-color: #d8ffd7;
    border-color: $color_main_green_2;
    box-shadow: -1px 0 0 0 $color_main_green_2;
  }

  .el-radio-button .el-radio-button__inner {
    padding: $padding - 15;
    margin-right: $padding_main;
    border-radius: $radius_tiny;
    box-shadow: -1px 0 0 0 $color_border_gray;
  }

  .el-tag {
    div {
      display: flex;
      align-items: center;
      flex-direction: row;
    }
  }
  .el-image {
    width: 22px;
    height: 13px;
    margin-right: $padding - 10;
    border-radius: $radius_tiny - 3;
  }
  .flag-usa {
    height: 22px;
  }
}
</style>