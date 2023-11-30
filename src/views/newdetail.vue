<template>
    <h2> <span v-for="(name,index) in reaction.parent_name">{{name}}<span v-if="index != reaction.parent_name.length - 1"> + </span></span> → <span v-for="(name,index) in reaction.product_name">{{name}}<span v-if="index != reaction.product_name.length - 1"> + </span></span></h2>
    <span v-for="(element,index) in reaction.parent_image"> <img v-bind:src="'data:image/png;base64,'+element" alt="missing image" style="width:150px;height:150px;vertical-align:middle;" /><span v-if="index != reaction.parent_image.length - 1"> + </span> </span> → <span v-for="(element,index) in reaction.product_image"> <img v-bind:src="'data:image/png;base64,'+element" alt="missing image" style="width:150px;height:150px;vertical-align:middle;" /><span v-if="index != reaction.product_image.length - 1"> + </span> </span>
    <br>
    <p v-if="reaction.lib_name">Reaction Library: {{reaction.lib_name}}</p>
    <p v-if="reaction.reaction_process">Reaction Process: {{reaction.reaction_process}}</p>
    <p v-if="reaction.reaction_type">Reaction Type: {{reaction.reaction_type}}</p>
    <p v-if="reaction.reaction_scheme">Reaction Scheme: {{reaction.reaction_scheme}}</p>
    <table>
        <!-- Rows for reaction details based on selected library -->
        <tr v-for="row in detail_list">
            <td style ="border: 1px solid">{{ row.detail_name }} ({{ row.units }})</td>
            <td style ="border: 1px solid"><input type="text" v-model="row.value"/></td>
        </tr>
    </table>
    <button @click="detailSubmit">Submit New Details</button>
    <div v-if="showhide4" class="chemcheck">
        <!-- if there is an error display it -->
        <div v-if="this.errormessage == ''">
            Entering New Details . . .
        </div>
        <!-- otherwise display the chemical from the check and confirm submission -->
        <div v-else>
            {{ errormessage }} <br>
            <button @click="this.$router.push(this.return_route)"> Browse Chemicals </button>
            <button @click="showhide4=false"> [X] </button>
        </div>
    </div>
    
</template>

<script>

import axios from "axios"

export default{
    name: 'newdetail',
    data () {
        return{
            reaction: [],
            detail_list: [],
            return_route: '/reaction/' + this.$route.params.reactid,
            reacturl: this.$apiname + "reaction/" + this.$route.params.reactid,
            showhide4: false,
            errormessage: ''
        }
    },
    methods: {
        // function for submitting a hydrolysis reaction detail
        detailSubmit() {
            this.showhide4 = true;
            let parent = this.reaction.parent_dtxsid[0]
            for(let id of this.reaction.parent_dtxsid){
                if(id != parent){
                    parent = parent + ',' + id
                } 
            }
            let product = this.reaction.product_dtxsid[0]
            for(let id of this.reaction.product_dtxsid){
                if(id != product){
                    product = product + ',' + id
                } 
            }
            axios
                // Send the details to the backend
                .post(this.$apiname + "reaction/newreaction", {
                    parent: parent,
                    product: product,
                    process: this.reaction.reaction_process,
                    type: this.reaction.reaction_type,
                    scheme: this.reaction.reaction_scheme,
                    library: this.reaction.lib_ID,
                    details: this.detail_list,
                })
                // display the result of the new detail
                .then((res) => {
                    this.errormessage = (res.data)
                });
        },        
        get_details(libID) {
            const detailurl = this.$apiname + "reaction/details/" + libID
            axios
                // get the list of details from the backend
                fetch(detailurl)
                    .then((result) => result.json())
                    .then((remoteRowData) => (this.detail_list = remoteRowData));
            
            // add a value parameter to each detail
            for(let row of this.detail_list){
                row.value = 0
            }
            this.showhide_detail = true
        },
    },
    // get information on the reaction to determine which fields to display
    created: async function(){
        const gResponse = await fetch(this.reacturl);
        const gObject = await gResponse.json();
        this.reaction = gObject[0];
        this.get_details(this.reaction.lib_ID);
    },
}

</script>

<style>

.chemcheck{
    position:fixed;
    top:20%;
    right:40%;
    left:40%;
    text-align: center;
    border: 2px solid black;
}

</style>