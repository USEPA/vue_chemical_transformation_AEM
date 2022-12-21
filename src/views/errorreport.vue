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
            // get a default page for the error report form
            // assumes the user navigated to this page from the page with an issue using the report link in the header
            page: this.$router.options.history.state.back,
            backpage: this.$router.options.history.state.back,
            report: '',
            contact: '',
        }
    },
    methods: {
        // function for submitting the report to the backend
        reportSubmit() {
            axios
                // submits the report info to the backend
                .post(this.$apiname + "admin/errorreport", {
                    page: this.page,
                    report: this.report,
                    contact: this.contact,
                })
                // returns the user to the page they navigated from, even if they have changed the reported page
                .then( this.$router.push(this.backpage) );
        },
    },
}

</script>