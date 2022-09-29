<template>
    Search: <input style='width:255px' type="text" list="typeaheadlist" v-model="searchinput" placeholder="Name, DTXSID, or Reaction Detail" /> <br>
    <datalist id="typeaheadlist">
        <option v-for="row in chemout" :value="row.dtxsid" :label="row.primary_name"></option>
    </datalist>
    {{searchinput}}
    <br>
    <br> <button v-on:click="handleDownload">Export Reaction Details</button> 
    <div v-for="row in filteredlist">
        <hr>
        <p><router-link v-bind:to="'/reaction/'+row.reaction_id"><span v-for="(name,index) in row.parent_name">{{name}}<span v-if="index != row.parent_name.length - 1"> + </span></span> → <span v-for="(name,index) in row.product_name">{{name}}<span v-if="index != row.product_name.length - 1"> + </span></span></router-link></p>
        <p><span v-for="(element,index) in row.parent_image"><router-link v-bind:to="'/chemical/'+row.parent_IDnum[index]"><img v-bind:src="'data:image/png;base64,'+element" alt="missing image" style="width:150px;height:150px;vertical-align:middle;" /></router-link><span v-if="index != row.parent_image.length - 1"> + </span> </span> → <span v-for="(element,index) in row.product_image"> <router-link v-bind:to="'/chemical/'+row.product_IDnum[index]"><img v-bind:src="'data:image/png;base64,'+element" alt="missing image" style="width:150px;height:150px;vertical-align:middle;" /></router-link><span v-if="index != row.product_image.length - 1"> + </span> </span></p>
        <p>Reaction Process: <router-link v-if="row.reaction_process" v-bind:to="'/reaction/searchresults/'+row.reaction_process+'/reaction_process'">{{row.reaction_process}}</router-link></p>
        <p>Reaction Type: <router-link v-if="row.reaction_type" v-bind:to="'/reaction/searchresults/'+row.reaction_type+'/reaction_type'">{{row.reaction_type}}</router-link></p>
        <p>Reaction Scheme: <router-link v-if="row.reaction_scheme" v-bind:to="'/reaction/searchresults/'+row.reaction_scheme+'/reaction_scheme'">{{row.reaction_scheme}}</router-link></p>
    </div>
</template>

<script>

import {ref} from 'vue'
import axios from "axios"

export default {
    name: 'ReactDB',
    data () {
        const searchinput = ref("");

        return {
            bigout: '',
            chemout: '',
            searchinput,
        }
    },
    created: async function(){
        const url = this.$apiname + "reaction/database";
        const gResponse = await fetch(url);
        const gObject = await gResponse.json();
        this.bigout = gObject;
        const url2 = this.$apiname + "chemicals/database";
        const gResponse2 = await fetch(url2);
        const gObject2 = await gResponse2.json();
        this.chemout = gObject2;
    },
    computed: {
        filteredlist() {
            if (this.searchinput) {
                return this.bigout.filter((item) => {
                    return this.searchinput
                        .toLowerCase()
                        .split(" ")
                        .every((v) => 
                            item.parent_name?.join('').toLowerCase().includes(v) 
                            || item.product_name?.join('').toLowerCase().includes(v)
                            || item.parent_dtxsid?.join('').toLowerCase().includes(v)
                            || item.product_dtxsid?.join('').toLowerCase().includes(v)
                            || item.reaction_process?.toLowerCase().includes(v)
                            || item.reaction_type?.toLowerCase().includes(v)
                            || item.reaction_scheme?.toLowerCase().includes(v)
                            );
                });
            } else {
                return this.bigout
            }
        },
    },
    
    methods: {
        async handleDownload() {
            axios
                .post(this.$apiname + "reaction/reaction_DL", {
                    reactions: this.filteredlist,
                    responseType: 'blob',
                })
                .then((res) => {
                    let data = res.data
                    const blob = new Blob([data])
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = 'CTDB_reaction_list_'+this.searchinput+'.csv'
                    link.click()
                });
        },
    },
}

</script>