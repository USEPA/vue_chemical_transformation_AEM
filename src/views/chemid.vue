<template>
    <div>
        <h2 :title=chemical.primary_name>{{chemical.primary_name}}</h2>
        <img v-bind:src="'data:image/png;base64,'+chemical.image" v-on:click="magnify('data:image/png;base64,'+chemical.image)" alt="missing image" style="width:150px;height:150px;" />
        <br>
        DTXSID: <a :href="'https://comptox.epa.gov/dashboard/chemical/details/' + chemical.dtxsid" target="_blank"> {{chemical.dtxsid}} ↗ </a>
        <br>
        <button v-on:click="showhide = !showhide">Chemical Identifiers</button> <br>
        <div v-if="showhide">
            &nbsp; &nbsp; SMILES: {{ chemical.smiles }} <br>
            &nbsp; &nbsp; CASRN: {{ chemical.casrn }} <br>
            &nbsp; &nbsp; InChI KEY: {{ chemical.inchi }} <br>
            &nbsp; &nbsp; <button v-on:click="alias_showhide = !alias_showhide">Synonyms</button>
            <div v-if="alias_showhide" v-for="name in aliases"> &nbsp; &nbsp; &nbsp; &nbsp; {{name.alias}}</div> <br>
        </div>
        <a :href="'https://ccte-cced-amos.epa.gov/search/' + chemical.dtxsid + '?initial_results_tab=all'" target="_blank"> Search Methods and Spectra ↗ </a><br><br>

        <router-link v-bind:to="'/reaction/searchresults/'+this.$route.params.chemid+'/ID'">List of Reactions Containing this Chemical</router-link><br>
        <router-link v-bind:to="'/reaction/reactionmap/'+ this.$route.params.chemid +'/chemical'">Map of all Reactions Linked to this Chemical</router-link><br><br>
        <!-- the grid setup is in the script section, the grid will only display if there are entries -->
        <div v-if="(mapRowData.value.length!=0)">
            Reaction Maps Containing this Chemical
            <ag-grid-vue
                class="ag-theme-balham"
                domLayout="autoHeight"
                :columnDefs="colDefs.value"
                :rowData="mapRowData.value"
                :enableBrowserTooltips="true"
                @grid-ready="onGridReady">>
            </ag-grid-vue> 
        </div>
        <!-- Delete option only available to logged in users, placeholder system in place for login -->
        <div v-if="this.$cookie.getCookie('user')">
            <br> <button v-on:click="handleDelete">Delete this Chemical</button> 
        </div>
    </div>

    <!-- popup windown for showing a larger image of a chemical -->
    <div v-if="showhide2" class="chemcheck">
        <img v-bind:src="srcvar" alt="missing image" style="display: block; margin-left: auto; margin-right: auto; width:300px; height:300px;" /><hr>
        <button @click="showhide2=false"> [X] </button>     
    </div>
</template>

<script>

    import {reactive, onMounted, inject} from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import axios from "axios"
    import {AgGridVue} from 'ag-grid-vue3'
    import 'ag-grid-community/dist/styles/ag-grid.css'
    import 'ag-grid-community/dist/styles/ag-theme-balham.css'

    export default{
        name: 'chemid',
        components: {
            AgGridVue,
        },
        data () {
            const mapRowData = reactive({
                value: []
            });
            const colDefs = reactive({
                value: []
            });
            return{
                chemical: '',
                aliases: '',
                colDefs,
                mapRowData,
                showhide: false,
                showhide2: false,
                alias_showhide: false,
                srcvar:'',
            }
        },
        computed: {
            url() {
                return this.$apiname + "chemicals/" + this.$route.params.chemid
            },
            aliasurl() {
                return this.$apiname + "chemicals/alias/" + this.$route.params.chemid
            },
            mapurl() {
                return this.$apiname + "chemicals/maps/" + this.$route.params.chemid
            }
        },
        // get the chemical info from the backend
        created: async function(){
            const gResponse = await fetch(this.url);
            const gObject = await gResponse.json();
            this.chemical = gObject[0];
            const aliasResponse = await fetch(this.aliasurl);
            const aliasObject = await aliasResponse.json();
            this.aliases = aliasObject;
            const mapResponse = await fetch(this.mapurl);
            const mapObject = await mapResponse.json();
            this.mapRowData.value = mapObject;
        },
        mounted(){
            this.colDefs.value = this.buildcolumns()
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
                const router = useRouter()
                // fixed rows for identifiers and structure image
                new_cols.push(
                    {
                        headerName:'Map ID', 
                        field:'map_ID',
                        sortable: true, 
                        resizable: true,
                        // code for adding an internal link using the vue router to a grid column
                        cellRenderer: (params) => {
                            var link = document.createElement('a');
                            if(params.data.map_ID != ''){
                                link.innerText = "Map "+params.data.map_ID;
                                link.href = '#'
                                link.addEventListener("click", e => {
                                    e.preventDefault();
                                    router.push('/reaction/reactionmap/'+params.data.map_ID+'/mapid');
                                })
                            } else {
                                link.innerText = "No Map"
                            };
                            return link;
                        },
                        width:250,
                        tooltipField:'primary_name',
                    },
                    {headerName:'Reference', field:'reference', sortable: true, resizable: true, filter: 'agTextColumnFilter', width:450},
                )
                return new_cols
            },
            // function for deleting a chemical
            handleDelete() {
                // confirmation popup
                if (confirm("Are you sure you want to Delete this Chemical?") == true){
                    axios
                        // tell the backend to delete the chemical
                        .post(this.$apiname + "chemicals/chemdelete", {
                            chemID: this.chemical.dtxsid,
                        })
                        // reroute to the database
                        .then( this.$router.push('/chemical/database') 
                        );
                }
            },
            // code for zooming on a chemical, sets the image in the popup window to the clicked item then shows the popup
            magnify(x) {
                this.srcvar = x;
                this.showhide2=true;
            },
        },
    }

</script>

<style scoped>
h2 {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.chemcheck{
    position:fixed;
    top:20%;
    right:40%;
    left:40%;
    text-align: center;
    border: 2px solid black;
}
</style>