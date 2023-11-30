<template>
    <!-- row view -->
    <div v-if="rowtile"> 
        <button v-on:click="rowtile = !rowtile">Tile View</button>
        <button v-on:click="handleGridExport()">Export Chemical List</button><br><br>
        Enter terms of interest into filter boxes to filter the table on that column.<br><br>
        <!-- the grid setup is in the script section -->
        <ag-grid-vue
            class="ag-theme-balham"
            domLayout="autoHeight"
            rowHeight="100px"
            :columnDefs="chemColDefs.value"
            :rowData="buildrows(rowData.value,countsdata)"
            :enableBrowserTooltips="true"
            @grid-ready="onGridReady">
        </ag-grid-vue>
    </div>
    <!-- tile view -->
    <div v-else id="tiles">
        <button v-on:click="rowtile = !rowtile">Table View</button>
        <button v-on:click="handleExport">Export Chemical List</button> <br><br>
        Filter Chemical List: <input style="width:245px" type="text" list="typeaheadlist" v-model="input" placeholder="Name, DTXSID, CASRN, InChI key" /> <br>
        Searching in the Tile View will perform a search across all names, synonyms, and chemical identifiers.<br>
        <!-- sets up substring filtered search suggestions for DTXSID and Name -->
        <!-- search or get rid of suggestion when clicked -->
        <datalist v-if="input.length > 2" id="typeaheadlist">
            <option v-for="row in bigout" :value="row.dtxsid" :label="row.primary_name"></option>
        </datalist>
        <div class="tileset">
        <!-- tile formatting is handled mostly by the css styling -->
        <div class="tile" v-for="row in filteredlist">
            <p style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">Name: <router-link v-bind:to="'/chemical/'+row.dtxsid"> {{row.primary_name}} </router-link> </p>
            <p><img v-bind:src="'data:image/png;base64,'+row.image" v-on:click="magnify(['data:image/png;base64,'+row.image,row.primary_name])" alt="missing image" style="display: block; margin-left: auto; margin-right: auto; width:150px; height:150px;" /> </p>
            <p>DTXSID: <a :href="'https://comptox.epa.gov/dashboard/chemical/details/' + row.dtxsid" target="_blank"> {{row.dtxsid}} ↗</a></p>
        </div>
        </div>
        <!-- if the data have not loaded yet indicates that a search is underway -->
        <div v-if="!bigout.length & timer">
            <br> <p style="font-size:25px">Searching...</p>
        </div>
        <!-- if the data have loaded but all elements have been filtered out of the list, indicate that there is no match -->
        <div v-else-if="filteredlist.length == 0">
            <br> <p style="font-size:25px">NO CHEMICALS MATCH THAT SEARCH</p>
        </div>
    </div>

    <!-- popup windown for showing a larger image of a chemical -->
    <div v-if="showhide" class="chemcheck">
        <img v-bind:src="srcvar" alt="missing image" style="display: block; margin-left: auto; margin-right: auto; width:300px; height:300px;" /><br>
        {{ srcname }}<hr>
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
        name: 'chemdatabase',
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
                bigout:'',
                input,
                showhide: false,
                srcvar:'',
                srcname:'',
                timer:true,
                library_list:[],
                countsdata:[],
            }
        },
        // get the database JSON from the backend
        created: async function(){
            try{
                const url = this.$apiname + "chemicals/database";
                const gResponse = await fetch(url);
                const gObject = await gResponse.json();
                this.bigout = gObject;
            } catch (error){
                this.timer = false
            }
        },
        mounted() {
            const liburl = this.$apiname + "reaction/libraries"
            fetch(liburl)
                .then((result) => result.json())
                .then((remoteRowData) => (
                    this.chemColDefs.value = this.buildcolumns(remoteRowData),
                    this.library_list = remoteRowData
                ));
            const counturl = this.$apiname + "chemicals/counts"
            fetch(counturl)
                .then((result) => result.json())
                .then((remoteRowData) => (this.countsdata = remoteRowData));
            const chemurl = this.$apiname + "chemicals/database"
            fetch(chemurl)
                .then((result) => result.json())
                .then((remoteRowData) => (this.rowData.value = remoteRowData));
        },
        computed: {
            // function for filtering the database JSON
            filteredlist() {
                if (this.input) {
                    return this.bigout.filter((item) => {
                        // substring match, split multiple search terms, check if searchable fields have a match
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
                // don't filter if there's no input
                return this.bigout
                }
            },
        },
        methods: {
            // sets up the grid
            onGridReady(params) {
                this.gridApi = params.api;
                this.gridColumnApi = params.columnApi;
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
                                this.$router.push('/reaction/searchresults/' + params.data.dtxsid + '/ID');
                                }
                            );
                            return link;
                        },
                        width:250,
                        tooltipField:'primary_name',
                    },
                    {headerName:'CASRN', field:'casrn', sortable: true, resizable: true, filter: 'agTextColumnFilter', floatingFilter: true, width:115},
                    {headerName:'InChI KEY', field:'inchi', sortable: true, hide:true, resizable: true, filter: 'agTextColumnFilter', floatingFilter: true, width:350},
                    {headerName:'Number of Reactions', children:[]},
                )
                for(let i of liblist){
                    new_cols[5].children.push({
                        headerName : i.lib_name,
                        field : i.lib_name,
                        resizable: true, 
                        sortable: true, 
                        cellStyle: { 'justify-content': 'center' },
                        width:80,
                        // code for adding an internal link using the vue router to a grid column
                        cellRenderer: (params) => {
                            var link = document.createElement('a');
                            link.href = '#';
                            link.innerText = params.data[i.lib_name];
                            link.addEventListener('click', (e) => {
                                e.preventDefault();
                                this.$router.push('/reaction/searchresults/'+params.data.dtxsid+'/'+i.lib_ID);
                            });
                            // don't link out if there are no reactions
                            if (params.data.hydro_count == 0) return '0';
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
                        link.download = this.input+'_chemical_list.csv'
                        link.click()
                    });
            },
            // code for exporting the contents of the AGgrid object using a pre-built function
            handleGridExport() {
                this.gridApi.exportDataAsCsv({allColumns:true});
            },
            // code for zooming on a chemical, sets the image in the popup window to the clicked item then shows the popup
            magnify(x) {
                this.srcvar = x[0];
                this.srcname = x [1];
                this.showhide=true;
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
</style>