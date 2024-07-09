<template>
    <div style="font-size:25px">
        CHET Full Reaction List<br><br>
    </div>
    Search: <input style="width:255px" type="text" list="typeaheadlist" v-model="searchinput" placeholder="Name, DTXSID, or Reaction Detail" /> <br>
    <!-- sets up substring filtered search suggestions for DTXSID and Name -->
    <datalist  v-if="searchinput.length > 2" id="typeaheadlist">
        <option v-for="row in chemout" :value="row.dtxsid" :label="row.primary_name"></option>
    </datalist>
    <br>
    <br> <button v-on:click="handleDownload">Export Reaction Details</button><br><br>
    {{ filteredlist.length }} Reactions displayed out of {{ bigout.length }} <br><br>
    <!-- reactions display -->
    <table style="width:100%; border:2px">
        <template v-for="row,index in filteredlist">
            <!-- syntax to set up side by side table -->
            <tr v-if="index % 2 == 0">
                <td v-if="filteredlist[index]" style="width:50%; border:2px solid black;">
                    <p><router-link v-bind:to="'/reaction/'+row.reaction_ID">
                        <span v-for="(name,n_index) in row.parent_name"><span v-if="row.parent_ratio[n_index]">{{row.parent_ratio[n_index]}} * </span>{{name}}
                            <span v-if="n_index != row.parent_name.length - 1"> + </span>
                        </span> → 
                        <span v-for="(name,n_index) in row.product_name"><span v-if="row.product_ratio[n_index]">{{row.product_ratio[n_index]}} * </span>{{name}}
                            <span v-if="n_index != row.product_name.length - 1"> + </span>
                        </span></router-link></p>
                    <p><span v-for="(element,e_index) in row.parent_image">
                        <span style="font-size:25px;vertical-align:middle" v-if="row.parent_ratio[e_index]">{{row.parent_ratio[e_index]}} &nbsp;</span>
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
                        <span style="font-size:25px;vertical-align:middle" v-if="row.product_ratio[e_index]">{{row.product_ratio[e_index]}} &nbsp;</span>
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
                </td>
                <td v-if="filteredlist[index+1]" style="width:50%; border:2px solid black;">
                    <p><router-link v-bind:to="'/reaction/'+filteredlist[index+1].reaction_ID">
                        <span v-for="(name,n_index) in filteredlist[index+1].parent_name"><span v-if="filteredlist[index+1].parent_ratio[n_index]">{{filteredlist[index+1].parent_ratio[n_index]}} * </span>{{name}}
                            <span v-if="n_index != filteredlist[index+1].parent_name.length - 1"> + </span>
                        </span> → 
                        <span v-for="(name,n_index) in filteredlist[index+1].product_name"><span v-if="filteredlist[index+1].product_ratio[n_index]">{{filteredlist[index+1].product_ratio[n_index]}} * </span>{{name}}
                            <span v-if="n_index != filteredlist[index+1].product_name.length - 1"> + </span>
                        </span></router-link></p>
                    <p><span v-for="(element,e_index) in filteredlist[index+1].parent_image">
                        <span style="font-size:25px;vertical-align:middle" v-if="filteredlist[index+1].parent_ratio[e_index]">{{filteredlist[index+1].parent_ratio[e_index]}} &nbsp;</span>
                        <router-link v-bind:to="'/chemical/'+filteredlist[index+1].parent_dtxsid[e_index]">
                            <img v-bind:src="'data:image/png;base64,'+element" alt="missing image" 
                            :style="{
                                width: 145 * 4/(Math.max(filteredlist[index+1].parent_name.length + filteredlist[index+1].product_name.length,4)) +'px', 
                                height: 145 * 4/(Math.max(filteredlist[index+1].parent_name.length + filteredlist[index+1].product_name.length,4)) +'px'}"  
                                style="vertical-align:middle;border: 2px solid blue" />
                            </router-link><span v-if="e_index != filteredlist[index+1].parent_image.length - 1"> + </span> 
                        </span> → 
                        <span v-for="(element,e_index) in filteredlist[index+1].product_image"> 
                            <span style="font-size:25px;vertical-align:middle" v-if="filteredlist[index+1].product_ratio[e_index]">{{filteredlist[index+1].product_ratio[e_index]}} &nbsp;</span>
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
                </td>
            </tr>
        </template>
    </table>
    <div v-if="!bigout.length & timer">
        <!-- if the data have not loaded yet indicates that a search is underway -->
        <br> <p style="font-size:25px">Searching...</p>
    </div>
    <div v-else-if="bigout.length != 0 & filteredlist.length == 0">
        <!-- if the data have loaded but all elements have been filtered out of the list, indicate that there is no match -->
        <br> <p style="font-size:25px">NO MATCHING RESULTS</p>
    </div>
    <div v-else-if="filteredlist.length == 0">
        <!-- if the data have loaded but all elements have been filtered out of the list, indicate that there is no match -->
        <br> <p style="font-size:25px">THE DATABASE COULD NOT BE REACHED</p>
    </div>
</template>

<script>

import {ref} from 'vue'
import axios from "axios"

export default {
    name: 'reactdatabase',
    data () {
        const searchinput = ref("");
        return {
            bigout: '',
            chemout: '',
            searchinput,
            timer:true,
        }
    },
    // gets chemical and reaction database JSON from the backend
    created: async function(){
        try{
            const url = this.$apiname + "reaction/database";
            const gResponse = await fetch(url, {mode:'cors'});
            const gObject = await gResponse.json();
            this.bigout = gObject;
            const url2 = this.$apiname + "chemicals/database";
            const gResponse2 = await fetch(url2, {mode:'cors'});
            const gObject2 = await gResponse2.json();
            this.chemout = gObject2;
        } catch (error){
            this.timer = false
        }
    },
    computed: {
        // function for filtering the database JSON
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
                            || item.synonyms?.toLowerCase().includes(v)
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
                // send the reactions that are displayed to the backend
                .post(this.$apiname + "reaction/reaction_DL", {
                    reactions: this.filteredlist,
                    responseType: 'blob',
                })
                // get the file setup by the backend and open a download window
                .then((res) => {
                    let data = res.data
                    const blob = new Blob([data])
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = 'CTDB_reaction_list_'+this.searchinput+Date.now()+'.csv'
                    link.click()
                });
        },
    },
}
</script>
