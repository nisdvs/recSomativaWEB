import { defineStore } from 'pinia';

export const Usuario = defineStore('user', {
    state: () =>({
        usuario: String,
    }),
    actions: {
        addUser(user){
            this.usuario = user
        },
        limpar(){
            this.usuario = '';
        }

    },
    getters:{
        verUser: (state) => state.usuario
    }
})

export const Carrinho = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  actions: {
    addCarrinho(item) {
      this.items.push(item);
    }, 
    limparCarrinho() {
      this.items = [];
    },
  },
  getters: {
    cartProdutos: (state) => state.items,
    cartContar: (state) => state.items.length,
  },
});