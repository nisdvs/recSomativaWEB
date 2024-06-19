<script setup>
  import { ref, onMounted } from 'vue'

  import { Usuario } from '@/stores/cart';
  const nomeUsuario = ref("-")
  
  try {
    const novoUser = Usuario()
    const { verUser } = novoUser;
    nomeUsuario.value = verUser

    const { data } = await useFetch('http://localhost:8000/api/auth/custom-users')
    const pesquisa = data.value.results.filter(item => item.email == nomeUsuario.value) 
    nomeUsuario.value = pesquisa[0].id 
  } catch (error) {
     navigateTo('/login');
  }



  const warranties = ref([])
  
    const { data } = await useFetch('http://localhost:8000/api/auth/warranty')
    warranties.value = data.value.results || [] 
  
    const statusText = (status) => {
        switch (status) {
            case 'P':
            return 'Pendente'
            case 'A':
            return 'Aprovado'
            case 'R':
            return 'Reprovado'
            default:
            return 'Desconhecido'
        }
    }
  const formatDateTime = (dateTime) => {
    const d = new Date(dateTime)
    const date = d.toISOString().split('T')[0]
    const time = d.toTimeString().split(' ')[0]
    return `${date} ${time}`
  }
  
  const approveWarranty = async (id, idAutor, produtos) => {
    try {
        await useFetch(`http://localhost:8000/api/auth/warranty/${id}/`, {
        method: 'PUT',
        body: {
                    status: "A",
                    approverFK: nomeUsuario.value,
                    items: produtos,
                    createdByFK: idAutor
                },
        key: "attGarantia"
        })    

        alert("Aprovado com sucesso")
        const { data } = await useFetch('http://localhost:8000/api/auth/warranty')
        warranties.value = data.value.results || [] 
    } catch (error) {
        alert("Erro ao reprovar")
    }
  }
  
  const disapproveWarranty = async (id, idAutor, produtos) => {
    console.log("AUTOR", idAutor)
    console.log("PRODUTOS", produtos)
    try {
        await useFetch(`http://localhost:8000/api/auth/warranty/${id}/`, {
        method: 'PUT',
        body: {
                    status: "R",
                    approverFK: nomeUsuario.value,
                    items: produtos,
                    createdByFK: idAutor
                },
        key: "attGarantia"
        })    

        alert("Reprovado com sucesso")
        const { data } = await useFetch('http://localhost:8000/api/auth/warranty')
        warranties.value = data.value.results || [] 
    } catch (error) {
        alert("Erro ao reprovar")
    }
  }

  </script>

<template>
    <div class="warranties-container">
      <h1>Lista de Garantias</h1>
      <table v-if="warranties.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Descrição</th>
            <th>Data de Criação</th>
            <th>Criado por</th> 
            <th>Itens</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="warranty in warranties" :key="warranty.id">
            <td>{{ warranty.id }}</td>
            <td>{{ statusText(warranty.status) }}</td>
            <td>{{ warranty.description }}</td>
            <td>{{ formatDateTime(warranty.creationDate) }}</td>
            <td>{{ warranty.createdByFK.name }}</td> 
            <td>
              <ul>
                <li v-for="item in warranty.items" :key="item.id">{{ item }}</li>
              </ul>
            </td>
            <td v-if="warranty.status == 'P'">
              <button @click="approveWarranty(warranty.id, warranty.createdByFK.id, warranty.items)">Aprovar</button>
              <button @click="disapproveWarranty(warranty.id, warranty.createdByFK.id, warranty.items)">Desaprovar</button>
            </td>
            <td v-else>
                OK
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>Nenhuma garantia encontrada.</p>
    </div>
  </template>
  

  
  <style scoped>
  .warranties-container {
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
  
  button {
    margin-right: 0.5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  </style>
  