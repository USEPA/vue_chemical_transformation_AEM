<template>
    <div>
        <h2> <span v-for="(name,index) in reaction.parent_name"><router-link v-bind:to="'/chemical/'+reaction.parent_dtxsid[index]">{{name}}</router-link><span v-if="index != reaction.parent_name.length - 1"> + </span></span> → <span v-for="(name,index) in reaction.product_name"><router-link v-bind:to="'/chemical/'+reaction.product_dtxsid[index]">{{name}}</router-link><span v-if="index != reaction.product_name.length - 1"> + </span></span></h2>
        <span v-for="(element,index) in reaction.parent_image"> <img v-bind:src="'data:image/png;base64,'+element" alt="missing image" style="width:150px;height:150px;vertical-align:middle;" /><span v-if="index != reaction.parent_image.length - 1"> + </span> </span> → <span v-for="(element,index) in reaction.product_image"> <img v-bind:src="'data:image/png;base64,'+element" alt="missing image" style="width:150px;height:150px;vertical-align:middle;" /><span v-if="index != reaction.product_image.length - 1"> + </span> </span>
        <br>
        <p v-if="reaction.reaction_library">Reaction Library: <router-link v-bind:to="'/reaction/searchresults/'+reaction.reaction_library+'/reaction_library'" style="text-transform: capitalize;">{{reaction.reaction_library}}</router-link></p>
        <p v-if="reaction.reaction_process">Reaction Process: <router-link v-bind:to="'/reaction/searchresults/'+reaction.reaction_process+'/reaction_process'" style="text-transform: capitalize;">{{reaction.reaction_process}}</router-link></p>
        <p v-if="reaction.reaction_type">Reaction Type: <router-link v-bind:to="'/reaction/searchresults/'+reaction.reaction_type+'/reaction_type'" style="text-transform: capitalize;">{{reaction.reaction_type}}</router-link></p>
        <p v-if="reaction.reaction_scheme">Reaction Scheme: <router-link v-bind:to="'/reaction/searchresults/'+reaction.reaction_scheme+'/reaction_scheme'" style="text-transform: capitalize;">{{reaction.reaction_scheme}}</router-link></p>
    <!-- displays a grid based on the reaction library that the reaction belongs to -->
    <!-- the grid setup is in the script section -->
        <button v-on:click="showhide = !showhide">Reaction Details</button> 
        <br>
        <div v-if="showhide && reaction.reaction_library.toLowerCase().includes('hydrolysis')">
            <ag-grid-vue
                class="ag-theme-balham"
                domLayout="autoHeight"
                :columnDefs="columnDefs.value"
                :rowData="rowData.value"
                :enableBrowserTooltips="true">
            </ag-grid-vue>
        </div>
        <div v-if="showhide && reaction.reaction_library.toLowerCase().includes('pfas')">
            <ag-grid-vue
                class="ag-theme-balham"
                domLayout="autoHeight"
                :columnDefs="pfasColDefs.value"
                :rowData="rowData.value"
                :enableBrowserTooltips="true">
            </ag-grid-vue>
        </div>
        <div v-if="showhide && reaction.reaction_library.toLowerCase().includes('metapath')">
            <ag-grid-vue
                class="ag-theme-balham"
                domLayout="autoHeight"
                :columnDefs="metapathColDefs.value"
                :rowData="rowData.value"
                :enableBrowserTooltips="true">
            </ag-grid-vue>
        </div>
        <div v-if="showhide && reaction.reaction_library.toLowerCase().includes('phtolysis')">
            <ag-grid-vue
                class="ag-theme-balham"
                domLayout="autoHeight"
                :columnDefs="photoColDefs.value"
                :rowData="rowData.value"
                :enableBrowserTooltips="true">
            </ag-grid-vue>
        </div>
            
        <br> <button v-on:click="handleDownload">Export Reaction Details</button> 

        <!-- only shows the option to add new details or delete the reaction to registered users -->
        <div v-if="this.$cookie.getCookie('user')">
            <router-link v-bind:to="'/reaction/newdetail/'+this.$route.params.reactid"> Add New Reaction Details </router-link>

            <br><br> <button v-on:click="handleDelete">Delete this Reaction</button> 
        </div>
    </div>
</template>

<script>

import {reactive, onMounted, inject} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {AgGridVue} from 'ag-grid-vue3'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import axios from "axios"


export default {
    name: 'reactid',

    components: {
        AgGridVue,
    },
    
    setup(){
    
        const colShowHide = true

        // this is necessary to access the router during setup
        const routeID = useRoute().params.reactid
        const router = useRouter()
        // this is necessary to access the apiname global variable during setup
        const apiname = inject('apiname')
    
        const detailurl = apiname + "reaction/table/" + useRoute().params.reactid;
        
        const rowData = reactive({
            value: [],
        });
        // Defines the columns for AG Grid
        const columnDefs = reactive({
            value: [
                {headerName:'pH', field:'pH', sortable: true, resizable: true, width:40},
                {headerName:'T (°C)', headerTooltip: 'Temperature', field:'temp_C', sortable: true, resizable: true, width:70},
                {headerName:'Ea (kcal/mol)', headerTooltip: 'Activation Energy', field:'activation_energy', sortable: true, resizable: true, width:100},
                {headerName:'Deg. Rate (days⁻¹)', headerTooltip: 'Degradation Rate', field:'degradation_rate', valueFormatter: params => {if(params.data.degradation_rate+1 == 1){return params.data.degradation_rate} else{return params.data.degradation_rate.toExponential(3)}}, sortable: true, resizable: true, width:130},
                {headerName:'k1 (s⁻¹)', headerTooltip:'1st Order Rate Constant', field:'first_order_rc', valueFormatter: params => {if(params.data.first_order_rc+1 == 1){return params.data.first_order_rc} else{return params.data.first_order_rc.toExponential(3)}}, sortable: true, resizable: true, width:80},
                {headerName:'k2 (mol⁻¹ * s⁻¹)', headerTooltip:'2nd Order Rate Constant', field:'second_order_rc', valueFormatter: params => {if(params.data.second_order_rc+1 == 1){return params.data.second_order_rc} else{return params.data.second_order_rc.toExponential(3)}}, sortable: true, resizable: true, width:110},
                {headerName:'Reaction RC', headerTooltip:'Reaction Rate Constant', field:'reaction_rc', sortable: true, resizable: true, width:110},
                {headerName:'Notes', field:'notes', tooltipField:'notes', sortable: true, resizable: true, width: 230},
                {
                    headerName:'Reference',
                    field:'reference', 
                    tooltipField:'reference', 
                    sortable: true,  
                    resizable: true, 
                    filter: 'agTextColumnFilter', 
                    width:450,
                    // code for adding an extrnal link to a grid column
                    cellRenderer: (params) => {
                        var link = document.createElement('a');
                        if(params.data.DOI != ''){
                            link.href = 'https://www.doi.org/'+params.data.DOI;
                        };
                        link.target = 'blank_';
                        link.innerText = params.data.reference;
                        return link;
                    },
                },
                {
                    headerName:'Delete', 
                    field:'detail_id', 
                    width:100,
                    hide: colShowHide,
                    // code for adding a delete event to a grid column, works but is currently disabled because the column state based on login is not working
                    cellRenderer: (params) => {
                        var link = document.createElement('a');
                        link.href = '#';
                        link.innerText = 'Delete';
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            axios
                                .post(apiname + "reaction/detaildelete", {
                                    reactionID: routeID,
                                    detailID: params.value,
                                });
                            }
                        );
                        return link;
                    },
                }
            ],
        });
        
        const pfasColDefs = reactive({
            value: [
                {headerName:'T (°C)', headerTooltip: 'Temperature', field:'temp_C', sortable: true, resizable: true, width:55},
                {headerName:'Half Life (days)', field:'half_life', valueFormatter: params => {if(params.data.half_life+1 == 1){return params.data.half_life} else{return params.data.half_life.toExponential(3)}}, sortable: true, resizable: true, width:105},
                {headerName:'Reaction System', field:'reaction_system', tooltipField:'reaction_system', sortable: true, resizable: true, width:140},
                {headerName:'Metabolic', headerTooltip: '1 if the record is from a metabolic system', field:'is_metabolic', sortable: true, resizable: true, width:85},
                {headerName:'Environmental', headerTooltip: '1 if the record is from an Environmental system', field:'is_environmental', sortable: true, resizable: true, width:105},
                {headerName:'Notes', field:'notes', tooltipField:'notes', sortable: true, resizable: true, width: 280},
                {
                    headerName:'Reference', 
                    field:'reference', 
                    sortable: true,  
                    resizable: true, 
                    filter: 'agTextColumnFilter', 
                    width: 450,
                    // code for adding an extrnal link to a grid column
                    cellRenderer: (params) => {
                        var link = document.createElement('a');
                        if(params.data.DOI != ''){
                            link.href = 'https://www.doi.org/'+params.data.DOI;
                        };
                        link.target = 'blank_';
                        link.innerText = params.data.reference;
                        return link;
                    }
                },
                {
                    headerName:'Reaction Map', 
                    field:'mapid', 
                    resizable: true, 
                    filter: 'agTextColumnFilter', 
                    width: 150,
                    // code for adding an internal link using the vue router to a grid column
                    cellRenderer: (params) => {
                        var link = document.createElement('a');
                        if(params.data.mapid != ''){
                            link.innerText = "Map "+params.data.mapid;
                            link.href = '#'
                            link.addEventListener("click", e => {
                                e.preventDefault();
                                router.push('/reaction/reactionmap/'+params.data.mapid+'/mapid');
                            })
                        } else {
                            link.innerText = "No Map"
                        };
                        return link;
                    }
                },
                {
                    headerName:'Delete', 
                    field:'detail_id', 
                    hide: colShowHide,
                    // code for adding a delete event to a grid column, works but is currently disabled because the column state based on login is not working
                    cellRenderer: (params) => {
                        var link = document.createElement('a');
                        link.href = '#';
                        link.innerText = 'Delete';
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            if (confirm("Are you sure you want to Delete this Entry?") == true){
                                axios
                                    .post(apiname + "reaction/detaildelete", {
                                        reactionID: routeID,
                                        detailID: params.value,
                                    })
                                    .then( location.reload() );
                            }
                        });
                        return link;
                    }
                }
            ],
        });
        
        const metapathColDefs = reactive({
            value: [
                {headerName:'Species', field:'species', sortable: true, resizable: true, width:200},
                {headerName:'Notes', field:'notes', tooltipField:'notes', sortable: true, resizable: true, width: 280},
                {
                    headerName:'Reference', 
                    field:'reference', 
                    sortable: true,  
                    resizable: true, 
                    filter: 'agTextColumnFilter', 
                    width: 450,
                    // code for adding an extrnal link to a grid column
                    cellRenderer: (params) => {
                        var link = document.createElement('a');
                        if(params.data.DOI != ''){
                            link.href = 'https://www.doi.org/'+params.data.DOI;
                        };
                        link.target = 'blank_';
                        link.innerText = params.data.reference;
                        return link;
                    }
                },
                {
                    headerName:'Reaction Map', 
                    field:'mapid', 
                    resizable: true, 
                    filter: 'agTextColumnFilter', 
                    width: 150,
                    // code for adding an internal link using the vue router to a grid column
                    cellRenderer: (params) => {
                        var link = document.createElement('a');
                        if(params.data.mapid != ''){
                            link.innerText = "Map "+params.data.mapid;
                            link.href = '#'
                            link.addEventListener("click", e => {
                                e.preventDefault();
                                router.push('/reaction/reactionmap/'+params.data.mapid+'/mapid');
                            })
                        } else {
                            link.innerText = "No Map"
                        };
                        return link;
                    }
                },
                {
                    headerName:'Delete', 
                    field:'detail_id', 
                    hide: colShowHide,
                    // code for adding a delete event to a grid column, works but is currently disabled because the column state based on login is not working
                    cellRenderer: (params) => {
                        var link = document.createElement('a');
                        link.href = '#';
                        link.innerText = 'Delete';
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            if (confirm("Are you sure you want to Delete this Entry?") == true){
                                axios
                                    .post(apiname + "reaction/detaildelete", {
                                        reactionID: routeID,
                                        detailID: params.value,
                                    })
                                    .then( location.reload() );
                            }
                        });
                        return link;
                    }
                }
            ],
        });

        const photoColDefs = reactive({
            value: [
                {headerName:'k_pa', headerTooltip: 'k_pa', field:'k_pa', valueFormatter: params => {if(params.data.k_pa+1 == 1){return params.data.k_pa} else{return params.data.k_pa.toExponential(3)}}, sortable: true, resizable: true, width:105},
                {headerName:'half_pa', field:'half_pa', valueFormatter: params => {if(params.data.half_pa+1 == 1){return params.data.half_pa} else{return params.data.half_pa.toExponential(3)}}, sortable: true, resizable: true, width:105},
                {headerName:'alpha', field:'alpha', sortable: true, resizable: true, width:105},
                {headerName:'half_pr', field:'half_pr', valueFormatter: params => {if(params.data.half_pr+1 == 1){return params.data.half_pr} else{return params.data.half_pr.toExponential(3)}}, sortable: true, resizable: true, width:105},
                {headerName:'pH', field:'pH', sortable: true, resizable: true, width:105},
                {headerName:'Light Source', field:'light_source', sortable: true, resizable: true, width:105},
                {headerName:'Notes', field:'notes', tooltipField:'notes', sortable: true, resizable: true, width: 280},
                {
                    headerName:'Reference', 
                    field:'reference', 
                    sortable: true,  
                    resizable: true, 
                    filter: 'agTextColumnFilter', 
                    width: 450,
                    // code for adding an extrnal link to a grid column
                    cellRenderer: (params) => {
                        var link = document.createElement('a');
                        if(params.data.DOI != ''){
                            link.href = 'https://www.doi.org/'+params.data.DOI;
                        };
                        link.target = 'blank_';
                        link.innerText = params.data.reference;
                        return link;
                    }
                },
                {
                    headerName:'Delete', 
                    field:'detail_id', 
                    hide: colShowHide,
                    // code for adding a delete event to a grid column, works but is currently disabled because the column state based on login is not working
                    cellRenderer: (params) => {
                        var link = document.createElement('a');
                        link.href = '#';
                        link.innerText = 'Delete';
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            if (confirm("Are you sure you want to Delete this Entry?") == true){
                                axios
                                    .post(apiname + "reaction/detaildelete", {
                                        reactionID: routeID,
                                        detailID: params.value,
                                    })
                                    .then( location.reload() );
                            }
                        });
                        return link;
                    }
                }
            ],
        });

        
        // function for getting the data for the grid
        onMounted(() => {
            fetch(detailurl)
                .then((result) => result.json())
                .then((remoteRowData) => (rowData.value = remoteRowData))
                .then();
        });
        
        return{
            columnDefs,
            pfasColDefs,
            metapathColDefs,
            photoColDefs,
            rowData,
            detailurl,
        };
    },
    
    data () {
        return{
            reaction: '',
            showhide: true,
        }
    },
    
    computed: {
        url() {
            return this.$apiname + "reaction/" + this.$route.params.reactid
        }
    },
    
    // get the reaction details from the backend
    created: async function(){
        const gResponse = await fetch(this.url);
        const gObject = await gResponse.json();
        this.reaction = gObject[0];
    },
    
    methods: {
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
                .post(this.$apiname + "reaction/detail_DL", {
                    reactionID: this.$route.params.reactid,
                    responseType: 'blob',
                })
                // get the file setup by the backend and open a download window
                .then((res) => {
                    let data = res.data;
                    const blob = new Blob([data], { type: 'application/zip' })
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = 'reaction_'+this.$route.params.reactid+'_detail_list.csv'
                    link.click()
                });
        },
    },
}

</script>

<style>
</style>