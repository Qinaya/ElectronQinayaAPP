<template>
    <navBar style="position: sticky; top: 0%; z-index: 2;"></navBar>
    
    <div class="centralCompuDispla" v-if="mirage">
        <div id="container">
            <iframe :src="mirageUrl" :class="fullscreen ? 'compuDisplayFullScreen' : 'compuDisplay' "></iframe>
        </div>
        <br>
        <div :class="fullscreen ? 'controlButtonFullScreen': 'controlButton' ">
            <div class="buttonController">
                <div style="display:flex"> 
                    <!-- <svg-icon :fa-icon="faHouse" :size="25" flip="horizontal" ></svg-icon> -->
                    <svg-icon :fa-icon="faMaximize" :size="25" flip="horizontal" class="buttonDisplay" v-on:click="afullscreen"></svg-icon>
                    <svg-icon :fa-icon="faDoorOpen" :size="25" flip="horizontal" class="buttonDisplay" v-on:click="closeMirage"></svg-icon>
                </div>

            </div>
        </div>
    </div>

    <br>
        <div class="dashboardContainer" v-if="!mirage">
            
            <div class="centralPanel noSelect">
                <div class="titlePanel">
                    <div class="backButton" v-on:click="backMachine"> 
                        <div class="arrowIcon noSelect">
                            &lt;
                        </div>
                    </div>
                    &nbsp;&nbsp;
                    <h1 class="panelTitle"> Compu&nbsp;Panel</h1>
                    &nbsp;&nbsp;
                    <div class="nextButton" v-on:click="nextMachine">
                        <div class="arrowIcon noSelect" >
                            
                            &gt;
                        </div>
                    </div>
                </div>
                <br>
                <h1 style="text-align:center; color: white;" v-if="machines.length == 0">No tienes Compus Asignado</h1>
                <div class="panel" v-if="!machines.length == 0">
                    <br>
                    <h2 class="compuName" v-if="machines[position]">{{ machines[position].nombre_maquina }}</h2>
                    
                    <div class="infoPanel">

                        <div class="panelInfo">
                            <h3 class="titleCompu">
                                Sistema&nbsp;operativo
                            </h3>
                            <div class="descriptionCompu" v-if="machines[position]">
                                {{ machines[position].sistema_operativo }}
                            </div>
                        </div>
    
                        <div class="panelInfo">
                            <h3 class="titleCompu">
                                Plan
                            </h3>
                            <div class="descriptionCompu" v-if="machines[position]">
                                {{ machines[position].plan }}
                            </div>
                        </div>

                        <div class="panelInfo">
                            <h3 class="titleCompu">
                                Tiempo&nbsp;Disponible
                            </h3>
                            <div class="descriptionCompu" v-if="machines[position]">
                                {{ machines[position].tiempo_disponible }}
                            </div>
                        </div>
    
                        <div class="panelInfo">
                            <div class="descriptionCompu">
                                <img alt="Vue logo" src="../../public/linux.png" class="osIcon" />
                            </div>
                        </div>
                    </div>
                    <div id="loader" v-if="mirageActive"></div>
                    <br>
                    <div class="message" v-if="mirageActive">
                        <div v-for="error in errors" id="textMessage">{{ error }}</div>
                    </div>
                    <div class="panelButton" v-on:click="loginMirage" v-if="!mirageActive">
                        <a class="buttonConnect noSelect">
                            Conectar
                        </a>
                    </div>
                    <br>
                </div>
                <br>
                <br>
                <div class="trial" v-if="userTrial">
                    <br>
                    <h2 class="trialName">Tienes Acceso A Una Semana Gratis</h2>
                    <br>

                    <h4 class="trialName">Haz click en COMENZAR PRUEBA y da inicio a</h4>
                    <h4 class="trialName">tu prueba gratis o compra un plan.</h4>
                    <br>
                    <div id="loader" v-if="loading"></div>
                    <div class="message" v-if="!mirageActive">
                        <div v-for="error in errors" id="textMessage">{{ error }}</div>
                    </div>
                    <br>
                    <div class="panelButton" v-on:click="startTrial" v-if="!loading">
                        <a class="buttonConnect noSelect">
                            COMENZAR&nbsp;PRUEBA
                        </a>
                    </div>
                    <br>
                </div>
            </div>
    
    
        </div>


</template>

<script>
import { faHouse, faMaximize, faDoorOpen } from "@fortawesome/free-solid-svg-icons";

import navBar from '@/components/NavBar.vue'
const REST_ENDPOINT = 'https://panel.qinaya.co/api/'
import { useAuthStore } from '../stores/auth'
import axios from "axios";

const authStore = useAuthStore()

export default {
    setup() {
        return {
            faHouse,
            faMaximize,
            faDoorOpen
        }
    },
    data() {
        return {
            machines: [],
            errors:[],
            loading: false,
            position: 0,
            mirageUrl: '',
            mirageActive: false,
            mirage: false,
            fullscreen: false,
            userTrial: false,
        }
    },
    methods: {
        afullscreen() {

            console.log('aaaaa');
            if (document.fullscreenEnabled || 
                document.webkitFullscreenEnabled || 
                document.mozFullScreenEnabled ||
                document.msFullscreenEnabled) {
                
                // which element will be fullscreen
                var iframe = document.querySelector('#container iframe');
                // Do fullscreen
                if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
                } else if (iframe.webkitRequestFullscreen) {
                iframe.webkitRequestFullscreen();
                } else if (iframe.mozRequestFullScreen) {
                iframe.mozRequestFullScreen();
                } else if (iframe.msRequestFullscreen) {
                iframe.msRequestFullscreen();
                }
            }
            else {
                document.querySelector('.error').innerHTML = 'Your browser is not supported';
            }
        },
        closeMirage() {
            this.mirage = false
            this.mirageActive = false
            this.mirageUrl = ''
            const params = new URLSearchParams();
            params.append('compu_id', this.machines[this.position].id);
            axios.post(`${REST_ENDPOINT}mobile.asp?Action=end_session`, params).then((result) => {
                // if (result.data.status == "403") {
                //     authStore.$reset()
                //     this.$router.push('/login')
                //     return;
                // }
                // if (result.data.status == "404") {
                //     return;
                // }
                if (result.data.status == "200") {
                    this.mirage = false
                    this.mirageActive = false
                    this.mirageUrl = ''
                    return;
                }
            });
        },
        loginMirage() {
            this.mirageActive = true;
            const params = new URLSearchParams();
            params.append('user_id', authStore.user.id);
            params.append('compu_id', this.machines[this.position].id);
            params.append('access_token', authStore.token);
            axios.post(`${REST_ENDPOINT}mobile.asp?Action=start_session`, params).then((result) => {
                if (result.data.status == "403") {
                    authStore.$reset()
                    this.$router.push('/login')
                    return;
                }
                if (result.data.status == "404") {
                    return;
                }
                if (result.data.status == "200") {
                    setTimeout(() => this.loading = false, 1000)
                    this.mirageUrl = result.data.href;
                    this.mirage = true;
                    setTimeout(() => this.afullscreen(), 1000)
                    return;
                }
            });
            return;
        },
        startFullScreen() {
            if (this.fullscreen) {
                this.fullscreen = false
            } else {
                this.fullscreen = true
            }
        },
        getMachines() {
            const params = new URLSearchParams();
            params.append('user_id', authStore.user.id);
            params.append('access_token', authStore.token);
            axios.post(`${REST_ENDPOINT}mobile.asp?Action=machines`, params).then((result) => {
                if (result.data.status == "403") {
                    authStore.$reset()
                    this.$router.push('/login')
                    return;
                }
                if (result.data.status == "404") {
                    // localStorage.setItem("token", result.data.token);
                    // this.displayError('El email o la contraseña son incorrectos');
                    return;
                }
                if (result.data.status == "200") {
                    setTimeout(() => this.loading = false, 1000)

                    // console.log(result.data.machines);
                    result.data.machines.forEach(element => {
                        this.machines.push(element.user_machine);
                    });
                    console.log(this.machines);
                    return;
                }
            });
        },
        backMachine() {
            if (this.position > 0) {
                this.position--
            } else if (this.position == 0) {
                this.position = this.machines.length - 1
            }
        },
        nextMachine() {
            console.log(authStore.trial == false, 'a');
            if (this.position < this.machines.length - 1) {
                this.position++
            } else if (this.position == this.machines.length - 1) {
                this.position = 0
            }
        },

        startTrial() {
            this.loading = true
            const params = new URLSearchParams();
            params.append('user_id', authStore.user.id);
            params.append('access_token', authStore.token);
            axios.post(`${REST_ENDPOINT}mobile.asp?Action=trial`, params).then((result) => {
                if (result.data.status == "403") {
                    // localStorage.setItem("token", result.data.token);
                    // this.displayError('El email o la contraseña son incorrectos');
                    return;
                }
                if (result.data.status == "404") {
                    // localStorage.setItem("token", result.data.token);
                    // this.displayError('El email o la contraseña son incorrectos');
                    return;
                }
                if (result.data.status == "401") {
                    // localStorage.setItem("token", result.data.token);
                    this.displayMessage('Ya reclamaste tu prueba gratis');
                    return;
                }
                if (result.data.status == "200") {
                    setTimeout(() => this.loading = false, 1000)
                    authStore.trial = true;
                    this.getMachines();
                }
            });
        },
        displayMessage(errors) {
            setTimeout(() => this.loading = false, 1000)
            setTimeout(() => this.errors.push(errors), 1000)

            // this.errors.push(errors);
            setTimeout(() => this.errors = [], 4000)
            setTimeout(() => this.button = true, 4000)

            return
        },
    },
    components: {
        navBar,
    },
    beforeMount(){
        this.userTrial = authStore.trial == false;
        this.getMachines();
    },
}
</script>

<style>
body {
    margin: 0;            /* Reset default margin */
}

#container {
    display: flex;
    justify-content: center;
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.buttonDisplay {
    cursor: pointer;
}

.buttonDisplay:hover {
    color: #CD1E50;
}
.buttonController {
    display: flex;
    justify-content: space-between;
}
.controlButton {
    z-index: 1;
    padding: 5px;
    width: 10%;
    height: 10%;
}
.centralCompuDispla {
    display: flex;
    margin-top: 20px;
    z-index: 1;
    padding: 5px;

    justify-content: center;
}
.compuDisplay {
    position: absolute;
    margin: 0 auto;
    width: 90%;
    /* border: #CD1E50 solid 4px; */
    height: 90%;
    padding: 5px;
    border-radius: 20px;
}
.compuDisplayFullScreen {
    position: absolute;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    top: 0px; left: 0px;
    z-index: 3;
}

.controlButtonFullScreen {
    position: absolute;
    z-index: 5;
    padding: 5px;
    width: 10%;
    height: 2%;
    top: 0px;
}

#textMessage {
    color: rgb(255, 255, 255);
    font-size: 1.2em;
    text-align: center;
}


#loader {
    border: 5px solid #f3f3f3; /* Light grey */
    border-top: 5px solid #CD1E50; /* Blue */
    margin: 0 auto;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 2s linear infinite;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.noSelect {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.noSelect:focus {
    outline: none !important;
}
.dashboardContainer {
    z-index: 3;
    margin-bottom: 20em;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    overflow: auto;
    width: auto;
    z-index: 1;
}

.centralPanel {
    width: 90%;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    padding: 2%;
    flex-direction: column;
    justify-content: center;
}

.titlePanel {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60%;
    margin: 0 auto;


}

.arrowIcon {
    color: rgb(255, 255, 255);
    text-align: center;
    font-size: 2rem;
    line-height: 21px; /* adjust as needed */
}

.nextButton {
    cursor: pointer;
    transition: box-shadow 600ms cubic-bezier(.33,.11,.02,.99), transform  600ms cubic-bezier(.33,.2,.02,.20);
    background-image: url('../../public/background.png');
    /* background-size: cover; */

    border-radius: 60px;
    padding: 15px;
    width: 20px;
    height: 20px;

}

.nextButton:hover {
    /* transform: scale(1.05) translateY(-0.5rem) rotate(180deg); */
    transform: scale(1.05) translateY(-0.5rem);

}


.backButton {
    cursor: pointer;
    transition: box-shadow 600ms cubic-bezier(.33,.11,.02,.99), transform  600ms cubic-bezier(.33,.2,.02,.20);
    background-image: url('../../public/background.png');
    background-size: cover;
    border-radius: 60px;
    padding: 15px;
    width: 20px;
    height: 20px;

}

.backButton:hover {
    transform: scale(1.05) translateY(-0.5rem);
}
.backButton:focus {
    outline: none !important;
}


.panelTitle {
    background-image: url('../../public/background.png');
    background-size: cover;
    /* background-image: url('../../public/background.png'); */
    color: white;
    width: 500px;
    height: 50px;
    text-align: center;
    overflow: auto;
    border-radius: 20px;
    line-height: 50px; /* adjust as needed */
    font-size: larger;

}

.compuName {
    color: rgb(255, 255, 255);
    margin: 0 auto;
}

.trialName {
    color: rgb(255, 255, 255);
    margin: 0 auto;
}

.panel {
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 20px;
    box-shadow: 0 1rem 2rem hsl(0 0% 0% / 20%);
    overflow: auto;
    width: 50%;
    border-radius: 20px;
    background-image: url('../../public/background.png');
    margin: 0 auto;
}

.trial {
    display: flex;
    justify-content: center;
    flex-direction: column;
    box-shadow: 0 1rem 2rem hsl(0 0% 0% / 20%);
    padding: 20px;

    overflow: auto;
    width: 50%;
    height: auto;
    border-radius: 20px;
    background-color: aqua;
    margin: 0 auto;
    background-image: url('../../public/background.png')
}
.infoPanel {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    padding-top: 20px;
    /* padding-bottom: 20px; */
    justify-items: center;
    border-radius: 10px;


}

.panelInfo {
    padding: 10px;
    margin-bottom: 5px;
    border-radius: 10px;

    margin-top: 5px;
    width: 46%;
}

.panelButton {
    display: flex;
    justify-content: center;

}

.buttonConnect {
    text-align: center;
    padding: 5px;
    color: #fff;
    background-color: rgb(147, 50, 50);
    padding: 1rem 3rem;
    border-radius: 10px;
    box-shadow: 0 4px  4px  rgba(0, 0, 0, .1),
    0 1px  6px  rgba(0, 0, 0, .05),
    0 8px  8px  rgba(0, 0, 0, .1), 
    0 16px 16px rgba(0, 0, 0, .1), 
    8px 32px 32px rgba(0, 0, 0, .15), 
    8px 64px 64px rgba(0, 0, 0, .15);

    cursor: pointer;
    transition: box-shadow 600ms cubic-bezier(.33,.11,.02,.99), transform  600ms cubic-bezier(.33,.11,.02,.99);
}
.buttonConnect:hover {
    box-shadow: 0 4px  4px  rgba(0, 0, 0, .1),
    0 1px  6px  rgba(0, 0, 0, .05),
    0 8px  8px  rgba(0, 0, 0, .1), 
    0 16px 16px rgba(0, 0, 0, .1), 
    8px 32px 32px rgba(0, 0, 0, .15), 
    8px 64px 64px rgba(0, 0, 0, .15); 

    transform: scale(1.05)
    translateY(-0.5rem);
}
.titleCompu {
    text-align: center;
    overflow: auto;
    color: rgb(255, 255, 255);
    margin: 0%;
}
.descriptionCompu {
    text-align: center;
    overflow: auto;
    color: rgb(197, 197, 197);

}

.osIcon {
    width: 80px;
    height: 70px;
}

@media screen and (max-width: 520px) {
    .infoPanel {
        justify-content: center;
        flex-wrap: wrap;
    }
    .panelInfo {
        width: 80%;
    }

    .panel {
        width: 90%;
    }
    .trial {
        width: 90%;
    }
    .titlePanel {
        width: 100%;
        font-size: small;
    }
    .nextButton {
        width: 15px;
        height: 15px;
    }
    .backButton {
        width: 15px;
        height: 15px;
    }
    .arrowIcon {
        font-size: 20px;
        line-height: 12px; /* adjust as needed */
    }
}

@media screen and (max-width: 850px) {
    .panelInfo {
        width: 80%;
    }
}
</style>