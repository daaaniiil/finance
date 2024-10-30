import {defineStore} from "pinia";
import axios from 'axios'

type TCurrency = 'BYN' | 'RUB' | 'USD'

export const useCurrencyStore = defineStore('currencyStore', {
    state: () => ({
        selectedCurrency: localStorage.getItem('currency')
            ? localStorage.getItem('currency') as TCurrency
            : 'BYN' as TCurrency,
        exchangeRates: {
            BYN: 1,
            RUB: 29.5,
            USD: 3
        }
    }),
    actions: {
        setCurrency(currency: 'BYN' | 'RUB' | 'USD') {
            this.selectedCurrency = currency
            localStorage.setItem('currency', this.selectedCurrency)
        },
        async fetchCurrencyRates() {
            try {
                const response = await axios.get('https://api.nbrb.by/exrates/rates/456')
                this.exchangeRates.RUB = Number(response.data.Cur_OfficialRate.toFixed(1)) / 100

                const responseUSD = await axios.get('https://api.nbrb.by/exrates/rates/431')
                this.exchangeRates.USD = Number(responseUSD.data.Cur_OfficialRate.toFixed(1))
            } catch (e) {
                console.error('Error fetching RUB exchange rate:', e)
            }
        }
    },
    getters: {
        getRate: (state) => {
            return state.exchangeRates[state.selectedCurrency]
        },
        getIcon: (state) => {
            if(state.selectedCurrency === 'BYN') {
                return 'Br'
            } else if(state.selectedCurrency === 'RUB') {
                return '₽'
            } else {
                return '$'
            }
        }
    }
})