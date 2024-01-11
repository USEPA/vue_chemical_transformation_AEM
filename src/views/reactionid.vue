<template>
    <div>
        <h2> <span v-for="(name,index) in reaction.parent_name"><router-link v-bind:to="'/chemical/'+reaction.parent_dtxsid[index]">{{name}}</router-link><span v-if="index != reaction.parent_name.length - 1"> + </span></span> → <span v-for="(name,index) in reaction.product_name"><router-link v-bind:to="'/chemical/'+reaction.product_dtxsid[index]">{{name}}</router-link><span v-if="index != reaction.product_name.length - 1"> + </span></span></h2>
        <span v-for="(element,index) in reaction.parent_image"> <img v-bind:src="'data:image/png;base64,'+element" alt="missing image" style="width:150px;height:150px;vertical-align:middle;" /><span v-if="index != reaction.parent_image.length - 1"> + </span> </span> → <span v-for="(element,index) in reaction.product_image"> <img v-bind:src="'data:image/png;base64,'+element" alt="missing image" style="width:150px;height:150px;vertical-align:middle;" /><span v-if="index != reaction.product_image.length - 1"> + </span> </span>
        <br>
        <p v-if="reaction.lib_name">Reaction Library: <router-link v-bind:to="'/reaction/searchresults/'+reaction.lib_name+'/reaction_library/false'" style="text-transform: capitalize;">{{reaction.lib_name}}</router-link></p>
        <p v-if="reaction.reaction_process">Reaction Process: <router-link v-bind:to="'/reaction/searchresults/'+reaction.reaction_process+'/reaction_process/false'" style="text-transform: capitalize;">{{reaction.reaction_process}}</router-link></p>
        <p v-if="reaction.reaction_type">Reaction Type: <router-link v-bind:to="'/reaction/searchresults/'+reaction.reaction_type+'/reaction_type/false'" style="text-transform: capitalize;">{{reaction.reaction_type}}</router-link></p>
        <p v-if="reaction.reaction_scheme">Reaction Scheme: <router-link v-bind:to="'/reaction/searchresults/'+reaction.reaction_scheme+'/reaction_scheme/false'" style="text-transform: capitalize;">{{reaction.reaction_scheme}}</router-link></p>
    <!-- displays a grid based on the reaction library that the reaction belongs to -->
    <!-- the grid setup is in the script section -->
        <button v-if="showhide" v-on:click="showhide = !showhide">Hide Reaction Details</button> 
        <button v-if="!showhide" v-on:click="showhide = !showhide">Show Reaction Details</button> &nbsp;
        <button v-if="showhide" v-on:click="handleDownload">Export Reaction Details</button> 
        <br>
        <div v-if="showhide">
            <ag-grid-vue
                class="ag-theme-balham"
                domLayout="autoHeight"
                :columnDefs="columnDefs.value"
                :rowData="rowData.value"
                :enableBrowserTooltips="true"
                @grid-ready="onGridReady">
            </ag-grid-vue>
        </div>
        <!-- only shows the option to add new details or delete the reaction to registered users -->
        <div v-if="this.$cookie.getCookie('user')">
            <router-link v-bind:to="'/reaction/newdetail/'+this.$route.params.reactid"> Add New Reaction Details </router-link>
            <br><br> <button v-on:click="handleDelete">Delete this Reaction</button> 
        </div>
        <br>
        <button v-if="maps_showhide && mapRowData.value.length>0" v-on:click="maps_showhide = !maps_showhide">Hide Map Details</button> 
        <button v-if="!maps_showhide && mapRowData.value.length>0" v-on:click="maps_showhide = !maps_showhide">Show Map Details</button> &nbsp;
        <div v-if="maps_showhide && mapRowData.value.length>0">
            <div> Maps Containing this Reaction: <span v-for="(map,index) in mapdata"><span v-if="index != 0">, </span><router-link v-bind:to="'/reaction/reactionmap/'+map.map_ID+'/mapid'">{{map}}</router-link></span> </div>
            <ag-grid-vue
                class="ag-theme-balham"
                domLayout="autoHeight"
                :columnDefs="mapColDefs.value"
                :rowData="mapRowData.value"
                :enableBrowserTooltips="true"
                @grid-ready="onGridReady">
            </ag-grid-vue>
        </div> <br><br>
        <div v-if="mapID_showhide">
            <inset_map :searchtype="'mapid'" :searchval="selected_map"/>
        </div>
    </div>
</template>

<script>

import {reactive, onMounted} from 'vue'
import {AgGridVue} from 'ag-grid-vue3'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import axios from "axios"
import inset_map from '@/components/inset_map.vue'


export default {
    name: 'reactid',

    components: {
        AgGridVue,
        inset_map,
    },
    
    data () {        
        const rowData = reactive({
            value: [],
        });
        const mapRowData = reactive({
            value: [],
        });
        const columnDefs = reactive({
            value: [],
        });
        const mapColDefs = reactive({
            value: [],
        });
        
        return{
            reaction: '',
            details: '',
            columnDefs,
            mapColDefs,
            rowData,
            mapRowData,
            mapdata:'',
            showhide: true,
            maps_showhide: true,
            mapID_showhide: false,
            selected_map:'',
            colShowHide: true,
        }
    },
    
    computed: {
        url() {
            return this.$apiname + "reaction/" + this.$route.params.reactid
        },
    },
    
    // get the reaction details from the backend
    created: async function(){
        const gResponse = await fetch(this.url, {mode:'cors'});
        const gObject = await gResponse.json();
        this.reaction = gObject[0];
        const liburl = this.$apiname + "reaction/details/" + this.reaction.lib_ID;
        const libResponse = await fetch(liburl, {mode:'cors'});
        const libObject = await libResponse.json();
        this.details = libObject;
        const rowlurl = this.$apiname + "reaction/table/" + this.$route.params.reactid;
        const rowResponse = await fetch(rowlurl, {mode:'cors'})
        const rowObject = await rowResponse.json()
        this.rowData.value = rowObject
        this.columnDefs.value = this.buildcolumns()
        const mapurl = this.$apiname + "reaction/react_maps/" + this.$route.params.reactid;
        const MapRowResponse = await fetch(mapurl, {mode:'cors'})
        const MapRowObject = await MapRowResponse.json()
        this.mapRowData.value = MapRowObject
        this.mapColDefs.value = this.buildMapColumns()
    },

    methods: {
        // sets up the grid
        onGridReady(params) {
            this.gridApi = params.api;
            this.gridColumnApi = params.columnApi;
        },
        // a function for building JSONs for the gird's columns
        buildcolumns(){
            let new_cols = []
            // fixed rows for identifiers and structure image
            for(let key of this.details){
                if(!key.detail_name.toLowerCase().includes('_id') && !key.detail_name.toLowerCase().includes('reference') && !key.detail_name.toLowerCase().includes('doi')){
                    let displayname = ''
                    if(key.units == " "){
                        displayname = key.detail_name
                    } else {
                        displayname = key.detail_name + ' ('+ key.units +')'
                    }
                    let wVal = Math.min(key.detail_name.length*15,200)
                    console.log(key.detail_name,wVal)
                    new_cols.push(
                        {
                            headerName:displayname, field:key.detail_name, sortable: true, resizable: true, filter: 'agTextColumnFilter', floatingFilter: true, width:wVal,
                        }
                    )
                }
            } 
            for(let key of (Object.keys(this.rowData.value[0]))){
                if(key.toLowerCase().includes('reference')){
                    new_cols.push(
                        {
                            headerName:key, 
                            field:key, 
                            sortable: true, 
                            resizable: true, 
                            filter: 'agTextColumnFilter', 
                            floatingFilter: true, 
                            width: 450,
                            // code for adding an extrnal link to a grid column
                            cellRenderer: (params) => {
                                var link = document.createElement('a');
                                if(params.data.DOI != ''){
                                    link.href = 'https://www.doi.org/'+params.data.DOI;
                                };
                                link.target = 'blank_';
                                link.innerText = params.data[key];
                                return link;
                            }
                        }
                    )
                } else if(key.toLowerCase().includes('doi')){
                    new_cols.push(
                        {
                            headerName:key, 
                            field:key, 
                            sortable: true, 
                            resizable: true, 
                            filter: 'agTextColumnFilter', 
                            floatingFilter: true, 
                            width: 100,
                            hide: true,
                        }
                    )
                }
            }
            return new_cols
        },
        // a function for building JSONs for the gird's columns
        buildMapColumns(){
            let new_cols = []
            new_cols.push(
                {
                    headerName:'Map ID', 
                    field:'map_ID', 
                    sortable: true, 
                    resizable: true, 
                    cellRenderer: (params) => {
                            var link = document.createElement('a');
                            if(params.data.map_ID != ''){
                                link.innerText = "Map "+params.data.map_ID;
                                link.href = '#'
                                link.addEventListener("click", e => {
                                    e.preventDefault();
                                    this.mapID_showhide = !this.mapID_showhide;
                                    this.selected_map = String(params.data.map_ID);
                                    console.log(this.selected_map)
                                })
                            } else {
                                link.innerText = "No Map"
                            };
                            return link;
                        },
                    width:100
                },
                {headerName:'Reference', field:'reference', sortable: true, resizable: true, filter: 'agTextColumnFilter', width:600},
            )

            return new_cols
        },
        // code for deleting the reaction from the database
        handleDelete() {
            if (confirm("Are you sure you want to Delete this Reaction?") == true){
                axios
                    // sends the reaction to be deleted to the backend
                    .post(this.$apiname + "reaction/reactiondelete", {
                        reactionID: this.$route.params.reactid,
                    })
                    // redirects the user to the reaction database page
                    .then( this.$router.push('/reaction/database') );
            }
        },
        // code for downloading the reaction details
        async handleDownload() {
            axios
                // send the reaction information to the backend
                .post(this.$apiname + "reaction/reaction_DL", {
                    reactions: [this.reaction],
                    responseType: 'blob',
                })
                // get the file setup by the backend and open a download window
                .then((res) => {
                    let data = res.data;
                    const blob = new Blob([data], { type: 'application/zip' })
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = 'reaction_'+this.$route.params.reactid+'_detail_list_'+Date.now()+'.csv' 
                    link.click()
                });
        },
    },
}

</script>

<style>

.ag-theme-balham{
  --ag-header-foreground-color:Black;
}

</style>