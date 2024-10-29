import {defineStore} from "pinia";

export const useCurrencyStore = defineStore('currencyStore', {
    state: () => ({
        selectedCurrency: 'BYN' as 'BYN' | 'RUB' | 'USD',
        exchangeRates: {
            BYN: 1,
            RUB: 29.5,
            USD: 0.31
        }
    }),
    actions: {
        setCurrency(currency: 'BYN' | 'RUB' | 'USD') {
            this.selectedCurrency = currency
        }
    },
    getters: {
        getRate: (state) => {
            return state.exchangeRates[state.selectedCurrency]
        }
    }
})