<template>
        <div class="form">
            <div class="card-form">
                <div class="logo">
                    <img alt="Vue logo" class="logo" src="../../public/76071610766530234.png"  />
                </div>
                <br>
                <div class="title" v-if="register">Nombre </div>
                <div class="content" v-if="register">
                    <input class="textInput" type="text" v-model="name" placeholder="Nombre" />
                </div>
                <div class="title">Email</div>
                <div class="content">
                    <input class="textInput" type="text" v-model="email" placeholder="Email" />
                </div>
                <div class="title">Password</div>
                <div class="content">
                    <input class="textInput" type="password" v-model="password" placeholder="Password" />
                </div>
                <br>
                <div>

                    <div class="loader" v-if="loading"></div>
                </div>

                <p v-if="errors.length">
                    <b>Mensaje:</b>
                    <ul style="margin: 0%;">
                        <li v-for="error in errors" class="error">{{ error }}</li>
                    </ul>
                </p>
                <div class="buttonCon" @click="login" v-if="button">
                    <button class="button" type="submit"> Enviar </button>
                </div>
                <div class="buttonContent" @click="activeRegister" v-if="button">
                    <button class="button" style="background-color: #FCB813"> {{this.registerText}} </button>

                </div>
            </div>


        </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from '../stores/auth'
const authStore = useAuthStore()

const REST_ENDPOINT = 'https://panel.qinaya.co/api/'
export default {
    name: 'LoginView',
    data() {
        return {
            errors:[],
            name: '',
            email: '',
            password: '',
            registerText: 'Registrate',
            loading: false,
            button: true,
            register: false,

        }
    },
    methods: {
        activeRegister() {
            if (this.register == false) {
                this.registerText = 'Inicia sesion'
                this.register = true
            } else {
                this.registerText = 'Registrate'
                this.register = false
            }
        },
        validateEmail() {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
                return false;
            } else {
                return true;
            }
        },
        displayError(errors) {
            setTimeout(() => this.loading = false, 1000)

            setTimeout(() => this.errors.push(errors), 1000)

            // this.errors.push(errors);
            setTimeout(() => this.errors = [], 4000)
            setTimeout(() => this.button = true, 4000)

            return
        },
        login() {
            this.button = false;
            this.errors = [];
            this.loading = true
            
            if (this.register == false) {

                // Aca se inicia sesion
                if (!this.email) {
                    this.displayError('El email es obligatorio');
                    return;
                        
                }
                if (!this.password) {
                    this.displayError('La contraseña es obligatoria');
                    return;
                }
                if (this.validateEmail()) {
                    this.displayError('El email es invalido');
                    return;
                }
    
                const params = new URLSearchParams();
                params.append('email', this.email);
                params.append('password', this.password);
                axios.post(`${REST_ENDPOINT}mobile.asp?Action=authenticate`, params).then((result) => {
                    if (result.data.status == "403") {
                        // localStorage.setItem("token", result.data.token);
                        this.displayError('El email o la contraseña son incorrectos');
                        return;
                    }
                    if (result.data.status == "401") {
                        // localStorage.setItem("token", result.data.token);
                        this.displayError('Contraseña incorrecta');
                        return;
                    }
                    if (result.data.status == "404") {
                        // localStorage.setItem("token", result.data.token);
                        this.displayError('El email o la contraseña son incorrectos');
                        return;
                    }
                    if (result.data.status == "200") {
                        setTimeout(() => this.loading = false, 1000)

                        authStore.token = result.data.access_token;
                        authStore.user.id = result.data.user.id;
                        authStore.user.email = result.data.user.email;
                        authStore.user.name = result.data.user.name;
                        authStore.trial = result.data.have_trial;
                        this.$router.push('dashboard');
    
                        return;
                    }
                });
            } else {
                // Boton de registro de cuenta
                if (!this.name) {
                    this.displayError('El nombre es obligatorio');
                    return;
                        
                }
                if (!this.email) {
                    this.displayError('El email es obligatorio');
                    return;
                        
                }
                if (!this.password) {
                    this.displayError('La contraseña es obligatoria');
                    return;
                }
                if (this.validateEmail()) {
                    this.displayError('El email es invalido');
                    return;
                }

                const params = new URLSearchParams();
                params.append('name', this.name);
                params.append('email', this.email);
                params.append('password', this.password);

                axios.post(`${REST_ENDPOINT}mobile.asp?Action=register`, params).then((result) => {
                    if (result.data.status == "400") {
                        // localStorage.setItem("token", result.data.token);
                        this.displayError('Faltan datos por completar');
                        return;
                    }
                    if (result.data.status == "200") {
                        setTimeout(() => this.loading = false, 1000)
                        this.displayError('¡Cuenta creada con exito!');
                        setTimeout(() => this.register = false, 2000)


                        return;
                    }
                });
            }
        }
    }
}
</script>

<style>
body {
    background-image: url('../../public/background.png');
    background-repeat: no-repeat;
    background-size: cover;

}
.form {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.logo {
    display: flex;
    width: 15em;
    justify-content: center;
}

.card-form {
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* background-image: url('../../public/background.png'); */
    align-items:center;
    margin-top: 9%;    
    width: 40%;
    height: 30em;
    color: white;
    padding: 20px;
    overflow: hidden;
    border-radius: 20px;
}

.content {
    display: flex;
    padding: 1%;
    justify-content: center;
    text-align: left;
    font-size: large;
    font-weight: 400;
    width: 90%;
}
.buttonContent {
    margin-top: 10px;
}
.title {
    text-align: left;
    font-size: 20px;

}
.error {
    color: #ffffff;
    font-weight: bold;
    font-size: 20px;
}
.button {
    background-color: #CD1E50;
    border: none;
    color: white;
    /* padding: 15px 60px; */

    text-align: center;
    text-decoration: none;
    width: 12em;
    height: 3em;
    display: inline-block;
    font-size: 16px;
    margin: 2px 2px;
    border-radius: 10px;
    cursor: pointer;
    transition: box-shadow 600ms cubic-bezier(.33,.11,.02,.99), transform  600ms cubic-bezier(.33,.11,.02,.99);

}
.button:hover {
    background-color: #000000;
    color: white;

    transform: scale(1.05)
    translateY(-0.5rem);
}
.button:active {
    background-color: #000000;
    color: white;
    transform: scale(1.1);
}
.textInput {
    height: 35px;
    width: 15em;

    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 1%;
    text-align: center;
    font-size: large;
    font-weight: 400;
}


.loader {
    border: 5px solid #f3f3f3; /* Light grey */
    border-top: 5px solid #CD1E50; /* Blue */
    border-radius: 50%;
    margin: 3%;
    width: 20px;
    height: 20px;
    animation: spin 2s linear infinite;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@media screen and (max-width: 520px) {
    .card-form {
        width: 70%;
    }
    .logo {
        width: 90%;
    }
}

/* @media screen and (max-width: 770px) {
    .textInput {
        height: 40px;


    }
} */
</style>