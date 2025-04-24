<template>  
    <div style="font-size:25px">
        CheT Chemicals List<br><br>
    </div>
    <RouterLink v-if="$route.params.searchval == 'false'" :to="'/chemical/database/rows'">Grid View<br><br></RouterLink>
    <div v-if="$route.params.searchval == 'false'">
        <input style='width:245px' type="text" v-model="filterinput" @keyup.enter="$router.push('/chemical/database/tiles/1/' + filterinput)"/>
        <button @click="$router.push('/chemical/database/tiles/1/' + filterinput)">Filter Chemicals</button>
        <br><br>
    </div>
    <!-- tile view -->
    <div id="tiles">
        <!-- <button v-on:click="handleExport">Export Chemical List</button> <br><br>  -->
        <span v-if="biglen != 0">
            <br>{{ exactlen }} Total Results Returned: <br>
            Page: <RouterLink :to="'/chemical/database/tiles/'+ (this.$route.params.pagenum-1) + '/' + this.$route.params.searchval" v-if="this.$route.params.pagenum != 1">&#60;</RouterLink>
            <span v-for="i in biglen">
                &nbsp;<span v-if="i != 1">, </span>
                <span v-if="i == this.$route.params.pagenum">{{i}}</span>
                <RouterLink v-if="i != this.$route.params.pagenum" :to="'/chemical/database/tiles/' + i + '/' + this.$route.params.searchval">{{i}}</RouterLink>
            </span>&nbsp;
            <RouterLink :to="'/chemical/database/tiles/'+ (parseInt(this.$route.params.pagenum)+1) + '/' + this.$route.params.searchval" v-if="this.$route.params.pagenum != biglen">&#62;</RouterLink>
        </span>
        <div class="tileset">
        <!-- tile formatting is handled mostly by the css styling -->
        <div class="dbtile" v-for="row in filteredlist">
            <p style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">Name: <router-link v-bind:to="'/chemical/'+row.dtxsid"> {{row.primary_name}} </router-link> </p>
            <p><img v-bind:src="'data:image/png;base64,'+row.image" v-on:click="magnify(['data:image/png;base64,'+row.image,row.primary_name])" alt="missing image" style="display: block; margin-left: auto; margin-right: auto; width:150px; height:150px;" />
            DTXSID: <a :href="'https://comptox.epa.gov/dashboard/chemical/details/' + row.dtxsid" target="_blank"> {{row.dtxsid}} ↗</a> <br>
            <img v-if="row.representative.includes('DTXSID')" src="../additional_chemicals.png" style="position:relative; top:-180px; left:160px; z-index:10; width:25px; height:25px"/>
            <RouterLink :to="'/reaction/searchresults/' + row.dtxsid + '/ID/false'"> {{getcount(row.chemical_ID)}} Associated Reactions</RouterLink><br>
            <span v-if="show_array[row.dtxsid]==true">Maps: <span v-for="(i,i_index) in maps_array[row.dtxsid]"><RouterLink :to="'/reaction/reactionmap/'+i+'/mapid'">{{ i }}</RouterLink><span v-if="i_index < maps_array[row.dtxsid].length-1">, </span></span></span></p>
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

    import {ref} from 'vue'
    import axios from "axios"

    export default {
        name: 'chemtiles',
        data () {        
            // input needs to be reactive for filtering to work
            const input = ref("");
            return {
                bigout:'',
                biglen:0,
                exactlen:0,
                input,
                showhide: false,
                filterinput:'',
                srcvar:'',
                srcname:'',
                timer:true,
                countsdata:[],
                maps_array:{},
                show_array:{},
            }
        },
        // get the database JSON from the backend
        created: async function(){
            try{
                const url = this.$apiname + "chemicals/database/"+this.$route.params.pagenum+'/'+this.$route.params.searchval;
                const gResponse = await fetch(url, {mode:'cors'});
                const gObject = await gResponse.json();
                this.bigout = gObject.data;
                this.biglen = Math.ceil(gObject.length/100);
                this.exactlen = gObject.length
            } catch (error){
                this.timer = false
            }
            if(this.timer != false){
                // for some reason this try/catch block is not supressing error messages from empty maplists
                // also for some reason there is an error message when empty maplists are returned
                for(let i of this.bigout){
                    try{
                        this.parsemaps(i.dtxsid)
                    } catch {
                        
                    }
                }
            }
        },
        mounted() {
            const counturl = this.$apiname + "chemicals/counts"
            fetch(counturl, {mode:'cors'})
                .then((result) => result.json())
                .then((remoteRowData) => (this.countsdata = remoteRowData));
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
                                || item.dtxsid?.toLowerCase() == v
                                || item.inchi?.toLowerCase() == v
                                || item.inchi?.toLowerCase().split('-')[0] == v
                                || item.casrn?.toLowerCase() == v
                                || item.casrn?.toLowerCase().split('_')[1] == v
                                || item.other_names?.toLowerCase().includes(v));
                    });
                } else {
                // don't filter if there's no input
                return this.bigout
                }
            },
        },
        methods: {
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
            // code for zooming on a chemical, sets the image in the popup window to the clicked item then shows the popup
            magnify(x) {
                this.srcvar = x[0];
                this.srcname = x [1];
                this.showhide=true;
            },
            // code for getting a list of maps based on the dtxsid
            async parsemaps(dtxsid){
                if(dtxsid != undefined){
                    let res = await fetch(this.$apiname + "chemicals/maps/" + dtxsid, {mode:'cors'})
                    let obj = await res.json()
                    let retvalue = obj
                    this.maps_array[dtxsid] = []
                    for(let i in retvalue){
                        this.maps_array[dtxsid][i] = retvalue[i]['map_ID']
                    }
                    if(retvalue.length != 0){
                        this.show_array[dtxsid] = true
                    } else {
                        this.show_array[dtxsid] = false
                    }
                }
            },
            // code for counting how many reactions correspond to each chemical
            getcount(id){
                let countOut = 0
                let libs = this.countsdata.filter(x => x.chemical_ID == id)
                for(let lib of libs){
                    countOut = countOut + lib.chem_lib_count
                }
                return(countOut)
            }
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
.dbtile {
  width: 215px;
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
</style>