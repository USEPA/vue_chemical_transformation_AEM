<template>
    <div v-if="(showhide && this.searchtype != 'compare')">
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
    <div v-else-if="(this.searchtype == 'chemical')">
        <button @click="showhide=true">Show Instructions</button>
    </div>
    <div v-if="(this.searchtype == 'compare')">
        Map {{this.searchval.split('_')[0]}} <span style="color:#0072B2">&#9632;</span> <br>
        Map {{this.searchval.split('_')[1]}} <span style="color:#D55E00">&#9632;</span> <br>
        <div v-if="(this.searchval.split('_')[2])">
            Map {{this.searchval.split('_')[2]}} <span style="color:#b50255">&#9632;</span> <br>
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
import ForceGraph from 'force-graph'
import axios from 'axios'

export default {
    name: 'inset_map',
    props:{
        searchtype: String,
        searchval: String,
    },
    data(){
        const input = ref("");

        return {
            maps:'',
            searchstring:'',
            visibleNodes: [],
            openNodes: [],
            openMaps: [],
            rootid:'',
            Graph: '',
            input,
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
            return this.$apiname + "chemicals/" + this.searchval
        },
        mapurl() {
            return this.$apiname + "chemicals/maps/" + this.searchval
        },
        mapIDurl() {
            return this.$apiname + "reaction/mapid/" + this.searchval
        },
    },
    // get the chemical info and map info from the backend
    created: async function(){
        const chemResponse = await fetch(this.chemurl, {mode:'cors'});
        const chemObject = await chemResponse.json();
        this.chemical = chemObject[0];
        

        if(this.searchtype == 'mapid'){
            const mapResponse = await fetch(this.mapIDurl, {mode:'cors'});
            const mapObject = await mapResponse.json();
            this.firstmap = mapObject[0].reference;
        }
        if(this.searchtype == 'compare'){
            for(let id of this.searchval.split('_')){
                const tempurl = this.$apiname + "reaction/mapid/" + id
                const mapResponse = await fetch(tempurl, {mode:'cors'});
                const mapObject = await mapResponse.json();
                this.maplist.push(mapObject[0].reference)
            }
            
        }
        console.log(this.searchtype,this.searchval)
    },
    mounted() {        

        this.visibleNodes = []
        this.openNodes = []
        this.searchstring = '____'

        // gets the map data from the backend, then sets up the forcegraph map
        fetch(this.$apiname + "reaction/reactionmap/" + this.searchval + "/" + this.searchtype, {mode:'cors'}).then(res => res.json()).then(data => {
            // defines the graph and places it in the HTML element named 'graph'
            this.Graph = ForceGraph()(document.getElementById('graph'))
            const N = 10
            let k = 0
            if(this.searchtype == 'chemical'){
                this.rootID = String(this.chemical.chemical_ID)
            }
            // defines a root node, either the chemical we entered with or the first chemical in the map, this node will always be visible
            const rootnode = (this.searchtype == 'chemical' ? this.rootID : data.nodes[0]['id'])
            // sets up an object which keeps track of the visible nodes
            this.visibleNodes = [rootnode]
            this.Graph.width(window.innerWidth-115)
            this.Graph.backgroundColor('#a9b2ba')
            // necessary for snapping to the center
            //this.Graph.autoPauseRedraw(false)
            // this makes the graph self organize into a useful tree when there are no cycles
            this.Graph.dagMode('td')
            this.Graph.dagLevelDistance(2.2*N)
            //this.Graph.zoom(15)
            // gets the data for the graph
            this.Graph.graphData(data)
            this.Graph.nodeVal(1)
            this.Graph.cooldownTime(200)
            this.Graph.d3Force('charge').strength(-2)
            this.Graph.d3Force('link').distance(2*N)
            this.Graph.nodeId('id')
            // builds the node hover with image, name, and DTXSID
            this.Graph.nodeLabel(node => {
                const scrString = "<div style='text-align:center;'><img src='data:image/png;base64," + node.img + "' style='width:200px;height:200px;'/> <br>" + node.name + " </div>"
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
                // color the node
                ctx.strokeStyle = this.highlightColors(name,id,neighbors,rootnode);
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
                if(this.searchtype == 'compare'){
                    if(link.map == 0){return '#0072B2'} else if (link.map == 1){return '#D55E00'} else {return '#b50255'}
                } else
                // colors based on whether a parent or product is highlighted
                if(this.openNodes.includes(link.source.id)){return '#0072B2'} else
                if(this.openNodes.includes(link.target.id)){return '#D55E00'} else
                return ''
            })
            // curves the links for the comparison view
            this.Graph.linkCurvature(link => {
                if(this.searchtype == 'compare'){
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
        // function for choosing highlight color, separated out because SONARQUBE is acting up
        highlightColors(name,id,neighbors,rootnode){
            if (name.toLowerCase().includes(this.searchstring.toLowerCase())) {
                return 'yellow'
            } else if(id == rootnode && this.searchtype == 'chemical') {
                return '#06c43c'
            } else if(this.openNodes.includes(id)){
                return '#0072B2'
            } else if(neighbors.some(node => !this.visibleNodes.includes(node))){
                return 'red'
            } else {
                return 'black'
            }
        },
        // opens all nodes in the graph (JSON.pares(JSON.stringify()) syntax used because we are not in the graph object)
        openall: async function(){
            // get the list of all nodes in the graph and their neighbors
            const gData = await(fetch(this.$apiname + "reaction/reactionmap/" + this.searchval + "/" + this.searchtype, {mode:'cors'}).then(res => res.json()).then(data => {return data}))
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
            this.Graph.zoomToFit(0,5)
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
            const gData = await(fetch(this.$apiname + "reaction/reactionmap/" + this.searchval + "/" + this.searchtype, {mode:'cors'}).then(res => res.json()).then(data => {return data}))
            // determine the root node
            if(this.searchtype == 'chemical'){
                this.rootID = String(this.chemical.chemical_ID)
            }
            const rootnode = (this.searchtype == 'chemical' ? this.rootID : gData.nodes[0]['id'])
            // set open and visible maps, nodes, and links
            this.openNodes = [];
            this.openMaps = [];
            this.visibleNodes = [rootnode];
            this.Graph.nodeVisibility(node => this.visibleNodes.includes(node.id));
            this.Graph.linkVisibility(false);
        },
        // function for exporting the reactions currently visible in the map
        handleMapExport: function(){
            axios
                // sends the map information to the backend
                .post(this.$apiname + "reaction/map_DL", {
                    searchtype : this.searchtype,
                    mapid : this.searchval,
                    chemicals : this.openNodes,
                    responseType: 'blob',
                })
                // get the file setup by the backend and open a download window
                .then((res) => {
                    let data = res.data;
                    const blob = new Blob([data], { type: 'application/zip' })
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    if(this.searchtype == 'mapid'){
                        link.download = 'reaction_map_'+this.searchval+'.csv'
                    }
                    else if(this.searchtype == 'compare'){
                        link.download = 'reaction_map_comparison_'+this.searchval+'.csv'
                    }
                    else {
                        link.download = this.chemical.primary_name+'_reaction_map_'+Date.now()+'.csv' 
                    }
                    link.click()
                });
        },
    },
}

</script>