<template>
    <div>
        <h2 :title=chemical.primary_name>{{chemical.primary_name}}</h2>
        <p><router-link v-bind:to="'/reaction/searchresults/'+this.$route.params.chemid+'/ID'">Reactions Containing this Chemical</router-link></p>
        <img v-bind:src="'data:image/png;base64,'+chemical.image" alt="missing image" style="width:150px;height:150px;" />
        <br>
        DTXSID: <a :href="'https://comptox.epa.gov/dashboard/chemical/details/' + chemical.dtxsid" target="_blank"> {{chemical.dtxsid}} ↗ </a>
        <br>
        <button v-on:click="showhide = !showhide">Chemical Identifiers</button> <br>
        <div v-if="showhide">
            SMILES: {{ chemical.smiles }} <br>
            CASRN: {{ chemical.casrn }} <br>
            InChI KEY: {{ chemical.inchi }} <br>
            Synonyms: {{chemical.other_names}} <br>
        </div>
        <div v-if="this.$cookie.getCookie('user')">
            <br> <button v-on:click="handleDelete">Delete this Chemical</button> 
        </div>
    </div>
</template>

<script>

import axios from "axios"

export default{
    name: 'chemid',
    data () {
        return{
            chemical: '',
            showhide: false,
        }
    },
    computed: {
        url() {
            return this.$apiname + "chemicals/" + this.$route.params.chemid
        }
    },
    created: async function(){
        const gResponse = await fetch(this.url);
        const gObject = await gResponse.json();
        this.chemical = gObject[0];
    },
    methods: {
        handleDelete() {
            if (confirm("Are you sure you want to Delete this Chemical?") == true){
                axios
                    .post(this.$apiname + "chemicals/chemdelete", {
                        chemID: this.$route.params.chemid,
                    })
                    .then( this.$router.push('/chemical/database') 
                    );
            }
        },
    },
}

</script>

<style scoped>
h2 {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
</style>