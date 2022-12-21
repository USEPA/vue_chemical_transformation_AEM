<template>
    <form @submit.prevent="login">
        Username: <input type="text" placeholder="Username" v-model="username" style="position:relative; left:6px"/> <br>
        Password: <input type="password" placeholder="Password" v-model="password" style="position:relative; left:10px"/> <br>
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
            page: this.$router.options.history.state.back,
        }
    },
    methods: {
        // function for logging in to access developer tools
        login() {
            axios
                // send credentials to the backend
                .post(this.$apiname + "admin/login", {
                    username: this.username,
                    password: this.password,
                })
                // if a user is sent back, sets a cookie to designate that the user is logged in, placeholder system
                .then( response => {this.$cookie.setCookie('user',response.data)} )
                // return the user to the page they came from
                .then( this.$router.push(this.page) );
        },
    },
}

</script>