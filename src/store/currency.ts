import {defineStore} from "pinia";

type TCurrency = 'BYN' | 'RUB' | 'USD'

export const useCurrencyStore = defineStore('currencyStore', {
    state: () => ({
        selectedCurrency: localStorage.getItem('currency')
            ? localStorage.getItem('currency') as TCurrency
            : 'BYN' as TCurrency,

        exchangeRates: {
            BYN: 1,
            RUB: 29.5,
            USD: 0.31
        }
    }),
    actions: {
        setCurrency(currency: 'BYN' | 'RUB' | 'USD') {
            this.selectedCurrency = currency
            localStorage.setItem('currency', this.selectedCurrency)
        }
    },
    getters: {
        getRate: (state) => {
            return state.exchangeRates[state.selectedCurrency]
        },
        getIcon: (state) => {
            if(state.selectedCurrency === 'BYN') {
                return 'byn'
            } else if(state.selectedCurrency === 'RUB') {
                return '₽'
            } else {
                return '$'
            }
        }
    }
})