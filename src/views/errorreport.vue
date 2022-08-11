<template>
    <form @submit.prevent="reportSubmit">
        Page: <input type="text" placeholder="page" v-model="page"/> <br>
        What is the Problem?: <input type="text" placeholder="Report" v-model="report"/> <br>
        Contact Email: <input type="text" placeholder="email@domain" v-model="contact"/> <br>
        <button type="submit">Submit</button> <br><br>
    </form>
</template>

<script>

import axios from "axios"

export default{
    name: 'ErrorReport',
    data () {
        return{
            page: this.$router.options.history.state.back,
            report: '',
            contact: '',
        }
    },
    methods: {
        reportSubmit() {
            axios
                .post("http://127.0.0.1:5000/admin/errorreport", {
                    page: this.page,
                    report: this.report,
                    contact: this.contact,
                })
                .then( this.$router.push(this.page) );
        },
    },
}

</script>