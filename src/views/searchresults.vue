<template>
    Filter Results:<br>
    <input style='width:255px' type="text" v-model="searchinput" placeholder="Name, DTXSID, or Reaction Detail" /> <br>
    {{searchinput}}
    <br>
    <br> <button v-on:click="handleDownload">Export Reaction Details</button> 
    <div v-for="row in filteredlist">
        <hr>
        <p><router-link v-bind:to="'/reaction/'+row.reaction_id"><span v-for="(name,index) in row.parent_name">{{name}}<span v-if="index != row.parent_name.length - 1"> + </span></span> → <span v-for="(name,index) in row.product_name">{{name}}<span v-if="index != row.product_name.length - 1"> + </span></span></router-link></p>
        <p><span v-for="(element,index) in row.parent_image"><router-link v-bind:to="'/chemical/'+row.parent_IDnum[index]"><img v-bind:src="'data:image/png;base64,'+element" alt="missing image" style="width:150px;height:150px;vertical-align:middle;" /></router-link><span v-if="index != row.parent_image.length - 1"> + </span> </span> → <span v-for="(element,index) in row.product_image"> <router-link v-bind:to="'/chemical/'+row.product_IDnum[index]"><img v-bind:src="'data:image/png;base64,'+element" alt="missing image" style="width:150px;height:150px;vertical-align:middle;" /></router-link><span v-if="index != row.product_image.length - 1"> + </span> </span></p>
        <p>Reaction Process: <router-link v-bind:to="'/reaction/searchresults/'+row.reaction_process+'/reaction_process'">{{row.reaction_process}}</router-link></p>
        <p>Reaction Type: <router-link v-bind:to="'/reaction/searchresults/'+row.reaction_type+'/reaction_type'">{{row.reaction_type}}</router-link></p>
        <p>Reaction Scheme: <router-link v-bind:to="'/reaction/searchresults/'+row.reaction_scheme+'/reaction_scheme'">{{row.reaction_scheme}}</router-link></p>
    </div>
    <div v-if="!bigout.length">
        <br>
        <p style="font-size:25px">NO RESULTS WERE FOUND</p>
    </div>
</template>

<script>

import {ref} from 'vue'
import axios from "axios"

export default {
    name: 'SearchResults',
    data () {
        const searchinput = ref("");
        const url = this.$apiname + "reaction/search/" + this.$route.params.searchinput + '/' + this.$route.params.searchtype ;

        return {
            bigout: '',
            searchinput,
            url,
        }
    },
    created: async function(){
        const gResponse = await fetch(this.url);
        const gObject = await gResponse.json();
        this.bigout = gObject;
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
                    let data = res.data;
                    const blob = new Blob([data], { type: 'application/zip' })
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = 'CTDB_reaction_list_'+this.$route.params.searchinput+'_'+this.$route.params.searchtype+'.csv'
                    link.click()
                });
        },
    },
}

</script>