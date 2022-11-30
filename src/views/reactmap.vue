<template>
    <h2 v-if="this.$route.params.searchtype == 'chemical'">
        Reaction Map For {{chemical.primary_name}}
    </h2>
    <h2 v-else>
        Reaction Map {{this.$route.params.searchinput}}
    </h2>
    <div v-if="showhide">
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
    <div v-else>
        <button @click="showhide=true">Show Instructions</button>
    </div>
    <div v-if="this.$route.params.searchtype == 'chemical'">
        <ag-grid-vue
            class="ag-theme-balham"
            domLayout="autoHeight"
            :columnDefs="metapathColDefs.value"
            :rowData="rowData.value"
            :enableBrowserTooltips="true">
        </ag-grid-vue>
    </div>
    <button @click="openall()">Show All Chemicals</button>
    <button @click="closeall()">Hide All Chemicals</button> <br>
    Search this map by DTXSID or Name: <input style="width:100px" type="text" v-model="input"/>
    <button @click="searchmap(input)">Submit</button>
    <button @click="searchmap('qqqqqq')">Clear Search</button> <br>
    <button @click="handleMapExport()">Export Visible Map</button>
    <div v-if="openMaps.length > 0">Open Maps: {{openMaps}}</div>
    <div id="graph"></div>
</template>

<script>

import {ref, reactive, onMounted, inject} from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
        const detailurl = this.$apiname + "chemicals/mapinfo/" + useRoute().params.searchinput;
        const rowData = reactive({
            value: [],
        });
        const metapathColDefs = reactive({
            value: [
                {
                    headerName:'Show/Hide Map', 
                    field:'mapid', 
                    resizable: true, 
                    filter: 'agTextColumnFilter', 
                    width: 150,
                    cellRenderer: (params) => {
                        var link = document.createElement('a');
                        if(params.data.mapid != ''){
                            link.innerText = "Map "+params.data.mapid;
                            link.href = '#'
                            link.addEventListener("click", e => {
                                e.preventDefault();
                                this.openmap(params.data.mapid);
                            })
                        } else {
                            link.innerText = "No Map"
                        };
                        return link;
                    }
                },
                {
                    headerName:'Highlight Map', 
                    field:'mapid', 
                    resizable: true, 
                    filter: 'agTextColumnFilter', 
                    width: 150,
                    cellRenderer: (params) => {
                        var link = document.createElement('a');
                        if(params.data.mapid != ''){
                            link.innerText = "Map "+params.data.mapid;
                            link.href = '#'
                            link.addEventListener("click", e => {
                                e.preventDefault();
                                this.highlightmap(params.data.mapid);
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
            rowData,
            Graph: '',
            input,
            metapathColDefs,
            detailurl,
            showhide:false,
            chemname:'',
            chemical:'',
        }
    },
    computed: {
        url() {
            return this.$apiname + "chemicals/mapinfo/" + this.$route.params.searchinput
        },
        chemurl() {
            return this.$apiname + "chemicals/" + this.$route.params.searchinput
        },
    },
    created: async function(){
        const gResponse = await fetch(this.url);
        const gObject = await gResponse.json();
        this.maps = gObject;
        const chemResponse = await fetch(this.chemurl);
        const chemObject = await chemResponse.json();
        this.chemical = chemObject[0];
    },
    mounted() {        
        this.visibleNodes = []
        this.openNodes = []
        this.reactlist = []
        this.searchstring = '____'

        fetch(this.detailurl).then((result) => result.json()).then((remoteRowData) => (this.rowData.value = remoteRowData));
        
        fetch(this.$apiname + "reaction/reactionmap/" + this.$route.params.searchinput + "/" + this.$route.params.searchtype).then(res => res.json()).then(data => {
            this.Graph = ForceGraph()(document.getElementById('graph'))
            const N = 10
            let k = 0
            const rootnode = (this.$route.params.searchtype == 'chemical' ? this.$route.params.searchinput : data.nodes[0]['id'])
            this.visibleNodes = [rootnode]
            this.Graph.width(window.innerWidth-115)
            this.Graph.backgroundColor('#a9b2ba')
            this.Graph.autoPauseRedraw(false)
            this.Graph.dagMode('td')
            this.Graph.dagLevelDistance(2.2*N)
            this.Graph.zoom(15)
            this.Graph.graphData(data)
            this.Graph.nodeVal(1)
            this.Graph.cooldownTime(200)
            this.Graph.d3Force('charge').strength(-2)
            this.Graph.d3Force('link').distance(2*N)
            this.Graph.nodeId('id')
            this.Graph.nodeLabel(node => {
                const scrString = "<div style='text-align:center;'><img src='data:image/png;base64," + node.img + "' style='width:150px;height:150px;'/> <br>" + node.name + " </div>"
                return scrString
            })
            this.Graph.linkSource('source')
            this.Graph.linkTarget('target')
            this.Graph.nodeVisibility(node => this.visibleNodes.includes(node.id))
            this.Graph.nodeCanvasObject(({img,x,y,id,name,neighbors}, ctx) => {
                const size=N; 
                ctx.beginPath();
                ctx.moveTo(x-(N/2),y-(N/2));
                ctx.lineTo(x+(N/2),y-(N/2));
                ctx.lineTo(x+(N/2),y+(N/2));
                ctx.lineTo(x-(N/2),y+(N/2));
                ctx.lineTo(x-(N/2),y-(N/2)-(1)); //necessary to prevent blank corner
                ctx.lineWidth = 2;
                ctx.strokeStyle = (name.toLowerCase().includes(this.searchstring.toLowerCase())) ? 'yellow' : (id == rootnode) ? '#06c43c' : (this.openNodes.includes(id) ? '#0072B2' : (neighbors.some(node => !this.visibleNodes.includes(node))) ? 'red': 'black');
                ctx.stroke();
                ctx.drawImage(this.imgconvert(img), x-size/2, y-size/2, size, size);
                if(id == rootnode && k < 100){
                    this.Graph.centerAt(x,y)
                    k=k+1
                };
            })
            this.Graph.linkVisibility(false)
            this.Graph.linkWidth(2)
            this.Graph.linkDirectionalArrowLength(2)
            this.Graph.linkDirectionalArrowRelPos(0.6)
            this.Graph.linkColor(link => {
                if(this.reactlist.includes(link.reactID)){return '#b50255'} else
                if(this.openNodes.includes(link.source.id)){return '#0072B2'} else
                if(this.openNodes.includes(link.target.id)){return '#D55E00'} else
                return ''
            })
            this.Graph.onEngineStop(() => 
                this.Graph.d3Force('charge',null),
                this.Graph.d3Force('link',null),
                this.Graph.d3Force('center',null))
            this.Graph.onNodeDragEnd(node => { node.fx = node.x; node.fy = node.y;})
            this.Graph.onNodeClick(node => {
                if (this.openNodes.includes(node.id)){
                    var $this = this;
                    this.openNodes = this.openNodes.filter(v => v != node.id);
                    node.neighbors.forEach(function(v) {
                        const index = $this.visibleNodes.findIndex(x => x==v);
                        $this.visibleNodes.splice(index,1);
                    })
                    this.visibleNodes.splice(this.visibleNodes.findIndex(x => x==node.id),1);
                } else {
                    this.visibleNodes = this.visibleNodes.concat(node.neighbors);
                    this.visibleNodes = this.visibleNodes.concat(node.id);
                    this.openNodes = [...new Set(this.openNodes.concat(node.id))];
                }
                this.visibleNodes.concat(rootnode)
                this.Graph.nodeVisibility(node => this.visibleNodes.includes(node.id));
                this.Graph.linkVisibility(link => this.visibleNodes.includes(link.source.id) && this.visibleNodes.includes(link.target.id));
            })
        });
    },
    methods:{
        imgconvert: function(img){
            const image = new Image();
            image.src = 'data:image/png;base64,'+ img;
            return image;
        },
        openall: async function(){
            const gData = await(fetch(this.$apiname + "reaction/reactionmap/" + this.$route.params.searchinput + "/" + this.$route.params.searchtype).then(res => res.json()).then(data => {return data}))
            gData.nodes.forEach(node => {
                this.openNodes = JSON.parse(JSON.stringify(this.openNodes)).concat(node.id);
                this.visibleNodes = JSON.parse(JSON.stringify(this.visibleNodes)).concat(node.neighbors);
                this.visibleNodes = JSON.parse(JSON.stringify(this.visibleNodes)).concat(node.id);
                this.Graph.nodeVisibility(true);
                this.Graph.linkVisibility(true);
            })
        },
        openmap: async function(id){
            const mapreactions = await(fetch(this.$apiname + "reaction/mapid/" + id)).then(res => res.json());
            if(this.openMaps.includes(id)){
                this.openMaps = this.openMaps.filter(v => v != id);
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
                this.openMaps.push(id);
                console.log(mapreactions);
                mapreactions.forEach(reaction => {
                    this.openNodes = JSON.parse(JSON.stringify(this.openNodes)).concat(reaction.parent_IDnum);
                    this.visibleNodes = JSON.parse(JSON.stringify(this.visibleNodes)).concat(reaction.parent_IDnum);
                    this.openNodes = JSON.parse(JSON.stringify(this.openNodes)).concat(reaction.product_IDnum);
                    this.visibleNodes = JSON.parse(JSON.stringify(this.visibleNodes)).concat(reaction.product_IDnum);
                    this.Graph.linkVisibility(link => this.visibleNodes.includes(link.source.id) && this.visibleNodes.includes(link.target.id));
                })
            }
        },
        highlightmap: async function(id){
            const mapreactions = await(fetch(this.$apiname + "reaction/mapid/" + id)).then(res => res.json());
            if(this.highlightMaps.includes(id)){
                this.highlightMaps = this.highlightMaps.filter(v => v != id);
                mapreactions.forEach( reaction => {
                    const x = JSON.stringify(reaction.reaction_id);
                    const index = this.reactlist.findIndex(v => v==x);
                    this.reactlist.splice(index,1);
                });
            } else{
                this.highlightMaps.push(id);
                mapreactions.forEach(reaction => {
                    const x = JSON.stringify(reaction.reaction_id);
                    this.reactlist.push(x);
                })
            }
        },
        searchmap: async function(string){
            if(string.length > 0){
                this.searchstring = string
            } else{
                this.searchstring = 'qqqqqqqq'
            }
        },
        closeall: async function(){
            const gData = await(fetch(this.$apiname + "reaction/reactionmap/" + this.$route.params.searchinput + "/" + this.$route.params.searchtype).then(res => res.json()).then(data => {return data}))
            const rootnode = (this.$route.params.searchtype == 'chemical' ? this.$route.params.searchinput : gData.nodes[0]['id'])
            this.openNodes = [];
            this.visibleNodes = [rootnode];
            this.Graph.nodeVisibility(node => this.visibleNodes.includes(node.id));
            this.Graph.linkVisibility(false);
        },
        handleMapExport: function(){
            console.log(this.$route.params.searchtype)
            console.log(this.visibleNodes)
            
            axios
                .post(this.$apiname + "reaction/map_DL", {
                    searchtype : this.$route.params.searchtype,
                    mapid : this.$route.params.searchinput,
                    chemicals : this.visibleNodes,
                    responseType: 'blob',
                })
                .then((res) => {
                    let data = res.data;
                    const blob = new Blob([data], { type: 'application/zip' })
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = this.input+'_chemical_list.csv'
                    link.click()
                });
        },
    },
}

</script>