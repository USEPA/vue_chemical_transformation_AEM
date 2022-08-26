<template>

<div v-if="rowtile"> 
    <button v-on:click="rowtile = !rowtile" style="font-size:xx-small">Tile View</button> <br>
    <ag-grid-vue
        class="ag-theme-balham-dark"
        domLayout="autoHeight"
        rowHeight="100px"
        :columnDefs="chemColDefs.value"
        :rowData="rowData.value"
        :enableBrowserTooltips="true">
    </ag-grid-vue>
</div>
<div v-else>
    <button v-on:click="rowtile = !rowtile" style="font-size:xx-small">Row View</button> <br>
    <br>
    Search: <input type="text" list="typeaheadlist" v-model="input" placeholder="Name, DTXSID, CASRN, inchi key" /> <br>
    <datalist id="typeaheadlist">
        <option v-for="row in bigout" :value="row.dtxsid" :label="row.primary_name"></option>
    </datalist>
    <div class="tileset">
    <div class="tile" v-for="row in filteredlist">
        <p style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">Name: <router-link v-bind:to="'/chemical/'+row.local_IDnum"> {{row.primary_name}} </router-link> </p>
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
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css'
import { useRouter } from 'vue-router'

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
                            || item.casrn?.toLowerCase().includes(v));
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
                            router.push('/chemical/'+ params.data.local_IDnum);
                            }
                        );
                        return link;
                    },
                    width:250,
                    tooltipField:'primary_name',
                },
                {headerName:'CASRN', field:'casrn', sortable: true, resizable: true, filter: 'agTextColumnFilter', floatingFilter: true, width:100},
                // {headerName:'InChI KEY', field:'inchi', sortable: true, resizable: true, filter: 'agTextColumnFilter', floatingFilter: true, width:350},
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
}

</script>

<style>
.tileset {
  display: flex;
  flex-flow: row wrap;
  justify-content: left;
  margin: auto;
  margin-top:30px;
  max-width: calc(6 * 275px);
}

.tile {
  width: 205px;
  height: 225px;
  border: 2px solid darkblue;
  box-sizing: border-box;
  position: relative;
}

.ag-row .ag-cell {
  display: flex;
  align-items: center;
}
</style>