<template>
    <form @submit.prevent="login">
        Username: <input type="text" placeholder="Username" v-model="username"/> <br>
        Password: <input type="password" placeholder="Password" v-model="password"/> <br>
        <button type="submit">Submit</button> <br><br>
    </form>
</template>

<script>

import axios from "axios"

export default{
    name: 'login',
    data () {
        return{
            username: '',
            password: '',
            userID: '',
        }
    },
    methods: {
        login() {
            axios
                .post(this.$apiname + "admin/login", {
                    username: this.username,
                    password: this.password,
                })
                .then( response => {this.$cookie.setCookie('user',response.data)} )
                .then( this.$router.push('/') );
        },
    },
}

</script>