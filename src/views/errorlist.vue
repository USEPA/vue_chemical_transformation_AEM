<template>
    <br>
    <button v-on:click="showhide = !showhide">Hide/Show Resolved Issues</button>
        <div v-for="row in bigout">
            <!-- show incomplete errors or all errors based on above -->
            <div v-if="showhide || row.completeflag == 0">
                <hr>
                <p>Page: {{row.page}}</p>
                <p>Report: {{row.report}}</p>
                <p>Contact Information: {{row.contact}}</p>
                    <div v-if="row.completeflag == 0">
                        <button v-on:click="resolve(row.id)">Mark as Resolved</button>
                    </div>
                    <div v-if="row.completeflag == 1">
                        <p>RESOLVED</p>
                    </div>
            </div>
    </div>
</template>

<script>

import axios from "axios"

export default {
    name: 'errorlist',
    data () {        
        return {
            bigout: '',
            idnum: '',
            showhide: false,
        }
    },
    // get the error info from the backend
    created: async function(){
        const gResponse = await fetch(this.$apiname + "admin/database", {mode:'cors'});
        const gObject = await gResponse.json();
        this.bigout = gObject;
    },
    methods:{
        // function for marking an issue as resolved
        resolve(id) {
            axios
                // tell the backend to mark the issue as resolved
                .post(this.$apiname + "admin/resolve", {
                    idnum: id,
                })
                // refresh the page
                .then( this.$router.go() );
        },
    }
}

</script>