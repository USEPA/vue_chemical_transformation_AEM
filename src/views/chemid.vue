<template>
    <div>
        <h2 :title=chemical.primary_name>{{chemical.primary_name}}</h2>
        <p><router-link v-bind:to="'/reaction/searchresults/'+this.$route.params.chemid+'/ID'">Reactions Containing this Chemical</router-link></p>
        <img v-bind:src="'data:image/png;base64,'+chemical.image" v-on:click="magnify('data:image/png;base64,'+chemical.image)" alt="missing image" style="width:150px;height:150px;" />
        <br>
        DTXSID: <a :href="'https://comptox.epa.gov/dashboard/chemical/details/' + chemical.dtxsid" target="_blank"> {{chemical.dtxsid}} ↗ </a>
        <br>
        <button v-on:click="showhide = !showhide">Chemical Identifiers</button> <br>
        <div v-if="showhide">
            SMILES: {{ chemical.smiles }} <br>
            CASRN: {{ chemical.casrn }} <br>
            InChI KEY: {{ chemical.inchi }} <br>
            Synonyms: {{chemical.other_names}} <br>
        </div><br>
        <p><router-link v-bind:to="'/reaction/reactionmap/'+this.$route.params.chemid+'/chemical'">Map of all Reactions Linked to this Chemical</router-link></p>
        <!-- the grid setup is in the script section, the grid will only display if there are entries -->
        <div v-if="(metarowData.value.length!=0)">
            Metapath Reaction Maps Containing this Chemical
            <ag-grid-vue
                class="ag-theme-balham"
                domLayout="autoHeight"
                :columnDefs="metapathColDefs.value"
                :rowData="metarowData.value"
                :enableBrowserTooltips="true">
            </ag-grid-vue>
        </div>
        <div v-if="(pfasrowData.value.length!=0)">
            PFAS Reaction Maps Containing this Chemical
            <ag-grid-vue
                class="ag-theme-balham"
                domLayout="autoHeight"
                :columnDefs="pfasColDefs.value"
                :rowData="pfasrowData.value"
                :enableBrowserTooltips="true">
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
            return{
                chemical: '',
                showhide: false,
                showhide2: false,
                srcvar:'',
            }
        },
        computed: {
            url() {
                return this.$apiname + "chemicals/" + this.$route.params.chemid
            }
        },
        // get the chemical info from the backend
        created: async function(){
            const gResponse = await fetch(this.url);
            const gObject = await gResponse.json();
            this.chemical = gObject[0];
        },
        methods: {
            // function for deleting a chemical
            handleDelete() {
                // confirmation popup
                if (confirm("Are you sure you want to Delete this Chemical?") == true){
                    axios
                        // tell the backend to delete the chemical
                        .post(this.$apiname + "chemicals/chemdelete", {
                            chemID: this.$route.params.chemid,
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
        setup(){

            // this is necessary to access the router during setup
            const router = useRouter() 
            // this is necessary to access the apiname global variable during setup
            const apiname = inject('apiname')
        
            const metaurl = apiname + "chemicals/mapinfo/" + useRoute().params.chemid + "/metapath";
            const pfasurl = apiname + "chemicals/mapinfo/" + useRoute().params.chemid + "/pfas";
            
            const metarowData = reactive({
                value: [],
            });
            const pfasrowData = reactive({
                value: [],
            });
                    
            // Defines the columns for metapath AG Grid 
            const metapathColDefs = reactive({
                value: [
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
                    {headerName:'Species', field:'species', sortable: true, resizable: true, width:200},
                    {
                        headerName:'Reference', 
                        field:'reference', 
                        sortable: true,  
                        resizable: true, 
                        filter: 'agTextColumnFilter', 
                        width: 1050,
                        // code for adding an external link to a grid column
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
                ],
            });

            // Defines the columns for pfas AG Grid 
            const pfasColDefs = reactive({
                value: [
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
                    {headerName:'Reaction System', field:'reaction_system', sortable: true, resizable: true, width:200},
                    {
                        headerName:'Reference', 
                        field:'reference', 
                        sortable: true,  
                        resizable: true, 
                        filter: 'agTextColumnFilter', 
                        width: 1050,
                        // code for adding an external link to a grid column
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
                ],
            });

            
            // function for getting the data for the grid
            onMounted(() => {
                fetch(metaurl)
                    .then((result) => result.json())
                    .then((remoteRowData) => (metarowData.value = remoteRowData))
                    .then();
                
                fetch(pfasurl)
                    .then((result) => result.json())
                    .then((remoteRowData) => (pfasrowData.value = remoteRowData))
                    .then();
            });
            
            return{
                metapathColDefs,
                pfasColDefs,
                metarowData,
                pfasrowData,
                metaurl,
                pfasurl,
            };
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