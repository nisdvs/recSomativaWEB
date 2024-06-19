<script setup>
import { reactive, ref } from 'vue';
const { signIn } = useAuth();

import { Usuario } from '@/stores/cart';
const novoUser = Usuario()
const { addUser } = novoUser;
definePageMeta({
  layout: 'login'
})

const credenciais = reactive({
  email: '',
  password: ''
});
const mensagemErro = ref('');

const postLogin = () => {
  signIn(credenciais, { redirect: false })
    .then(() => {
      console.log("logado com sucesso....");
      addUser(credenciais.email)
      navigateTo('/');
    })
    .catch((error) => {
      console.error("error: ", error);
      mensagemErro.value = 'Não foi possível fazer o login com estas credenciais...';
      setTimeout(() => {
        mensagemErro.value = '';
        credenciais.email = '';
        credenciais.password = '';
      }, 3000);
    })
}

const painel = ref();
</script>

<template>
    <div class="login-container">
      <div class="login-card">
        <div class="row-login" v-if="mensagemErro !== ''">
          <p id="erro">{{ mensagemErro }}</p>
        </div>
        <h1 class="login-title">Sistema NotaFiscal</h1>
        <h2 class="login-subtitle">Insira as informações e faça login abaixo:</h2>
        <div class="input-group">
          <InputText v-model="credenciais.email" type="email" placeholder="Email" />
        </div>
        <div class="input-group">
          <InputText v-model="credenciais.password" type="password" placeholder="Senha" :feedback="false" />
        </div>
        <div class="button-group">
          <Button @click="postLogin" label="Realizar Login" class="p-button-primary" />
        </div>
      </div>
    </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
  background-color: #e0f7fa; /* Cor de fundo alterada */
}

.login-card {
  width: 500px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.login-title {
  text-align: center;
  margin-bottom: 10px;
  color: #00796b;
}

.login-subtitle {
  text-align: center;
  margin-bottom: 20px;
  color: #004d40; 
  font-size: 12px;
}

.input-group {
  margin-bottom: 15px; 
  margin-left: 24%;
}

.button-group {
  display: flex;
  justify-content: center;
}

#erro {
  color: red;
  text-align: center;
}
</style>
