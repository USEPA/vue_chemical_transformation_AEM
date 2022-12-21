<template>
    Filter Results:<br>
    <input style="width:255px" type="text" v-model="searchinput" placeholder="Name, DTXSID, or Reaction Detail" /> <br>
    <br> <button v-on:click="handleDownload">Export Reaction Details</button> 
    <div v-for="row in filteredlist">
        <hr>
        <span v-if="row.searchterm" style="font-weight: bold">Search Term: {{row.searchterm}}</span><br>
        <span v-if="row.searchterm" style="font-weight: bold" v-on:mouseover="show_hover($event,row)" v-on:mouseout="showhide = false">Resulting Chemical: {{row.searchchem}}</span>
        <p><router-link v-bind:to="'/reaction/'+row.reaction_id"><span v-for="(name,index) in row.parent_name">{{name}}<span v-if="index != row.parent_name.length - 1"> + </span></span> → <span v-for="(name,index) in row.product_name">{{name}}<span v-if="index != row.product_name.length - 1"> + </span></span></router-link></p>
        <p><span v-for="(element,index) in row.parent_image"><router-link v-bind:to="'/chemical/'+row.parent_IDnum[index]"><img v-bind:src="'data:image/png;base64,'+element" alt="missing image" style="width:150px;height:150px;vertical-align:middle;" /></router-link><span v-if="index != row.parent_image.length - 1"> + </span> </span> → <span v-for="(element,index) in row.product_image"> <router-link v-bind:to="'/chemical/'+row.product_IDnum[index]"><img v-bind:src="'data:image/png;base64,'+element" alt="missing image" style="width:150px;height:150px;vertical-align:middle;" /></router-link><span v-if="index != row.product_image.length - 1"> + </span> </span></p>
        <p v-if="row.reaction_process">Reaction Process: <router-link v-bind:to="'/reaction/searchresults/'+row.reaction_process+'/reaction_process'">{{row.reaction_process}}</router-link></p>
        <p v-if="row.reaction_type">Reaction Type: <router-link v-bind:to="'/reaction/searchresults/'+row.reaction_type+'/reaction_type'">{{row.reaction_type}}</router-link></p>
        <p v-if="row.reaction_scheme">Reaction Scheme: <router-link v-bind:to="'/reaction/searchresults/'+row.reaction_scheme+'/reaction_scheme'">{{row.reaction_scheme}}</router-link></p>
    </div>
    <div v-if="!bigout.length">
        <!-- if the data have not loaded yet indicates that a search is underway -->
        <br> <p style="font-size:25px">Searching...</p>
    </div>
    <div v-else-if="filteredlist.length == 0">
        <!-- if the data have loaded but all elements have been filtered out of the list, indicate that there is no match -->
        <br> <p style="font-size:25px">NO RESULTS WERE FOUND</p>
    </div>
    <span v-if="showhide" class="hoverinfo" v-bind:style="{ position:'fixed', left:calcx+'px', top:calcy+'px'}">
        <img v-bind:src="'data:image/png;base64,'+calcimg" alt="missing image" style="width:150px;height:150px;vertical-align:middle;" />
        <br>{{calctext}}
        <br>{{calcdtxsid}}
    </span>
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
            showhide:false,
            calcx:0,
            calcy:0,
            calcimg:'',
            calctext:'',
            calcdtxsid:'',
        }
    },
    // get the results of the search from the backend
    created: async function(){
        const gResponse = await fetch(this.url);
        const gObject = await gResponse.json();
        this.bigout = gObject;
    },
    computed: {
        // function for filtering the results of the search
        filteredlist() {
            if (this.searchinput) {
                return this.bigout.filter((item) => {
                    // substring match, split multiple search terms, check if searchable fields have a match
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
                // don't filter if there's no input
                return this.bigout
            }
        },
    },
    methods: {
        // code for exporting the filtered contents of the database
        async handleDownload() {
            axios
                // send the content info to the backend
                .post(this.$apiname + "reaction/reaction_DL", {
                    reactions: this.filteredlist,
                    responseType: 'blob',
                })
                // get the file setup by the backend and open a download window
                .then((res) => {
                    let data = res.data;
                    const blob = new Blob([data], { type: 'application/zip' })
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = 'CTDB_reaction_list_'+this.$route.params.searchinput+'_'+this.$route.params.searchtype+'.csv'
                    link.click()
                });
        },
        show_hover(event,row) {
            this.showhide = true;
            this.calctext = row.searchchem;
            this.calcimg = row.image;
            this.calcdtxsid = row.dtxsid;
            this.calcx = event.currentTarget.getBoundingClientRect().x+250;
            this.calcy = event.currentTarget.getBoundingClientRect().y+20;
        },
    },
}

</script>

<style>

.hoverinfo{
    position:absolute;
    text-align: center;
    border: 2px solid black;
    background-color: white;
}

</style>