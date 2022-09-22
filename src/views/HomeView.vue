<template>
  <main>
    <p style="text-align:center">Welcome to the Chemical Transformations Database</p> <br><br>
  </main>
  <body>
    <form style="text-align:center; color:white; background-color:#0e6993; padding-top:30px; margin-right:32%; margin-left:32%;">
      Search: &nbsp; &nbsp;<input style='width:245px' type="text" list="typeaheadlist" v-model="input" placeholder="Name, DTXSID, CASRN, InChI key" /> <br><br> <!-- CASRN -->
      <datalist id="typeaheadlist">
        <option v-for="row in bigout" :value="row.dtxsid" :label="row.primary_name"></option>
      </datalist>
      <button type="submit" @click="$router.push('/reaction/searchresults/' + input + '/any')">Submit</button> <br><br>
    </form>
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
        }
    },
    created: async function(){
        const url = this.$apiname + "chemicals/database";
        const gResponse = await fetch(url);
        const gObject = await gResponse.json();
        this.bigout = gObject;
    },
}

</script>