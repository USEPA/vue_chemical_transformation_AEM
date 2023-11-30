<template>
    <h2 v-if="this.$route.params.searchtype == 'chemical'">
        Reaction Map For {{chemical.primary_name}}
    </h2>
    <h2 v-else-if="this.$route.params.searchtype == 'mapid'">
        Reaction Map {{this.$route.params.searchinput}} :
        {{ firstmap }}
    </h2>
    <h2 v-else-if="this.$route.params.searchtype == 'compare'">
        Reaction Maps {{this.$route.params.searchinput.replace('_',' & ').replace('_',' & ')}} <br>
        <span v-for="(map,index) in maplist"><span v-if="index != 0">&nbsp; & &nbsp;</span>{{ map }}</span>
    </h2>
    <div v-if="(showhide && this.$route.params.searchtype != 'compare')">
        <button @click="showhide=false">Hide Instructions</button> <br>
        Click and Drag the Background or Scroll with the Mouse Wheel to Alter the Viewport <br>
        Click and Drag a Chemical to Move it in the Viewport <br>
        Click on a Chemical to Mark it and Display its Parents and Products <br>
        The Root of the Tree is Highlighted in Green <span style="color:#06c43c">&#9632;</span> and will Always be Displayed <br>
        Marked Chemicals are Highlighted in Blue <span style="color:#0072B2">&#9632;</span><br>
        Reactions where a Marked Chemical is a Parent are Drawn in Blue <span style="color:#0072B2">&#9632;</span><br>
        Reactions where a Marked Chemical is a Product are Drawn in Orange <span style="color:#D55E00">&#9632;</span> if the Parent is not Marked <br>
        Chemicals Highlighted in Red <span style="color:red">&#9632;</span> will Reveal more Chemicals if Marked<br>
        Chemicals Highlighted in Black <span style="color:black">&#9632;</span> will not Reveal more Chemicals<br>
        Reactions where Neither the Parent nor Product are Expanded are Drawn in Gray <span style="color:#6e6d6d">&#9632;</span><br>
        Use the Search Box to Search for a Chemical within the Map by DTXSID or Name, Matches will be Highlighted in Yellow <span style="color:yellow">&#9632;</span> <br>
        Click on a Map ID in the Table to Highlight all Reactions within that map in Purple <span style="color:#b50255">&#9632;</span><br>
    </div>
    <div v-else-if="(this.$route.params.searchtype == 'chemical')">
        <button @click="showhide=true">Show Instructions</button>
    </div>
    <!-- the grid setup is in the script section, the grid will only display if there are entries -->
    <div v-if="(this.$route.params.searchtype == 'chemical' && mapRowData.value.length > 0)">
        <ag-grid-vue
            class="ag-theme-balham"
            domLayout="autoHeight"
            :columnDefs="mapColDefs.value"
            :rowData="mapRowData.value"
            :enableBrowserTooltips="true"
            @grid-ready="onGridReady">>
        </ag-grid-vue> 
        <div v-if="(this.openMaps.length == 2)">
            <router-link v-bind:to="'/reaction/reactionmap/'+this.openMaps[0]+'_'+this.openMaps[1]+'/compare'">Compare Open Maps</router-link>
        </div>
        <div v-else-if="(this.openMaps.length == 3)">
            <router-link v-bind:to="'/reaction/reactionmap/'+this.openMaps[0]+'_'+this.openMaps[1]+'_'+this.openMaps[2]+'/compare'">Compare Open Maps</router-link>
        </div>
        <div v-else>
            Open Two or Three Maps to Compare Them
        </div>
    </div>
    <div v-if="(this.$route.params.searchtype == 'compare')">
        Map {{this.$route.params.searchinput.split('_')[0]}} <span style="color:#0072B2">&#9632;</span> <br>
        Map {{this.$route.params.searchinput.split('_')[1]}} <span style="color:#D55E00">&#9632;</span> <br>
        <div v-if="(this.$route.params.searchinput.split('_')[2])">
            Map {{this.$route.params.searchinput.split('_')[2]}} <span style="color:#b50255">&#9632;</span> <br>
        </div>
    </div>
    <button @click="openall()">Show All Chemicals</button>
    <button @click="closeall()">Hide All Chemicals</button> <br>
    Search this map by DTXSID or Name: <input style="width:100px" type="text" v-model="input"/>
    <button @click="searchmap(input)">Submit</button>
    <button @click="searchmap('qqqqqq')">Clear Search</button> <br>
    <button @click="handleMapExport()">Export Visible Map</button>
    <div id="graph"></div>
</template>

<script>

import {ref, reactive} from 'vue'
import { useRouter } from 'vue-router'
import ForceGraph from 'force-graph'
import axios from 'axios'
import {AgGridVue} from 'ag-grid-vue3'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'

export default {
    name: 'reactmap',
    components: {
        AgGridVue,
    },
    data(){
        const input = ref("");
        const mapRowData = reactive({
            value: []
        });
        const mapColDefs = reactive({
            value: []
        });

        // Defines the columns for AG Grid for the map comparison view 
        const compareColDefs = reactive({
            value: [
                {headerName:'Map ID', field:'map_ID', resizable: true, filter: 'agTextColumnFilter', width: 150},
                {headerName:'Species', field:'species', sortable: true, resizable: true, width:200},
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

        return {
            maps:'',
            searchstring:'',
            visibleNodes: [],
            openNodes: [],
            openMaps: [],
            highlightMaps: [],
            reactlist:[],
            rootid:'',
            Graph: '',
            input,
            mapColDefs,
            mapRowData,
            compareColDefs,
            showhide:false,
            chemname:'',
            chemical:'',
            gridApi:null,
            firstmap:'',
            maplist:[],
        }
    },
    computed: {
        chemurl() {
            return this.$apiname + "chemicals/" + this.$route.params.searchinput
        },
        mapurl() {
            return this.$apiname + "chemicals/maps/" + this.$route.params.searchinput
        },
        mapIDurl() {
            return this.$apiname + "reaction/mapid/" + this.$route.params.searchinput
        },
    },
    // get the chemical info and map info from the backend
    created: async function(){
        const chemResponse = await fetch(this.chemurl);
        const chemObject = await chemResponse.json();
        this.chemical = chemObject[0];
        
        if(this.$route.params.searchtype == 'chemical'){
            const mapResponse = await fetch(this.mapurl);
            const mapObject = await mapResponse.json();
            this.mapRowData.value = mapObject;
        }
        if(this.$route.params.searchtype == 'mapid'){
            const mapResponse = await fetch(this.mapIDurl);
            const mapObject = await mapResponse.json();
            this.firstmap = mapObject[0].reference;
        }
        if(this.$route.params.searchtype == 'compare'){
            for(let id of this.$route.params.searchinput.split('_')){
                const tempurl = this.$apiname + "reaction/mapid/" + id
                const mapResponse = await fetch(tempurl);
                const mapObject = await mapResponse.json();
                this.maplist.push(mapObject[0].reference)
            }
            
        }
    },
    mounted() {        
        this.mapColDefs.value = this.buildcolumns()

        this.visibleNodes = []
        this.openNodes = []
        this.reactlist = []
        this.searchstring = '____'

        // gets the map data from the backend, then sets up the forcegraph map
        fetch(this.$apiname + "reaction/reactionmap/" + this.$route.params.searchinput + "/" + this.$route.params.searchtype).then(res => res.json()).then(data => {
            // defines the graph and places it in the HTML element named 'graph'
            this.Graph = ForceGraph()(document.getElementById('graph'))
            const N = 10
            let k = 0
            if(this.$route.params.searchtype == 'chemical'){
                this.rootID = String(this.chemical.chemical_ID)
            }
            // defines a root node, either the chemical we entered with or the first chemical in the map, this node will always be visible
            const rootnode = (this.$route.params.searchtype == 'chemical' ? this.rootID : data.nodes[0]['id'])
            // sets up an object which keeps track of the visible nodes
            this.visibleNodes = [rootnode]
            this.Graph.width(window.innerWidth-115)
            this.Graph.backgroundColor('#a9b2ba')
            // necessary for snapping to the center
            this.Graph.autoPauseRedraw(false)
            // this makes the graph self organize into a useful tree when there are no cycles
            this.Graph.dagMode('td')
            this.Graph.dagLevelDistance(2.2*N)
            this.Graph.zoom(15)
            // gets the data for the graph
            this.Graph.graphData(data)
            this.Graph.nodeVal(1)
            this.Graph.cooldownTime(200)
            this.Graph.d3Force('charge').strength(-2)
            this.Graph.d3Force('link').distance(2*N)
            this.Graph.nodeId('id')
            // builds the node hover with image, name, and DTXSID
            this.Graph.nodeLabel(node => {
                const scrString = "<div style='text-align:center;'><img src='data:image/png;base64," + node.img + "' style='width:150px;height:150px;'/> <br>" + node.name + " </div>"
                return scrString
            })
            this.Graph.linkSource('source')
            this.Graph.linkTarget('target')
            this.Graph.nodeVisibility(node => this.visibleNodes.includes(node.id))
            // draws the nodes
            this.Graph.nodeCanvasObject(({img,x,y,id,name,neighbors}, ctx) => {
                const size=N; 
                // draws the highlighting box
                ctx.beginPath();
                ctx.moveTo(x-(N/2),y-(N/2));
                ctx.lineTo(x+(N/2),y-(N/2));
                ctx.lineTo(x+(N/2),y+(N/2));
                ctx.lineTo(x-(N/2),y+(N/2));
                ctx.lineTo(x-(N/2),y-(N/2)-(1)); //necessary to prevent blank corner
                ctx.lineWidth = 2;
                // color the node highlighting, first based on whether it is searched, then based on whether it is the root node, then whether it is open, then whether there is more information if it was to be opened, then finally a default black
                ctx.strokeStyle = (name.toLowerCase().includes(this.searchstring.toLowerCase())) ? 'yellow' : (id == rootnode & this.$route.params.searchtype == 'chemical') ? '#06c43c' : (this.openNodes.includes(id) ? '#0072B2' : (neighbors.some(node => !this.visibleNodes.includes(node))) ? 'red': 'black');
                ctx.stroke();
                // draws the image of the chemical
                ctx.drawImage(this.imgconvert(img), x-size/2, y-size/2, size, size);
                // while drawing nodes, centers the graph on the root for the first 50 ticks
                if(id == rootnode && k < 50){
                    this.Graph.centerAt(x,y)
                    k=k+1
                };
            })
            this.Graph.linkVisibility(false)
            this.Graph.linkWidth(2)
            this.Graph.linkDirectionalArrowLength(2)
            this.Graph.linkDirectionalArrowRelPos(0.6)
            // colors the links
            this.Graph.linkColor(link => {
                // for the comparison view, colors the maps differently
                if(this.$route.params.searchtype == 'compare'){
                    if(link.map == 0){return '#0072B2'} else if (link.map == 1){return '#D55E00'} else {return '#b50255'}
                } else
                // for the non-comparison view, colors highlighted maps
                if(this.reactlist.includes(link.reactID)){return '#b50255'} else
                // colors based on whether a parent or product is highlighted
                if(this.openNodes.includes(link.source.id)){return '#0072B2'} else
                if(this.openNodes.includes(link.target.id)){return '#D55E00'} else
                return ''
            })
            // curves the links for the comparison view
            this.Graph.linkCurvature(link => {
                if(this.$route.params.searchtype == 'compare'){
                    if(link.map == 0){return 0.05} else if (link.map == 1){return -0.05} else {return 0}
                } else 
                return 0
            })
            // turns off the forces when the engine stops so that you can drag nodes around without other nodes moving
            this.Graph.onEngineStop(() => 
                this.Graph.d3Force('charge',null),
                this.Graph.d3Force('link',null),
                this.Graph.d3Force('center',null))
            // fixes a node so that when you drag the node it stays in place after you release it
            this.Graph.onNodeDragEnd(node => { node.fx = node.x; node.fy = node.y;})
            // shows/hides the node's neighbors when you click on it
            this.Graph.onNodeClick(node => {
                // case for when the node is already open
                if (this.openNodes.includes(node.id)){
                    var $this = this;
                    // remove the node from the list of open nodes
                    this.openNodes = this.openNodes.filter(v => v != node.id);
                    // remove the neighbors from the visible list
                    // only removes one instance so if they have been opened manually or are shown by another map/neighbor they will remain visible
                    node.neighbors.forEach(function(v) {
                        const index = $this.visibleNodes.findIndex(x => x==v);
                        $this.visibleNodes.splice(index,1);
                    })
                    // removes the node from the visible list so it can be hidden again
                    this.visibleNodes.splice(this.visibleNodes.findIndex(x => x==node.id),1);
                } else {
                    // add the neighbors to the visible list
                    this.visibleNodes = this.visibleNodes.concat(node.neighbors);
                    // adds the node to the visible list so it can't be hidden while it is still open
                    this.visibleNodes = this.visibleNodes.concat(node.id);
                    // add the node to the list of open nodes
                    this.openNodes = [...new Set(this.openNodes.concat(node.id))];
                }
                // make sure the root node is always visible
                this.visibleNodes.concat(rootnode)
                // update the graph's nodes and links
                this.Graph.nodeVisibility(node => this.visibleNodes.includes(node.id));
                this.Graph.linkVisibility(link => this.visibleNodes.includes(link.source.id) && this.visibleNodes.includes(link.target.id));
            })
        });

        this.openall()
    },
    methods:{
        // returns an image object from a bas64 image string, used to get images as force-graph nodes
        imgconvert: function(img){
            const image = new Image();
            image.src = 'data:image/png;base64,'+ img;
            return image;
        },
        onGridReady(params) {
            this.gridApi = params.api;
            this.gridColumnApi = params.columnApi;
        },
        // a function for building JSONs for the gird's columns
        buildcolumns(){
            let new_cols = []
            // fixed rows for identifiers and structure image
            new_cols.push(
                {
                    headerName:'Show/Hide Map', 
                    field:'map_ID',
                    sortable: true, 
                    resizable: true,
                    width:250,
                    // code for coloring cells when they are included in an open map, forceRefresh necessary below
                    cellStyle: params => {
                        if(this.openMaps.includes(params.data.map_ID)){
                            return {backgroundColor:'#c7dbed'};
                        } else {
                            return {backgroundColor:''}
                        };
                    },
                    // code for setting up a link in the cell which emits an event which will show or hide the chemicals and reactions in a map
                    cellRenderer: (params) => {
                        var link = document.createElement('a');
                        if(params.data.map_ID != ''){
                            link.innerText = "Map "+params.data.map_ID;
                            link.href = '#'
                            link.addEventListener("click", e => {
                                e.preventDefault();
                                this.openmap(params.data.map_ID);
                            })
                        } else {
                            link.innerText = "No Map"
                        };
                        return link;
                    }
                },
                {
                    headerName:'Highlight Map', 
                    field:'map_ID',
                    sortable: true, 
                    resizable: true,
                    width:250,
                    // code for coloring cells when they are included in a highlighted map, forceRefresh necessary below
                    cellStyle: params => {
                        if(this.highlightMaps.includes(params.data.map_ID)){
                            return {backgroundColor:'#c7dbed'};
                        } else {
                            return {backgroundColor:''}
                        };
                    },
                    // code for setting up a link in the cell which emits an event which will highlight the chemicals and reactions in a map
                    cellRenderer: (params) => {
                        var link = document.createElement('a');
                        if(params.data.map_ID != ''){
                            link.innerText = "Map "+params.data.map_ID;
                            link.href = '#'
                            link.addEventListener("click", e => {
                                e.preventDefault();
                                this.highlightmap(params.data.map_ID);
                            })
                        } else {
                            link.innerText = "No Map"
                        };
                        return link;
                    }
                },
                {headerName:'Reference', field:'reference', sortable: true, resizable: true, filter: 'agTextColumnFilter', width:450},
            )
            return new_cols
        },
        // opens all nodes in the graph (JSON.pares(JSON.stringify()) syntax used because we are not in the graph object)
        openall: async function(){
            // get the list of all nodes in the graph and their neighbors
            const gData = await(fetch(this.$apiname + "reaction/reactionmap/" + this.$route.params.searchinput + "/" + this.$route.params.searchtype).then(res => res.json()).then(data => {return data}))
            gData.nodes.forEach(node => {
                // add nodes to the list of open and visible nodes
                this.openNodes = JSON.parse(JSON.stringify(this.openNodes)).concat(node.id);
                this.visibleNodes = JSON.parse(JSON.stringify(this.visibleNodes)).concat(node.id);
                // add each set of neighbors to the list of visible nodes again so that when a node is closed it doesn't remove nodes that should be visible from the map
                this.visibleNodes = JSON.parse(JSON.stringify(this.visibleNodes)).concat(node.neighbors);
                // faster way to open all nodes and links
                this.Graph.nodeVisibility(true);
                this.Graph.linkVisibility(true);
            })
            // update the cell color
            this.gridApi.refreshCells({force:true})
        },
        // opens/closes the nodes in a single pre-built map
        openmap: async function(id){
            // get the list of nodes and reactions within the map
            const mapreactions = await(fetch(this.$apiname + "reaction/mapid/" + id)).then(res => res.json());
            if(this.openMaps.includes(id)){
                // remove the map id from the list of open maps
                this.openMaps = this.openMaps.filter(v => v != id);
                // remove the parent and product for each link in the map from the list of visible nodes
                mapreactions.forEach( reaction => {
                    const x = JSON.stringify(reaction.parent_IDnum);
                    const index = this.reactlist.findIndex(v => v==x);
                    this.visibleNodes.splice(index,1);
                    const y = JSON.stringify(reaction.product_IDnum);
                    const index2 = this.reactlist.findIndex(v => v==y);
                    this.visibleNodes.splice(index2,1);
                    this.Graph.linkVisibility(link => this.visibleNodes.includes(link.source.id) && this.visibleNodes.includes(link.target.id));
                });
            } else{
                // add the map id to the list of open maps
                this.openMaps.push(id);
                // add the parent and product for each link in the map to the list of open nodes
                mapreactions.forEach(reaction => {
                    this.openNodes = JSON.parse(JSON.stringify(this.openNodes)).concat(reaction.parent_IDnum);
                    this.visibleNodes = JSON.parse(JSON.stringify(this.visibleNodes)).concat(reaction.parent_IDnum);
                    this.openNodes = JSON.parse(JSON.stringify(this.openNodes)).concat(reaction.product_IDnum);
                    this.visibleNodes = JSON.parse(JSON.stringify(this.visibleNodes)).concat(reaction.product_IDnum);
                    this.Graph.linkVisibility(link => this.visibleNodes.includes(link.source.id) && this.visibleNodes.includes(link.target.id));
                })
            }
            this.gridApi.refreshCells({force:true});
        },
        // highlights the links in a single pre-built map
        highlightmap: async function(id){
            // get the list of nodes and reactions within the map
            const mapreactions = await(fetch(this.$apiname + "reaction/mapid/" + id)).then(res => res.json());
            if(this.highlightMaps.includes(id)){
                // remove the map id from the list of highlighted maps
                this.highlightMaps = this.highlightMaps.filter(v => v != id);
                // remove the reaction id's within the map from the list of highlighted reactions
                mapreactions.forEach( reaction => {
                    const x = JSON.stringify(reaction.reaction_ID);
                    const index = this.reactlist.findIndex(v => v==x);
                    this.reactlist.splice(index,1);
                });
            } else{
                // add the map id to the list of highlighted maps
                this.highlightMaps.push(id);
                // add the reaction id's within the map to the list of highlighted reactions
                mapreactions.forEach(reaction => {
                    const x = JSON.stringify(reaction.reaction_ID);
                    this.reactlist.push(x);
                })
            }
            this.gridApi.refreshCells({force:true});
        },
        // adds a string that the graph will check against and highlight matches
        searchmap: async function(string){
            if(string.length > 0){
                this.searchstring = string
            } else{
                this.searchstring = 'qqqqqqqq'
            }
        },
        // closes all nodes except the root
        closeall: async function(){
            // get the list of nodes
            const gData = await(fetch(this.$apiname + "reaction/reactionmap/" + this.$route.params.searchinput + "/" + this.$route.params.searchtype).then(res => res.json()).then(data => {return data}))
            // determine the root node
            if(this.$route.params.searchtype == 'chemical'){
                this.rootID = String(this.chemical.chemical_ID)
            }
            const rootnode = (this.$route.params.searchtype == 'chemical' ? this.rootID : gData.nodes[0]['id'])
            // set open and visible maps, nodes, and links
            this.openNodes = [];
            this.openMaps = [];
            this.visibleNodes = [rootnode];
            this.Graph.nodeVisibility(node => this.visibleNodes.includes(node.id));
            this.Graph.linkVisibility(false);
            // update the cell color
            this.gridApi.refreshCells({force:true})
        },
        // function for exporting the reactions currently visible in the map
        handleMapExport: function(){
            axios
                // sends the map information to the backend
                .post(this.$apiname + "reaction/map_DL", {
                    searchtype : this.$route.params.searchtype,
                    mapid : this.$route.params.searchinput,
                    chemicals : this.openNodes,
                    responseType: 'blob',
                })
                // get the file setup by the backend and open a download window
                .then((res) => {
                    let data = res.data;
                    const blob = new Blob([data], { type: 'application/zip' })
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    if(this.$route.params.searchtype == 'mapid'){
                        link.download = 'reaction_map_'+this.$route.params.searchinput+'.csv'
                    }
                    else if(this.$route.params.searchtype == 'compare'){
                        link.download = 'reaction_map_comparison_'+this.$route.params.searchinput+'.csv'
                    }
                    else {
                        link.download = this.chemical.primary_name+'_reaction_map.csv'
                    }
                    link.click()
                });
        },
    },
}

</script>