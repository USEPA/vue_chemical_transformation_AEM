<template>

<div v-if="rowtile"> 
    <button v-on:click="rowtile = !rowtile">Tile View</button>
    <button v-on:click="handleGridExport()">Export Chemical List</button><br><br>
    <ag-grid-vue
        class="ag-theme-balham"
        domLayout="autoHeight"
        rowHeight="100px"
        :columnDefs="chemColDefs.value"
        :rowData="rowData.value"
        :enableBrowserTooltips="true"
        @grid-ready="onGridReady">
    </ag-grid-vue>
</div>
<div v-else>
    Search: <input style='width:245px' type="text" list="typeaheadlist" v-model="input" placeholder="Name, DTXSID, CASRN, InChI key" /> <br><br>
    <datalist id="typeaheadlist">
        <option v-for="row in bigout" :value="row.dtxsid" :label="row.primary_name"></option>
    </datalist>
    <button v-on:click="rowtile = !rowtile">Table View</button>
    <button v-on:click="handleExport">Export Chemical List</button> 
    <div class="tileset">
    <div class="tile" v-for="row in filteredlist">
        <p style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">Name: <router-link v-bind:to="'/reaction/searchresults/'+row.local_IDnum+'/ID'"> {{row.primary_name}} </router-link> </p>
        <p><img v-bind:src="'data:image/png;base64,'+row.image" alt="missing image" style="display: block; margin-left: auto; margin-right: auto; width:150px; height:150px;" /> </p>
        <p>DTXSID: <a :href="'https://comptox.epa.gov/dashboard/chemical/details/' + row.dtxsid" target="_blank"> {{row.dtxsid}} ↗</a></p>
    </div>
    </div>
</div>
</template>

<script>

import {ref, onMounted, inject, reactive} from 'vue'
import {AgGridVue} from 'ag-grid-vue3'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import { useRouter } from 'vue-router'
import axios from "axios"

export default {
    name: 'chemdatabase',
    components: {
        AgGridVue,
    },
    data () {        
        const input = ref("");
        return {
            rowtile: false,
            bigout: '',
            input,
        }
    },
    created: async function(){
        const url = this.$apiname + "chemicals/database";
        const gResponse = await fetch(url);
        const gObject = await gResponse.json();
        this.bigout = gObject;
    },
    computed: {
        filteredlist() {
            if (this.input) {
                return this.bigout.filter((item) => {
                    return this.input
                        .toLowerCase()
                        .split(" ")
                        .every((v) => 
                            item.primary_name?.toLowerCase().includes(v)
                            || item.dtxsid?.toLowerCase().includes(v)
                            || item.inchi?.toLowerCase().includes(v)
                            || item.casrn?.toLowerCase().includes(v)
                            || item.other_names?.toLowerCase().includes(v));
                });
            } else {
                return this.bigout
            }
        },
    },
    
    setup(){
        const apiname = inject('apiname')
        const router = useRouter()
        const url = apiname + "chemicals/database"
        const rowData = reactive({
            value: [],
        });
        const chemColDefs = reactive({
            value: [
                {
                    headerName:'Structure', 
                    autoHeight: true,
                    field:'image', 
                    cellRenderer: (params) => {
                        var image = document.createElement('img');
                        image.src = 'data:image/png;base64,'+params.data.image;
                        image.style = "width:70px;height:70px;";
                        return image;
                    },
                    width: 120,
                },
                {
                    headerName:'DTXSID', 
                    field:'dtxsid', 
                    sortable: true, 
                    resizable: true, 
                    filter: 'agTextColumnFilter',
                    floatingFilter: true,
                    cellRenderer: (params) => {
                        var link = document.createElement('a');
                        link.href = 'https://comptox.epa.gov/dashboard/chemical/details/' + params.data.dtxsid;
                        link.target = "_blank";
                        link.innerText = params.data.dtxsid + '↗';
                        return link;
                    },
                    width:160,
                },
                {
                    headerName:'Primary Name', 
                    field:'primary_name', 
                    sortable: true, 
                    resizable: true, 
                    filter: 'agTextColumnFilter',
                    floatingFilter: true,
                    cellRenderer: (params) => {
                        var link = document.createElement('a');
                        link.href = '#';
                        link.innerText = params.data.primary_name;
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            router.push('/reaction/searchresults/' + params.data.local_IDnum + '/ID');
                            }
                        );
                        return link;
                    },
                    width:250,
                    tooltipField:'primary_name',
                },
                {headerName:'Synonyms', field:'other_names', tooltipField:'other_names', sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, width:350},
                {headerName:'CASRN', field:'casrn', sortable: true, resizable: true, filter: 'agTextColumnFilter', floatingFilter: true, width:100},
                {headerName:'InChI KEY', field:'inchi', sortable: true, hide: true, filter: 'agTextColumnFilter', floatingFilter: true, width:350},
                {
                    headerName:'Hydrolysis Reactions', 
                    field:'hydro_count', 
                    resizable: true, 
                    sortable: true, 
                    width:150,
                    cellRenderer: (params) => {
                        var link = document.createElement('a');
                        link.href = '#';
                        link.innerText = params.data.hydro_count;
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            router.push('/reaction/searchresults/'+params.data.local_IDnum+'/hydrolysis');
                            }
                        );
                        if (params.data.hydro_count == 0) return '0';
                        else return link;
                    },
                },
                {
                    headerName:'PFAS Reactions', 
                    field:'pfas_count', 
                    resizable: true, 
                    sortable: true, 
                    width:150,
                    cellRenderer: (params) => {
                        var link = document.createElement('a');
                        link.href = '#';
                        link.innerText = params.data.pfas_count;
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            router.push('/reaction/searchresults/'+params.data.local_IDnum+'/PFAS');
                            }
                        );
                        if (params.data.pfas_count == 0) return '0';
                        else return link;
                    },
                },
                {
                    headerName:'Photolysis Reactions', 
                    field:'photo_count', 
                    resizable: true, 
                    sortable: true, 
                    width:150,
                    cellRenderer: (params) => {
                        var link = document.createElement('a');
                        link.href = '#';
                        link.innerText = params.data.photo_count;
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            router.push('/reaction/searchresults/'+params.data.local_IDnum+'/Photolysis');
                            }
                        );
                        if (params.data.photo_count == 0) return '0';
                        else return link;
                    },
                
                },
            ],
        });

        onMounted(() => {
            fetch(url)
                .then((result) => result.json())
                .then((remoteRowData) => (rowData.value = remoteRowData))
                .then();
        });

        return{
            chemColDefs,
            rowData,
            url,
        };
    },
    methods: {
        handleExport() {
            axios
                .post(this.$apiname + "chemicals/chemical_DL", {
                    chemlist: this.filteredlist,
                });
        },
        handleGridExport() {
            this.gridApi.exportDataAsCsv({allColumns:true});
        },
        onGridReady(params) {
            this.gridApi = params.api;
            this.gridColumnApi = params.columnApi;
        },
    },
}

</script>

<style>
.tileset {
  display: flex;
  flex-flow: row wrap;
  justify-content: left;
  margin: auto;
  margin-top:30px;
  max-width: calc(6 * 280px);
}

.tile {
  width: 215px;
  height: 240px;
  border: 2px solid darkblue;
  box-sizing: border-box;
  position: relative;
}

.ag-row .ag-cell {
  display: flex;
  align-items: center;
}
</style>