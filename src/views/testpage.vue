<template>
    <div id="graph"></div>
</template>

<script>

import ForceGraph from 'force-graph'

export default {
    name: 'testpage',
    mounted() {
        fetch(this.$apiname + "reaction/reactionmap/181/chemical").then(res => res.json()).then(data => {
            const Graph = ForceGraph()(document.getElementById('graph'))
            const N = 10
            Graph.dagMode('td')
            Graph.dagLevelDistance(2.2*N)
            Graph.width(window.innerWidth-115)
            Graph.zoom(9)
            Graph.graphData(data)
            Graph.nodeVal(1)
            Graph.cooldownTime(300)
            Graph.d3Force('charge').strength(-20)
            Graph.d3Force('link').distance(2*N)
            Graph.nodeId('id')
            Graph.nodeLabel('name')
            Graph.linkSource('source')
            Graph.linkTarget('target')
            Graph.nodeCanvasObject(({img,x,y}, ctx) => {
                const size=N; 
                ctx.drawImage(this.imgconvert(img), x-size/2, y-size/2, size, size);})
            Graph.nodePointerAreaPaint((node,color,ctx) => {
                const size=N; 
                ctx.fillStyle=color;ctx.fillRect(node.x - size/2, node.y -size/2,size,size);})
            Graph.linkDirectionalArrowLength(2)
            Graph.onEngineStop(() => 
                Graph.d3Force('charge',null),
                Graph.d3Force('link',null),
                Graph.d3Force('center',null))
            Graph.onNodeDragEnd(node => { node.fx = node.x; node.fy = node.y;})
            Graph.backgroundColor('#8b9eb0')
        });
    },
    methods:{
        imgconvert: function(img){
            const image = new Image();
            image.src = 'data:image/png;base64,'+ img;
            return image;
        }
    }
}

</script>