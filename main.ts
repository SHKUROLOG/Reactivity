import { computed, reactive } from './reactivity'

const product = reactive({
    price: 2,
    quantity: 5,
})

const total = computed(() => product.price * product.quantity)

const doubleTotal = computed(() => total.value * 2)

console.log('total is ', total.value, 'doubleTotal is:', doubleTotal.value)

product.price = 20
console.log('total is ', total.value, 'doubleTotal is:', doubleTotal.value)

product.quantity = 20
console.log('total is ', total.value, 'doubleTotal is:', doubleTotal.value)

product.quantity = 40
console.log('total is ', total.value, 'doubleTotal is:', doubleTotal.value)
