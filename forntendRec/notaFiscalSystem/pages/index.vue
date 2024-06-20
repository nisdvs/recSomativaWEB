<script setup>
    import { Carrinho } from '@/stores/cart';  
    const cart = Carrinho(); 
    const { addCarrinho } = cart;
    
    import { Usuario } from '@/stores/cart';
    const nomeUsuario = ref("-")
    
    try {
      const novoUser = Usuario()
      const { verUser } = novoUser;
      nomeUsuario.value = verUser

      const { data } = await useFetch('https://recsomativaweb-production.up.railway.app/api/auth/custom-users')
      const pesquisa = data.value.results.filter(item => item.email == nomeUsuario.value) 
      cnpjUsuario.value = pesquisa[0].registrationNumber 
    } catch (error) {
      alert(error)
      // navigateTo('/login');
    }


    definePageMeta({
        middleware: 'auth'
    })
    

    const idNota = ref()
    const dtInicio = ref()
    const dtFinal = ref()
    const CustomCNPJ = ref()
    const dtSelecionada = ref(0)

    const formatDate = (date) => {
      const d = new Date(date)
      return d.toISOString().split('T')[0]
    }

    const apresentarDados = ref()
    const procurarNotas = async () =>{
      if(!idNota.value){
        alert('Preencha todos os campos!')
      } 

      // DATA INICIO
      if(dtSelecionada.value == '1'){
        let dataFormatada = formatDate(dtInicio.value) 
        const { data: dadosNotas } = await useFetch(`https://recsomativaweb-production.up.railway.app/api/auth/invoice?code=${idNota.value}&customCNPJ=${cnpjUsuario.value}&emissionDate_after=${dataFormatada}`);
        apresentarDados.value = dadosNotas.value.results 
      }
      
      // DATA FINAL
      else{
        let dataFormatada = formatDate(dtFinal.value) 
        const { data: dadosNotas } = await useFetch(`https://recsomativaweb-production.up.railway.app/api/auth/invoice?code=${idNota.value}&customCNPJ=${cnpjUsuario.value}&emissionDate_before=${dataFormatada}`);
        apresentarDados.value = dadosNotas.value.results 
      }
    }

    // DIALOG PRODUTOS
    const dialogProdutos = ref(false)
    const apresentarProdutos = ref()

    const openDialogProdutos = async (idNota) =>{
      if(dialogProdutos.value == false){
        dialogProdutos.value = true
        const { data: dadosNotaProdutos } = await useFetch(`https://recsomativaweb-production.up.railway.app/api/auth/invoice-item?invoiceFK=${idNota}`);
        apresentarProdutos.value = dadosNotaProdutos.value.results 
      }else{
        dialogProdutos.value = false 
        return;
      }
    }

    const adicionarAoCarrinho = (produto) =>{
      addCarrinho(produto);
    }
</script>

<template>
    <div> 
      <div class="home-container">
        <h1>Bem-vindo à Página Inicial</h1>
        <br>
        <div class="form-group"> 
            <InputText v-model="idNota" placeholder="Digite o id da Nota" style="margin-right: 20px;"/>
            <!-- <InputText v-model="CustomCNPJ" placeholder="Digite seu CNPJ" style="margin-right: 20px;"/> -->
            <div class="flex flex-wrap gap-4">
                <div class="flex items-center" style="margin-bottom: 10px; margin-top: 10px;">
                    <RadioButton v-model="dtSelecionada" value="1" style="margin-right: 10px;"/>
                    <label for="ingredient1" class="ml-2">Data Início</label>
                </div>
                <div class="flex items-center" style="margin-bottom: 10px">
                    <RadioButton v-model="dtSelecionada" value="2" style="margin-right: 10px;"/>
                    <label for="ingredient2" class="ml-2">Data Final</label>
                </div>
            </div>
            <div v-if="dtSelecionada == '1'">
                <label for="calendar" style="margin-right: 20px;">Selecione uma Data Início</label> 
                <Calendar v-model="dtInicio" dateFormat="yy-mm-dd" showIcon  />
                
            </div>
            <div v-else-if="dtSelecionada == '2'">
                <label for="calendar" style="margin-right: 20px;">Selecione uma Data Final</label> 
                <Calendar v-model="dtFinal" dateFormat="yy-mm-dd" showIcon style="margin-right: 20px;" /> 
            </div>
             
            <div v-if="dtInicio || dtFinal">
                <Button label="Pesquisar" class="p-button-primary" @click="procurarNotas" style="margin-top: 20px;"/>
            </div>
        </div>
      </div>

      <div>
        <h3>Lista de Notas</h3>
        <div>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Customer CNPJ</th>
                <th>Customer Name</th>
                <th>Emission Date</th> 
                <th>Seller Name</th>
                <th>Total Value</th> 
                <th>Produtos</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="nota in apresentarDados" :key="nota">
                <td>{{ nota.code }}</td>
                <td>{{ nota.customerCNPJ }}</td>
                <td>{{ nota.customerName }}</td>
                <td>{{ formatDate(nota.emissionDate) }}</td> 
                <td>{{ nota.sellerName }}</td>
                <td>{{ nota.totalValue }}</td>
                <td><Button icon="pi pi-search" aria-label="Produtos" @click="openDialogProdutos(nota.id)"/></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


      <Dialog :visible="dialogProdutos" modal header="Produtos da Nota" :style="{ width: '50rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Lista de produtos da nota</span>
        <br><br> 
        <div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome do Produto</th>
                <th>Categoria</th> 
                <th>Descrição</th> 
                <th>Imagem</th>
                <th>Carrinho</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="produto in apresentarProdutos" :key="produto">
                <td>{{ produto.id }}</td>
                <td>{{ produto.productFK.name }}</td>
                <td>{{ produto.productFK.categoryFK.name }}</td> 
                <td>{{ produto.productFK.description }}</td>  
                <td><img :src="produto.productFK.image" alt="Imagem do Produto" width="100" /></td>
                <td><Button label="Adicionar ao Carrinho" @click="adicionarAoCarrinho(produto)"></Button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <br><br>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="openDialogProdutos()"></Button> 
        </div>
    </Dialog>
    </div>
    
  </template>
   
  <style scoped>
  .home-container {
    padding: 2rem;
    text-align: center;
  }

  table {
  width: 100%;
  border-collapse: collapse; 
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
}

img {
  max-width: 100px;
  height: auto;
}
  </style>
  