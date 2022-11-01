<template>
    Click on a Chemical to Expand the Tree <br>
    Currently Expanded Nodes are Highlighted in Blue <br>
    Reactions where the Highlighted Chemical is a Parent are Highlighted in Blue <br>
    Reactions where the Highlighted Chemical is a Product are Highlighted in Orange <br>
    <button v-on:click="openall()">Expand All Nodes</button><button v-on:click="closeall()">Close All Nodes</button>
    <div id="graph"></div>
</template>

<script>

import ForceGraph from 'force-graph'

export default {
    name: 'reactmap',
    data(){
        return {
            visibleNodes: [],
            openNodes: [],
            Graph: '',
        }
    },
    mounted() {        
        this.visibleNodes = [this.$route.params.searchinput]
        this.openNodes = []
        
        fetch(this.$apiname + "reaction/reactionmap/" + this.$route.params.searchinput + "/" + this.$route.params.searchtype).then(res => res.json()).then(data => {
            this.Graph = ForceGraph()(document.getElementById('graph'))
            const N = 10
            this.Graph.width(window.innerWidth-115)
            this.Graph.backgroundColor('#a9b2ba')
            this.Graph.autoPauseRedraw(false)
            this.Graph.dagMode('td')
            this.Graph.dagLevelDistance(2.2*N)
            this.Graph.zoom(15)
            this.Graph.graphData(data)
            this.Graph.nodeVal(1)
            this.Graph.cooldownTime(100)
            this.Graph.d3Force('charge').strength(-2)
            this.Graph.d3Force('link').distance(2*N)
            this.Graph.nodeId('id')
            this.Graph.nodeLabel('name')
            this.Graph.linkSource('source')
            this.Graph.linkTarget('target')
            this.Graph.nodeVisibility(node => this.visibleNodes.includes(node.id))
            this.Graph.nodeCanvasObject(({img,x,y,id}, ctx) => {
                const size=N; 
                ctx.beginPath();
                ctx.moveTo(x-(N/2),y-(N/2));
                ctx.lineTo(x+(N/2),y-(N/2));
                ctx.lineTo(x+(N/2),y+(N/2));
                ctx.lineTo(x-(N/2),y+(N/2));
                ctx.lineTo(x-(N/2),y-(N/2)-0.14); //0.14 necessary to prevent blank corner
                ctx.lineWidth = 0.3;
                ctx.strokeStyle = this.openNodes.includes(id) ? '#0072B2' : 'transparent';
                ctx.stroke();
                ctx.drawImage(this.imgconvert(img), x-size/2, y-size/2, size, size);})
            this.Graph.linkVisibility(false)
            this.Graph.linkWidth(2)
            this.Graph.linkDirectionalArrowLength(2)
            this.Graph.linkDirectionalArrowRelPos(0.6)
            this.Graph.linkColor(link => {
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
                this.Graph.nodeVisibility(true);
                this.Graph.linkVisibility(true);
            })
        },
        closeall: async function(){
            this.openNodes = [];
            this.visibleNodes = [this.$route.params.searchinput];
            this.Graph.nodeVisibility(node => this.visibleNodes.includes(node.id));
            this.Graph.linkVisibility(false);
        },
    }
}

</script>