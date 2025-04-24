<template>  
    <!-- row view -->
    <div> 
        <div style="font-size:25px">
            {{$route.params.setid}} Associated Chemicals<br>
        </div>
        <div>
            <router-link v-bind:to="'/about/'+$route.params.setid" style="text-transform: capitalize;">About this Library</router-link><br>
            <router-link v-bind:to="'/reaction/searchresults/'+$route.params.setid+'/reaction_library/false'" style="text-transform: capitalize;">List of Reactions in this Reaction Library</router-link><br><br>
        </div>
        <button v-on:click="handleGridExport()">Export Chemical List</button><br><br>
        Enter terms of interest into filter boxes to filter the table on that column.<br><br>
        Displaying {{ rowcount }} Chemicals out of {{ rowData.value.length }}<br><br>
        <!-- the grid setup is in the script section -->
        <ag-grid-vue
            class="ag-theme-balham"
            domLayout="autoHeight"
            rowHeight="100px"
            :columnDefs="chemColDefs.value"
            :rowData="buildrows(rowData.value,countsdata)"
            :enableBrowserTooltips="true"
            :pagination="true"
            :paginationPageSize="50"
            @filterChanged="onFilter"
            @grid-ready="onGridReady">
        </ag-grid-vue>
    </div>

    <!-- popup windown for showing a larger image of a chemical -->
    <div v-if="!rowData.value.length & timer" class="chemcheck" style="font-size:25px">
        SEARCHING . . .          
    </div>
    <div v-else-if="rowData.value.length == 0 & showhide" class="chemcheck" style="font-size:25px">
        NO CHEMICALS FOUND<hr>
        <button @click="showhide=false"> [X] </button>  
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
        name: 'chemset',
        components: {
            AgGridVue,
        },
        data () {        
            // input needs to be reactive for filtering to work
            const input = ref("");
            const rowData = reactive({
                value: []
            });
            const chemColDefs = reactive({
                value: []
            });
            return {
                rowtile: false,
                chemColDefs,
                rowData,
                input,
                showhide: true,
                srcvar:'',
                srcname:'',
                timer:true,
                library_list:[],
                countsdata:[],
                rowcount:0,
            }
        },
        // get the database JSON from the backend
        mounted() {
            this.showhide = true
            const liburl = this.$apiname + "reaction/libraries"
            fetch(liburl, {mode:'cors'})
                .then((result) => result.json())
                .then((remoteRowData) => (
                    this.chemColDefs.value = this.buildcolumns(remoteRowData),
                    this.library_list = remoteRowData
                ));
            const counturl = this.$apiname + "chemicals/counts"
            fetch(counturl, {mode:'cors'})
                .then((result) => result.json())
                .then((remoteRowData) => (this.countsdata = remoteRowData));
            try{                
                const chemurl = this.$apiname + "chemicals/chemset/" + this.$route.params.setid
                fetch(chemurl, {mode:'cors'})
                    .then((result) => result.json())
                    .then((remoteRowData) => (this.rowData.value = remoteRowData));
            } catch (error){
                this.timer = false
            }        
        },
        methods: {
            // sets up the grid
            onGridReady(params) {
                this.gridApi = params.api;
                this.gridColumnApi = params.columnApi;
                this.rowcount = this.gridApi.getDisplayedRowCount();
            },
            // changes row count when filtering
            onFilter() {
                this.rowcount = this.gridApi.getDisplayedRowCount();
            },
            // a function for building JSONs for the gird's columns
            buildcolumns(liblist){
                let new_cols = []
                // fixed rows for identifiers and structure image
                new_cols.push(
                    {
                        headerName:'Structure', 
                        autoHeight: true,
                        field:'image', 
                        // code for adding an image to a grid column, passed as a base64 png string
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
                        tooltipField:'dtxsid', 
                        sortable: true, 
                        resizable: true, 
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                        // code for adding an external link to a grid column
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
                        tooltipField:'primary_name', 
                        sortable: true, 
                        resizable: true, 
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                        // code for adding an internal link using the vue router to a grid column
                        cellRenderer: (params) => {
                            var link = document.createElement('a');
                            link.href = '#';
                            link.innerText = params.data.primary_name;
                            link.addEventListener('click', (e) => {
                                e.preventDefault();
                                this.$router.push('/reaction/searchresults/' + params.data.dtxsid + '/ID/false');
                                }
                            );
                            return link;
                        },
                        width:250,
                        tooltipField:'primary_name',
                    },
                    {headerName:'CASRN', field:'casrn', tooltipField:'casrn', sortable: true, resizable: true, filter: 'agTextColumnFilter', floatingFilter: true, width:115},
                    {headerName:'InChI KEY', field:'inchi', tooltipField:'inchi', sortable: true, hide:true, resizable: true, filter: 'agTextColumnFilter', floatingFilter: true, width:350},
                    {headerName:'Number of Reactions', children:[]},
                )
                for(let i of liblist){
                    new_cols[5].children.push({
                        headerName : i.lib_name,
                        field : i.lib_name,
                        resizable: true, 
                        sortable: true, 
                        cellStyle: { 'justify-content': 'center' },
                        width:Math.min(i.lib_name.length*30,150),
                        // code for adding an internal link using the vue router to a grid column
                        cellRenderer: (params) => {
                            var link = document.createElement('a');
                            link.href = '#';
                            link.innerText = params.data[i.lib_name];
                            link.addEventListener('click', (e) => {
                                e.preventDefault();
                                this.$router.push('/reaction/searchresults/'+params.data.dtxsid+'/'+i.lib_ID+'/false');
                            });
                            // don't link out if there are no reactions
                            if (params.data[i.lib_name] == 0) return '0';
                            else return link;
                        },
                    })
                }
                return new_cols
            },
            // a function for building JSONs for the grid's rows
            buildrows(row_raw, counts){
                let new_rows = row_raw
                for(let row of new_rows){
                    for(let library of this.library_list){
                        if(counts.filter((item) => {return item.lib_ID == library.lib_ID && item.chemical_ID == row.chemical_ID}).length > 0){
                            row[library.lib_name] = counts.filter((item) => {return item.lib_ID == library.lib_ID && item.chemical_ID == row.chemical_ID})[0].chem_lib_count
                        }
                        else{
                            row[library.lib_name] = 0
                        }
                    }
                }
                return(new_rows)
            },
            // code for exporting the contents of a tile view search
            async handleExport() {
                axios
                    // send the content info to the backend
                    .post(this.$apiname + "chemicals/chemical_DL", {
                        chemlist: this.filteredlist,
                        responseType: 'blob',
                    })
                    // get the file setup by the backend and open a download window
                    .then((res) => {
                        let data = res.data;
                        const blob = new Blob([data], { type: 'application/zip' })
                        let link = document.createElement('a')
                        link.href = window.URL.createObjectURL(blob)
                        link.download = this.input+'_chemical_list_'+Date.now()+'.csv'
                        link.click()
                    });
            },
            // code for exporting the contents of the AGgrid object using a pre-built function
            handleGridExport() {
                let colSet = []
                for(let i of this.chemColDefs.value){
                    if (i.headerName != 'Structure'){
                        colSet.push(i.field)
                    }
                }
                let fname = 'CheT_grid_view_chemical_list_'+Date.now()
                const params = {
                    columnKeys:colSet,
                    fileName:fname,
                }
                console.log(params)
                this.gridApi.exportDataAsCsv(params);
            },
        },
    }

</script>

<style>
/* limits the width of the tile view and has them wrap when they reach max width */
.tileset {
  display: flex;
  flex-flow: row wrap;
  justify-content: left;
  margin: auto;
  margin-top:30px;
  max-width: calc(6 * 280px);
}

/* styles the tiles so they will be the proper size, relative positioning lets them properly wrap */
.tile {
  width: 215px;
  height: 240px;
  border: 2px solid darkblue;
  box-sizing: border-box;
  position: relative;
}

.chemcheck{
    position:fixed;
    top:20%;
    right:40%;
    left:40%;
    text-align: center;
    border: 2px solid black;
}

.ag-row .ag-cell {
  display: flex;
  align-items: center;
}

.ag-theme-balham{
  --ag-header-foreground-color:Black;
}
</style>