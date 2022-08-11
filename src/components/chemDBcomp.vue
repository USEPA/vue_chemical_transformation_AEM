<template>
    Search: <input type="text" v-model="input" placeholder="Name, DTXSID, CASRN, inchi key" /> <br>
    <br>
    <div v-for="row in filteredlist">
        <hr>
        <p>Name: <router-link v-bind:to="'/chemical/'+row.local_IDnum"> {{row.primary_name}} </router-link> </p>
        <p>DTXSID: <a :href="'https://comptox.epa.gov/dashboard/chemical/details/' + row.dtxsid" target="_blank"> {{row.dtxsid}} </a></p>
        <p><img v-bind:src="'data:image/png;base64,'+row.image" alt="missing image" style="width:150px;height:150px;" /> </p>
    </div>
</template>

<script>

import {ref} from 'vue';

export default {
    name: 'ChemDB',
    data () {        
        const input = ref("");
        return {
            bigout: '',
            input,
        }
    },
    created: async function(){
        const url = this.$apiname + "chemicals/database";
        const gResponse = await fetch(url);
        const gObject = await gResponse.json();
        this.bigout = gObject;
    },
    computed: {
        filteredlist() {
            if (this.input) {
                return this.bigout.filter((item) => {
                    return this.input
                        .toLowerCase()
                        .split(" ")
                        .every((v) => 
                            item.primary_name?.toLowerCase().includes(v)
                            || item.dtxsid?.toLowerCase().includes(v)
                            || item.inchi?.toLowerCase().includes(v)
                            || item.casrn?.toLowerCase().includes(v));
                });
            } else {
                return this.bigout
            }
        },
    },
}

</script>