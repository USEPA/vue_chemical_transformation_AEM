<template>
    <div>
        <h2> <span v-for="(name,index) in reaction.parent_name"><router-link v-bind:to="'/chemical/'+reaction.parent_IDnum[index]">{{name}}</router-link><span v-if="index != reaction.parent_name.length - 1"> + </span></span> → <span v-for="(name,index) in reaction.product_name"><router-link v-bind:to="'/chemical/'+reaction.product_IDnum[index]">{{name}}</router-link><span v-if="index != reaction.product_name.length - 1"> + </span></span></h2>
        <span v-for="(element,index) in reaction.parent_image"> <img v-bind:src="'data:image/png;base64,'+element" alt="missing image" style="width:150px;height:150px;vertical-align:middle;" /><span v-if="index != reaction.parent_image.length - 1"> + </span> </span> → <span v-for="(element,index) in reaction.product_image"> <img v-bind:src="'data:image/png;base64,'+element" alt="missing image" style="width:150px;height:150px;vertical-align:middle;" /><span v-if="index != reaction.product_image.length - 1"> + </span> </span>
        <br>
        <p>Reaction Process: {{reaction.reaction_process}}</p>
        <p>Reaction Type: {{reaction.reaction_type}}</p>
        <p>Reaction Scheme: {{reaction.reaction_scheme}}</p>
        <button v-on:click="showhide = !showhide">Reaction Details</button> 
        <br>
        <div v-if="showhide && reaction.reaction_process.toLowerCase().includes('hydrolysis')">
            <ag-grid-vue
                class="ag-theme-balham-dark"
                style="height:600px"
                :columnDefs="columnDefs.value"
                :rowData="rowData.value">
            </ag-grid-vue>
        </div>
        <div v-if="showhide && reaction.reaction_process.toLowerCase().includes('pfas')">
            <ag-grid-vue
                class="ag-theme-balham-dark"
                style="height:600px"
                :columnDefs="pfasColDefs.value"
                :rowData="rowData.value">
            </ag-grid-vue>
        </div>
        <div v-if="this.$cookie.getCookie('user')">
            <router-link v-bind:to="'/reaction/newdetail/'+this.$route.params.reactid"> Add New Reaction Details </router-link>
            <br> <button v-on:click="handleDelete">Delete this Reaction</button> 
        </div>
    </div>
</template>

<script>

import {reactive, h, onMounted} from 'vue'
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
    
        const colShowHide = true

        const routeID = useRoute().params.reactid
    
        const detailurl = "http://localhost:5000/reaction/table/" + useRoute().params.reactid;
        
        const rowData = reactive({
            value: [],
        });
        
        const columnDefs = reactive({
            value: [
                {headerName:'pH', field:'pH', sortable: true, resizable: true, width:40},
                {headerName:'Temperature (°C)', field:'temp_C', sortable: true, resizable: true, width:90},
                {headerName:'Activation Energy (kcal/mol)', field:'activation_energy', sortable: true, resizable: true, width:80},
                {headerName:'Degradation Rate (days⁻¹)', field:'degradation_rate', sortable: true, resizable: true, width:80},
                {headerName:'1st Order Rate Constant (second⁻¹)', field:'first_order_rc', sortable: true, resizable: true, width:120},
                {headerName:'2nd Order Rate Constant (mol⁻¹ * second⁻¹)', field:'second_order_rc', sortable: true, resizable: true, width:120},
                {headerName:'Reaction Rate Constant', field:'reaction_rc', sortable: true, resizable: true, width:115},
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
                            axios
                                .post("http://127.0.0.1:5000/reaction/detaildelete", {
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
                {headerName:'Temperature (°C)', field:'temp_C', sortable: true, resizable: true, width:115},
                {headerName:'Half Life (days)', field:'half_life', sortable: true, resizable: true, width:85},
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
                                    .post("http://127.0.0.1:5000/reaction/detaildelete", {
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
            showhide: false,
        }
    },
    
    computed: {
        url() {
            return "http://localhost:5000/reaction/" + this.$route.params.reactid
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
                    .post("http://127.0.0.1:5000/reaction/reactiondelete", {
                        reactionID: this.$route.params.reactid,
                    })
                    .then( this.$router.push('/reaction/database') );
            }
            
        },
    },
}

</script>