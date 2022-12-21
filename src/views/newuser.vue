<template>
    <form @submit.prevent="NewUserSubmit">
        Username: <input type="text" placeholder="Username" v-model="username"/> <br>
        Password: <input type="text" placeholder="Password" v-model="password"/> <br>
        DEV Password: <input type="text" placeholder="" v-model="dev"/> <br>
        <button type="submit">Submit</button> <br><br>
    </form>
</template>

<script>

import axios from "axios"

export default{
    name: 'newUser',
    data () {
        return{
            username: '',
            password: '',
            dev: '',
        }
    },
    methods: {
        // function for submitting a new user
        NewUserSubmit() {
            axios
                // sends the new username, new password, and dev password to the backend
                .post(this.$apiname + "admin/register", {
                    username: this.username,
                    password: this.password,
                    dev: this.dev,
                })
                // redirects the user to the login page
                .then( this.$router.push('/login') );
        },
    },
}

</script>