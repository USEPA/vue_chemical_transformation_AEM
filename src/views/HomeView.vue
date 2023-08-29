<template>
    <main>
        <p style="text-align:center">Welcome to the Chemical Transformations Database</p> <br><br>
    </main>
    <body>
        <div style="text-align:center; color:white; background-color:#0e6993; padding-top:30px; margin-right:32%; margin-left:32%;">
            Search: &nbsp; &nbsp;<input style='width:245px' type="text" list="typeaheadlist" v-model="input" @input="select_search()" @keyup.enter="$router.push('/reaction/searchresults/' + input + '/any')" placeholder="Name, DTXSID, CASRN, InChI key" /> <br><br> <!-- CASRN -->
            <!-- Suggested Search, substring match on various identifiers -->
            <datalist v-if="input.length > 2" id="typeaheadlist">
                <option v-for="row in bigout" :value="row.dtxsid" :label="row.primary_name + '  CASRN:  ' + row.casrn"></option>
            </datalist>
            <button @click="$router.push('/reaction/searchresults/' + input + '/any')">Search</button> <br><br>
        </div>
        <div style="font-size:small">
            <br><br><br><br><br><br><br>
            This resource is a compilation of information sourced from many databases and literature sources, including U.S. Federal and 
            state sources and international bodies, which can save the user time by providing information in one location. The data are not 
            fully reviewed by USEPA – the user must apply judgment in use of the information. You should consult the original scientific 
            paper or data source if possible.
            <br><br>
            Reference herein to any specific commercial products, process, or service by trade name, trademark, manufacturer, or otherwise, 
            does not necessarily constitute or imply its endorsement, recommendation, or favoring by the United States Government. The 
            views and opinions of the developers of the site expressed herein do not necessarily state or reflect those of the United States 
            Government, and shall not be used for advertising or product endorsement purposes.
            <br><br>
            With respect to documents available from this server, neither the United States Government nor any of their employees, 
            makes any warranty, express or implied, including the warranties of merchantability and fitness for a particular purpose, or 
            assumes any legal liability or responsibility for the accuracy, completeness, or usefulness of any information, apparatus, 
            product, or process disclosed, or represents that its use would not infringe privately owned rights.
        </div>
    </body>
</template>

<script>

import {ref} from 'vue'

export default {
    name: 'chemdatabase',
    data () {        
        const input = ref("");
        return {
            bigout: '',
            input,
            optionlength: '',
        }
    },
    // get the chemical info from the backend for the suggested search list
    created: async function(){
        const url = this.$apiname + "chemicals/database";
        const gResponse = await fetch(url);
        const gObject = await gResponse.json();
        this.bigout = gObject;
    },
    methods:{
        // function for firing a search when a single chemical is selected by DTXSID
        select_search(){
            if(this.bigout.filter(x => x.dtxsid.includes(this.input)).length == 1 && this.bigout.filter(x => x.dtxsid == this.input).length == 1){
                this.$router.push('/reaction/searchresults/' + this.input + '/any')
            }
        }
    },
}

</script>