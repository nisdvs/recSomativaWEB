<script setup>
  import { Carrinho } from '@/stores/cart';
  import { computed } from 'vue';

  definePageMeta({
        middleware: 'auth'
    })
 
    const nomeUsuario = ref("-")

  import { Usuario } from '@/stores/cart';

  try {
    const novoUser = Usuario()
    const { verUser } = novoUser;
    nomeUsuario.value = verUser

    const { data } = await useFetch('https://recsomativaweb-production.up.railway.app/api/auth/custom-users')
    const pesquisa = data.value.results.filter(item => item.email == nomeUsuario.value) 
    nomeUsuario.value = pesquisa[0].id 
  } catch (error) {
     navigateTo('/login');
  }

  const cart = Carrinho();
  const { cartProdutos, cartContar, limparCarrinho } = cart;
 
  const totalValue = computed(() => {
    return cartProdutos.reduce((acc, produto) => acc + produto.price * produto.quantity, 0);
  });
  
  const totalWeight = computed(() => {
    return cartProdutos.reduce((acc, produto) => acc + produto.productFK.weight * produto.quantity, 0);
  });
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const reclamacao = ref()
  const fecharReclamacao = async () => {
    if (totalWeight.value > 15) {
      alert('Peso excedido! Não é possível enviar a reclamação.');
      return;
    }
    try {
        const response = await useFetch(`https://recsomativaweb-production.up.railway.app/api/auth/warranty/`, {
            method: 'POST',
            body: {
                status: 'P',
                description: reclamacao.value,
                createdByFK: nomeUsuario.value,
                items: cartProdutos.map(item => item.id),
            },
            key: 'reclamacaoPost'
        });
 
        if (!response.error.value) { 
            alert('Reclamação enviada com sucesso!');    
        }
    } catch (error) {
        alert('Reclamação com erro!');      
    }
    
  };
</script>
  
<template>
    <div class="cart-container">
      <h1>Carrinho de Produtos com Defeito</h1>
      <br>
      <table v-if="cartProdutos.length">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Preço Unitário</th>
            <th>Subtotal</th>
            <th>Peso Unitário</th>
            <th>Peso Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="produto in cartProdutos" :key="produto.id">
            <td>{{ produto.productFK.name }}</td>
            <td>{{ produto.quantity }}</td>
            <td>{{ formatCurrency(produto.price) }}</td>
            <td>{{ formatCurrency(produto.price * produto.quantity) }}</td>
            <td>{{ produto.productFK.weight }} kg</td>
            <td>{{ (produto.productFK.weight * produto.quantity).toFixed(2) }} kg</td>
          </tr>
        </tbody>
      </table>
      <p v-else>O carrinho está vazio.</p>
      <div class="summary">
        <InputText v-model="reclamacao" placeholder="Reclamação" style="margin-right: 20px;"/>
        <p>Total de Itens: {{ cartContar }}</p>
        <p>Total em Valor: {{ formatCurrency(totalValue) }}</p>
        <p>Total em Peso: {{ totalWeight.toFixed(2) }} kg</p>
      </div>
      <div class="actions" v-if="cartProdutos.length">
        <button @click="limparCarrinho">Limpar Carrinho</button>
        <button :disabled="totalWeight > 15" @click="fecharReclamacao">Fechar Reclamação</button>
      </div>
      <p v-if="totalWeight > 15" class="warning">Peso excedido! O peso total não pode exceder 15 kg.</p>
    </div>
  </template>
  
  <style scoped>
  .cart-container {
    padding: 2rem;
    text-align: center;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  th {
    background-color: #f2f2f2;
    text-align: left;
  }
  
  .summary {
    margin-top: 1rem;
  }
  
  .actions {
    margin-top: 1rem;
  }
  
  button {
    margin-right: 1rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  
  button:disabled {
    cursor: not-allowed;
  }
  
  .warning {
    color: red;
    font-weight: bold;
    margin-top: 1rem;
  }
  </style>
  