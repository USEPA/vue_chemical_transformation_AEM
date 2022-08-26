<template>
    Search: <input type="text" list="typeaheadlist" v-model="input" placeholder="Name, DTXSID, CASRN, inchi key" /> <br>
    <datalist id="typeaheadlist">
        <option v-for="row in bigout" :value="row.dtxsid" :label="row.primary_name"></option>
    </datalist>
    <br>
    <testcomp :filterout='filteredlist'/>
</template>

<script>

import {ref} from 'vue';
import testcomp from '@/components/testcomp.vue'

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