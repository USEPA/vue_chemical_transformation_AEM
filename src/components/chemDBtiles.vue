<template>
    Search: <input type="text" list="typeaheadlist" v-model="input" placeholder="Name, DTXSID, CASRN, inchi key" /> <br>
    <datalist id="typeaheadlist">
        <option v-for="row in bigout" :value="row.dtxsid" :label="row.primary_name"></option>
    </datalist>
    <br>
    <div class="tileset">
    <div class="tile" v-for="row in filteredlist">
        <p style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">Name: <router-link v-bind:to="'/chemical/'+row.local_IDnum"> {{row.primary_name}} </router-link> </p>
        <p><img v-bind:src="'data:image/png;base64,'+row.image" alt="missing image" style="display: block; margin-left: auto; margin-right: auto; width:150px; height:150px;" /> </p>
        <p>DTXSID: <a :href="'https://comptox.epa.gov/dashboard/chemical/details/' + row.dtxsid" target="_blank"> {{row.dtxsid}} ↗</a></p>
    </div>
    </div>
</template>

<script>

import {ref} from 'vue';

export default {
    name: 'ChemDBtiles',
    data () {        
        const input = ref("");
        return {
            bigout: '',
            input,
        }
    },
    created: async function(){
        const url = this.$apiname + "chemicals/database";
        const gResponse = await fetch(url);
        const gObject = await gResponse.json();
        this.bigout = gObject;
    },
    computed: {
        filteredlist() {
            if (this.input) {
                return this.bigout.filter((item) => {
                    return this.input
                        .toLowerCase()
                        .split(" ")
                        .every((v) => 
                            item.primary_name?.toLowerCase().includes(v)
                            || item.dtxsid?.toLowerCase().includes(v)
                            || item.inchi?.toLowerCase().includes(v)
                            || item.casrn?.toLowerCase().includes(v));
                });
            } else {
                return this.bigout
            }
        },
    },
}

</script>

<style>

.tileset {
  display: flex;
  flex-flow: row wrap;
  justify-content: left;
  margin: auto;
  margin-top:30px;
  max-width: calc(6 * 275px);
}

.tile {
  width: 205px;
  height: 225px;
  border: 2px solid darkblue;
  box-sizing: border-box;
  position: relative;
}

</style>