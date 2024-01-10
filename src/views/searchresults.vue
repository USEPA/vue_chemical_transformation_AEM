<template>
    <!-- displays information about number of hits if a batch search is performed -->
    <div v-if="search_type=='batch'">
        {{ filteredlist.length }} reactions returned from {{ searchinfo(filteredlist) }} search terms out of {{ bigout[bigout.length-1] }} searched <br><br>
    </div>
    Filter Results:<br>
    <input style="width:255px" type="text" v-model="searchinput" placeholder="Name, DTXSID, or Reaction Detail" /> <br>
    <br> <button v-on:click="handleDownload">Export Reaction Details</button> <br><br>
    <div v-if="search_type!='batch'">
        {{ filteredlist.length }} Reactions displayed out of {{ bigout.length }} <br>
    </div>
    <div v-if="substring_TF != false">
        Results found using substring matching of primary names and common aliases. <br>
    </div>
    <br>
    <table style="width:100%; border:2px">
        <template v-for="row,index in filteredlist">
            <tr v-if="index % 2 == 0">
                <td v-if="filteredlist[index]" style="max-width:700px; width:50%; border:2px solid black;">                    
                    <span v-if="row.searchterm" style="font-weight: bold">Search Term: {{row.searchterm}}</span><br>
                    <span v-if="row.searchterm" style="font-weight: bold" v-on:mouseover="show_hover($event,row)" v-on:mouseout="showhide = false">Resulting Chemical: {{row.searchchem}}</span>
                    <template v-if="filteredlist[index]['restype'] == 'chemical'">
                        <p style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">Name: <router-link v-bind:to="'/chemical/'+row.dtxsid"> {{row.primary_name}} </router-link> </p>
                        <p><img v-bind:src="'data:image/png;base64,'+row.image" alt="missing image" style="display: block; margin-left: auto; margin-right: auto; width:150px; height:150px;" /> </p>
                        <p>DTXSID: <a :href="'https://comptox.epa.gov/dashboard/chemical/details/' + row.dtxsid" target="_blank"> {{row.dtxsid}} ↗</a></p>
                    </template>
                    <template v-else>
                        <p><router-link v-bind:to="'/reaction/'+row.reaction_ID">
                            <span v-for="(name,n_index) in row.parent_name">{{name}}
                                <span v-if="n_index != row.parent_name.length - 1"> + </span>
                            </span> → 
                            <span v-for="(name,n_index) in row.product_name">{{name}}
                                <span v-if="n_index != row.product_name.length - 1"> + </span>
                            </span></router-link></p>
                        <p><span v-for="(element,e_index) in row.parent_image">
                            <router-link v-bind:to="'/chemical/'+row.parent_dtxsid[e_index]">
                                <img v-bind:src="'data:image/png;base64,'+element" alt="missing image" 
                                :style="{
                                    width: 145 * 4/(Math.max(row.parent_name.length + row.product_name.length,4)) +'px', 
                                    height: 145 * 4/(Math.max(row.parent_name.length + row.product_name.length,4)) +'px'}"  
                                    style="vertical-align:middle;border: 2px solid blue" />
                            </router-link>
                            <span v-if="e_index != row.parent_image.length - 1"> + </span> 
                        </span> → 
                        <span v-for="(element,e_index) in row.product_image"> 
                            <router-link v-bind:to="'/chemical/'+row.product_dtxsid[e_index]">
                                <img v-bind:src="'data:image/png;base64,'+element" alt="missing image" 
                                :style="{
                                    width: 145 * 4/(Math.max(row.parent_name.length + row.product_name.length,4)) +'px', 
                                    height: 145 * 4/(Math.max(row.parent_name.length + row.product_name.length,4)) +'px'}"  
                                style="vertical-align:middle;border: 2px solid blue" />
                            </router-link><span v-if="e_index != row.product_image.length - 1"> + </span> </span></p>
                        <p v-if="row.lib_name">Reaction Library: <router-link v-bind:to="'/reaction/searchresults/'+row.lib_name+'/reaction_library/false'" style="text-transform: capitalize;">{{row.lib_name}}</router-link></p>
                        <p v-if="row.reaction_process">Reaction Process: <router-link v-bind:to="'/reaction/searchresults/'+row.reaction_process+'/reaction_process/false'" style="text-transform: capitalize;">{{row.reaction_process}}</router-link></p>
                        <p v-if="row.reaction_type">Reaction Type: <router-link v-bind:to="'/reaction/searchresults/'+row.reaction_type+'/reaction_type/false'" style="text-transform: capitalize;">{{row.reaction_type}}</router-link></p>
                        <p v-if="row.reaction_scheme">Reaction Scheme: <router-link v-bind:to="'/reaction/searchresults/'+row.reaction_scheme+'/reaction_scheme/false'" style="text-transform: capitalize;">{{row.reaction_scheme}}</router-link></p>
                    </template>
                </td>
                <td v-if="filteredlist[index+1]" style="max-width:700px; width:50%; border:2px solid black;">                    
                    <span v-if="filteredlist[index+1].searchterm" style="font-weight: bold">Search Term: {{filteredlist[index+1].searchterm}}</span><br>
                    <span v-if="filteredlist[index+1].searchterm" style="font-weight: bold" v-on:mouseover="show_hover($event,filteredlist[index+1])" v-on:mouseout="showhide = false">Resulting Chemical: {{filteredlist[index+1].searchchem}}</span>
                    <template v-if="filteredlist[index+1]['restype'] == 'chemical'">
                        <p style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">Name: <router-link v-bind:to="'/chemical/'+filteredlist[index+1].dtxsid"> {{filteredlist[index+1].primary_name}} </router-link> </p>
                        <p><img v-bind:src="'data:image/png;base64,'+filteredlist[index+1].image" alt="missing image" style="display: block; margin-left: auto; margin-right: auto; width:150px; height:150px;" /> </p>
                        <p>DTXSID: <a :href="'https://comptox.epa.gov/dashboard/chemical/details/' + filteredlist[index+1].dtxsid" target="_blank"> {{filteredlist[index+1].dtxsid}} ↗</a></p>
                    </template>
                    <template v-else>
                        <p><router-link v-bind:to="'/reaction/'+filteredlist[index+1].reaction_ID">
                            <span v-for="(name,n_index) in filteredlist[index+1].parent_name">{{name}}
                                <span v-if="n_index != filteredlist[index+1].parent_name.length - 1"> + </span>
                            </span> → 
                            <span v-for="(name,n_index) in filteredlist[index+1].product_name">{{name}}
                                <span v-if="n_index != filteredlist[index+1].product_name.length - 1"> + </span>
                            </span></router-link></p>
                        <p><span v-for="(element,e_index) in filteredlist[index+1].parent_image">
                            <router-link v-bind:to="'/chemical/'+filteredlist[index+1].parent_dtxsid[e_index]">
                                <img v-bind:src="'data:image/png;base64,'+element" alt="missing image" 
                                :style="{
                                    width: 145 * 4/(Math.max(filteredlist[index+1].parent_name.length + filteredlist[index+1].product_name.length,4)) +'px', 
                                    height: 145 * 4/(Math.max(filteredlist[index+1].parent_name.length + filteredlist[index+1].product_name.length,4)) +'px'}"  
                                    style="vertical-align:middle;border: 2px solid blue" />
                                </router-link><span v-if="e_index != filteredlist[index+1].parent_image.length - 1"> + </span> 
                            </span> → 
                            <span v-for="(element,e_index) in filteredlist[index+1].product_image"> 
                                <router-link v-bind:to="'/chemical/'+filteredlist[index+1].product_dtxsid[e_index]">
                                    <img v-bind:src="'data:image/png;base64,'+element" alt="missing image" 
                                    :style="{
                                        width: 145 * 4/(Math.max(filteredlist[index+1].parent_name.length + filteredlist[index+1].product_name.length,4)) +'px', 
                                        height: 145 * 4/(Math.max(filteredlist[index+1].parent_name.length + filteredlist[index+1].product_name.length,4)) +'px'}"  
                                    style="vertical-align:middle;border: 2px solid blue" />
                                </router-link><span v-if="e_index != filteredlist[index+1].product_image.length - 1"> + </span> </span></p>
                        <p v-if="filteredlist[index+1].lib_name">Reaction Library: <router-link v-bind:to="'/reaction/searchresults/'+filteredlist[index+1].lib_name+'/reaction_library/false'" style="text-transform: capitalize;">{{filteredlist[index+1].lib_name}}</router-link></p>
                        <p v-if="filteredlist[index+1].reaction_process">Reaction Process: <router-link v-bind:to="'/reaction/searchresults/'+filteredlist[index+1].reaction_process+'/reaction_process/false'" style="text-transform: capitalize;">{{filteredlist[index+1].reaction_process}}</router-link></p>
                        <p v-if="filteredlist[index+1].reaction_type">Reaction Type: <router-link v-bind:to="'/reaction/searchresults/'+filteredlist[index+1].reaction_type+'/reaction_type/false'" style="text-transform: capitalize;">{{filteredlist[index+1].reaction_type}}</router-link></p>
                        <p v-if="filteredlist[index+1].reaction_scheme">Reaction Scheme: <router-link v-bind:to="'/reaction/searchresults/'+filteredlist[index+1].reaction_scheme+'/reaction_scheme/false'" style="text-transform: capitalize;">{{filteredlist[index+1].reaction_scheme}}</router-link></p>
                    </template>
                </td>
            </tr>
        </template>
    </table>
    <div v-if="!bigout.length & timer">
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
        const url = this.$apiname + "reaction/search/" + this.$route.params.searchinput + '/' + this.$route.params.searchtype + '/' + this.$route.params.substring_TF;
        const search_type = this.$route.params.searchtype
        const substring_TF = this.$route.params.substring_TF

        return {
            bigout: '',
            searchinput,
            search_type,
            substring_TF,
            url,
            showhide:false,
            calcx:0,
            calcy:0,
            calcimg:'',
            calctext:'',
            calcdtxsid:'',
            timer:true,
        }
    },
    // get the results of the search from the backend
    created: async function(){
        const gResponse = await fetch(this.url, {mode:'cors'});
        const gObject = await gResponse.json();
        this.bigout = gObject;
        if(gObject == ''){
            this.timer = false
        }
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
                if (this.search_type=='batch'){
                    return this.bigout.slice(0,-1)
                }
                else{
                    return this.bigout
                }
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
                    link.download = 'CTDB_reaction_list_'+this.$route.params.searchinput+'_'+this.$route.params.searchtype+'_'+Date.now()+'.csv'
                    link.click()
                });
        },

        // code for creating an on-hover popup with information about the searched chemical
        show_hover(event,row) {
            this.showhide = true;
            this.calctext = row.searchchem;
            this.calcimg = row.image;
            this.calcdtxsid = row.dtxsid;
            this.calcx = event.currentTarget.getBoundingClientRect().x+250;
            this.calcy = event.currentTarget.getBoundingClientRect().y+20;
        },

        searchinfo(list) {
            let idlist = []
            for(let row in list){
                idlist.push(list[row].searchterm)
            }
            let idset = new Set(idlist)
            return idset.size
        }
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