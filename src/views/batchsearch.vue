<template>
    <h2>Batch Search</h2>
    <textarea cols="40" rows="10" v-model="input" placeholder="Enter Names, DTXSIDs, CASRNs, and/or InChI keys on separate lines or separated by commas, underscores, or spaces">
    </textarea><br>
    <button @click="$router.push('/reaction/searchresults/' + input.replace(/(?:\r|\n| |,)/g, '_') + '/batch/'+checked)">Search</button> &nbsp;
    Substring Matching: <input type="checkbox" v-model="checked">
</template>

<script>

import {ref} from 'vue'

export default {
    name: 'batchsearch',
    data () {        
        const input = ref("");
        return {
            input,
            checked:true,
        }
    },
}

</script>