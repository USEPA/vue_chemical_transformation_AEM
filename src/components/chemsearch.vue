<template>
    <div>
    <br>
    {{example}}
    <input type="text" v-model="input" placeholder="Name or DTXSID" />
    <br>
    {{input}}
    <br>
    {{filteredlist}}
    </div>
    <br>
</template>

<script>

import {ref} from 'vue';

export default{
    Name: 'Chemsearch',
    data () {
        const input = ref("");
        
        return{
            example: 'Search:',
            chemlist: ['Benzene', 'Benzene II', 'Atrazine', 'Atrazine II', 'Atrazine -1', 'Cyclohexane', 'Cyclohexane II', 'Cyclohexane III'],
            input,
        };
    },
    computed: {
        filteredlist() {
            if (this.input) {
                return this.chemlist.filter((item) => {
                    return this.input
                        .toLowerCase()
                        .split(" ")
                        .every((v) => item.toLowerCase().includes(v));
                });
            } else {
                return this.chemlist
            }
        },
    },
};

</script>

<style>
</style>