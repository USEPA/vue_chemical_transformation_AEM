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
    Name: 'ReactSearch',
    data () {
        const input = ref("");
        
        return{
            example: 'Search:',
            reactionlist: ['Benzene → Cyclohexane', 'Cyclohexane → Benzene', 'Atrazine → Benzene', 'Atrazine → Pyrimidine'],
            input,
        };
    },
    computed: {
        filteredlist() {
            if (this.input) {
                return this.reactionlist.filter((item) => {
                    return this.input
                        .toLowerCase()
                        .split(" ")
                        .every((v) => item.toLowerCase().includes(v));
                });
            } else {
                return this.reactionlist
            }
        },
    },
};

</script>

<style>
</style>