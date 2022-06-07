<template>
    <nav class="navbar">
        <div class="contentBar">
            <div class="menuLogo">
                <a href="{{ route('/') }}">
                    <img alt="Vue logo" src="../../public/test.png" class="logoQinaya" />
                </a>
            </div>
            
            <div class="navMenu noSelect" v-on:click="dropdownVisilibity == false ? dropdownVisilibity = true : dropdownVisilibity = false" ref="dropdownMenu">

                <div class="userProfile">
                    <div>
                        <svg-icon :fa-icon="faUser" :size="25" flip="horizontal" style="color: white;" ></svg-icon>
                    </div>
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    <div>
                        <span class="icon">Bienvenido </span>
                        <span class="icon">{{username}}</span>
                    </div>
                    &nbsp;
                    &nbsp;
                    &nbsp;
                </div>
            </div>
        </div>
        <div class="dropdownSection">
            <div class="dropdown" v-if="dropdownVisilibity">
                <div class="dropdownDivision" v-on:click="logOut">
                    <div>Log Out</div>
                </div>
    
            </div>
        </div>
        <div class="menuBar">
            <div class="barResponsive" v-on:click="logOut" v-if="dropdownVisilibity">
                <h2>Log Out</h2>
            </div>
            
        </div>
    </nav>
</template>

<script>
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

export default {
    setup() {
        return {
            faUser,
        }
    },
    data() {
        var user_name = authStore.user.name
        return {
            dropdownVisilibity: false,
            username: user_name,
        }
    },
    methods:{

        documentClick(e){
            let el = this.$refs.dropdownMenu
            let target = e.target
            if ((  el !== target) && !el.contains(target)) {
                this.dropdownVisilibity=false
                }
        },
        logOut() {
            authStore.$reset()
            document.removeEventListener('click', this.documentClick)
            this.$router.push('/')

        },
    },
    created () {
        document.addEventListener('click', this.documentClick)
    },
    // destroyed () {
    //     document.removeEventListener('click', this.documentClick)
    // },
}


</script>

<style>
.logoQinaya {
    width: 16em;
    height: auto;

}
.contentBar {
    background-image: url('../../public/background.png');

    display: flex;
    justify-content: space-between;
    align-items: center;
    justify-items: center;
    padding: 20px;
    color: white;
    padding-right: 0px;
    height: 35px;
    /* background: rgb(255, 255, 255); */
    background-size: cover;
    border-radius: 10px;
    box-shadow: 0px 40px 40px rgba(0, 0, 0, 0.347);
}
.userProfile {
    display: flex;
    align-items: center;
    justify-items: center;
    justify-content: space-between;
    padding: 1%;
    cursor: pointer;
}

.barResponsive {
    display: flex;
    justify-content: center;
    background-color: #CD1E50;
}

.barResponsive:hover {
    background: #f5f5f5;
}

.dropdown {
    margin-top: 2px;
    display: inline-block;
    align-items: center;
    flex-direction: column;
    width: 200px;
    position: absolute;
    border-radius: 5px;
    
    background-image: url('../../public/background.png');


    padding: 10px;
    margin-right: 2em;
}

.dropdownSection {
    width: 100%;
    display: flex;
    justify-content: flex-end;
}
.dropdownDivision {
    
    padding-top: 5%;
    padding-bottom: 5%;
    cursor: pointer;
    background: #CD1E50;
    color: white;
    padding-left: 4%;
    border-radius: 3px;


}

.menuBar {
    text-align: center;
    padding: 5px;
    display: none;
}

.dropdownDivision:hover {
    background-color: #fc2864;
    border-radius: 5px;
    color: white;

}

@media screen and (max-width: 520px) {
    .icon {
        display: none;
    }
    .dropdown {
        display: none;
    }
    .menuBar {
        display: block;
    }
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
</style>