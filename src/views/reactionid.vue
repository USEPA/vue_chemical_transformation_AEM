<template>
    <div>
        <h2> <span v-for="(name,index) in reaction.parent_name"><router-link v-bind:to="'/chemical/'+reaction.parent_IDnum[index]">{{name}}</router-link><span v-if="index != reaction.parent_name.length - 1"> + </span></span> → <span v-for="(name,index) in reaction.product_name"><router-link v-bind:to="'/chemical/'+reaction.product_IDnum[index]">{{name}}</router-link><span v-if="index != reaction.product_name.length - 1"> + </span></span></h2>
        <span v-for="(element,index) in reaction.parent_image"> <img v-bind:src="'data:image/png;base64,'+element" alt="missing image" style="width:150px;height:150px;vertical-align:middle;" /><span v-if="index != reaction.parent_image.length - 1"> + </span> </span> → <span v-for="(element,index) in reaction.product_image"> <img v-bind:src="'data:image/png;base64,'+element" alt="missing image" style="width:150px;height:150px;vertical-align:middle;" /><span v-if="index != reaction.product_image.length - 1"> + </span> </span>
        <br>
        <p>Reaction Process: <router-link v-bind:to="'/reaction/searchresults/'+reaction.reaction_process">{{reaction.reaction_process}}</router-link></p>
        <p>Reaction Type: <router-link v-bind:to="'/reaction/searchresults/'+reaction.reaction_type">{{reaction.reaction_type}}</router-link></p>
        <p>Reaction Scheme: <router-link v-bind:to="'/reaction/searchresults/'+reaction.reaction_scheme">{{reaction.reaction_scheme}}</router-link></p>
    <button v-on:click="showhide = !showhide">Reaction Details</button> 
        <br>
        <div v-if="showhide && reaction.reaction_process.toLowerCase().includes('hydrolysis')">
            <ag-grid-vue
                class="ag-theme-balham-dark"
                domLayout="autoHeight"
                :columnDefs="columnDefs.value"
                :rowData="rowData.value"
                :enableBrowserTooltips="true">
            </ag-grid-vue>
        </div>
        <div v-if="showhide && reaction.reaction_process.toLowerCase().includes('pfas')">
            <ag-grid-vue
                class="ag-theme-balham-dark"
                domLayout="autoHeight"
                :columnDefs="pfasColDefs.value"
                :rowData="rowData.value"
                :enableBrowserTooltips="true">
            </ag-grid-vue>
        </div>
        <div v-if="this.$cookie.getCookie('user')">
            <router-link v-bind:to="'/reaction/newdetail/'+this.$route.params.reactid"> Add New Reaction Details </router-link>
            <br> <button v-on:click="handleDelete">Delete this Reaction</button> 
        </div>
    </div>
</template>

<script>

import {reactive, onMounted, inject} from 'vue'
import { useRoute } from 'vue-router'
import {AgGridVue} from 'ag-grid-vue3'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css'
import axios from "axios"


export default {
    name: 'reactid',

    components: {
        AgGridVue,
    },
    
    setup(){
    
        const colShowHide = false

        const routeID = useRoute().params.reactid
        const apiname = inject('apiname')
    
        const detailurl = apiname + "reaction/table/" + useRoute().params.reactid;
        
        const rowData = reactive({
            value: [],
        });
        
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
                {headerName:'Reference', field:'reference', tooltipField:'reference', sortable: true,  resizable: true, filter: 'agTextColumnFilter', width:450},
                {
                    headerName:'Delete', 
                    field:'detail_id', 
                    width:100,
                    hide: colShowHide,
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
                    }
                }
            ],
        });
        
        const pfasColDefs = reactive({
            value: [
                {headerName:'T (°C)', headerTooltip: 'Temperature', field:'temp_C', sortable: true, resizable: true, width:115},
                {headerName:'Half Life (days)', field:'half_life', valueFormatter: params => {if(params.data.half_life+1 == 1){return params.data.half_life} else{return params.data.half_life.toExponential(3)}}, sortable: true, resizable: true, width:85},
                {headerName:'Reaction System', field:'reaction_system', sortable: true, resizable: true, width:115},
                {headerName:'Metabolic', field:'is_metabolic', sortable: true, resizable: true, width:85},
                {headerName:'Environmental', field:'is_environmental', sortable: true, resizable: true, width:85},
                {headerName:'Notes', field:'notes', sortable: true, resizable: true, width: 80},
                {headerName:'Reference', field:'reference', sortable: true,  resizable: true, filter: 'agTextColumnFilter', width: 80},
                {
                    headerName:'Delete', 
                    field:'detail_id', 
                    hide: colShowHide,
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
        
        onMounted(() => {
            fetch(detailurl)
                .then((result) => result.json())
                .then((remoteRowData) => (rowData.value = remoteRowData))
                .then();
        });
        
        return{
            columnDefs,
            pfasColDefs,
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
    
    created: async function(){
        const gResponse = await fetch(this.url);
        const gObject = await gResponse.json();
        this.reaction = gObject[0];
    },
    
    methods: {
        handleDelete() {
            if (confirm("Are you sure you want to Delete this Reaction?") == true){
                axios
                    .post(this.$apiname + "reaction/reactiondelete", {
                        reactionID: this.$route.params.reactid,
                    })
                    .then( this.$router.push('/reaction/database') );
            }
            
        },
    },
}

</script>

<style>
</style>