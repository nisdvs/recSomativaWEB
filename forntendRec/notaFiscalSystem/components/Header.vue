<script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const goHome = () => {
    router.push('/');
  };
  
  const goCart = () => {
    router.push('/cart');
  };

  const goPedidos = () => {
    router.push('/pedidos');
  };

  const { signOut } = useAuth();
  const submitLogout = ()=> {
        signOut({redirect: false}).then(()=>{
            console.log("successfully performed the logout");
            limpar()
            navigateTo("/login")
        }).catch((error)=>{
            console.log("error when trying logout ", error);
        })
    }

  const nomeUsuario = ref("-") 
  const emailUsuario = ref("-") 

  import { Usuario } from '@/stores/cart';
  const novoUser = Usuario()
  const { verUser, limpar } = novoUser;
  try {
    nomeUsuario.value = verUser
    emailUsuario.value = verUser

    const { data } = await useFetch('http://localhost:8000/api/auth/custom-users')
    const pesquisa = data.value.results.filter(item => item.email == nomeUsuario.value) 
    nomeUsuario.value = pesquisa[0].name
  } catch (error) {
     navigateTo('/login');
  }
  


  </script>

<template>
  <div>
    <div style="align-items: center; text-align: center;">
      <b style="font-size: 30px;">Olá, </b> <span style="font-size: 30px;">{{ nomeUsuario }}</span>
    </div>
    <div class="navbar">
      <Button label="Início" class="p-button-text" @click="goHome" />
      <Button v-if="emailUsuario != 'funcionario@gmail.com'" label="Carrinho" class="p-button-text" @click="goCart" />
      <Button v-else label="Pedidos" class="p-button-text" @click="goPedidos" />
      <Button label="Sair" class="p-button-text" @click="submitLogout" />
    </div>  
  </div>
  
</template>
  
<style scoped>
  .navbar {
    display: flex;
    justify-content: space-around;
    padding: 1rem;
    background-color: #00796b;
  }
  
  .p-button-text {
    color: white;
    font-weight: bold;
  }
</style>
  