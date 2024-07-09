<template>
    <button v-on:click="showhide1 = !showhide1" style="background-color:#8ad2ed">Enter a Single Reaction</button> <br>
    <div v-if="showhide1"><br>
        <table>
            <!-- Rows for universal reaction details -->
            <tr>
                <td style ="border: 1px solid">Parent DTXSID(s)</td>
                <td style ="border: 1px solid"><input type="text" v-model="parent"/></td>
            </tr>
            <tr>
                <td style ="border: 1px solid">Product DTXSID(s)</td>
                <td style ="border: 1px solid"><input type="text" v-model="product"/></td>
            </tr>
            <tr>
                <td style ="border: 1px solid">Parent Ratio(s)</td>
                <td style ="border: 1px solid"><input type="text" v-model="parent_ratio"/></td>
            </tr>
            <tr>
                <td style ="border: 1px solid">Product Ratio(s)</td>
                <td style ="border: 1px solid"><input type="text" v-model="product_ratio"/></td>
            </tr>
            <tr>
                <td style ="border: 1px solid">Reaction Process</td>
                <td style ="border: 1px solid"><input type="text" v-model="process"/></td>
            </tr>
            <tr>
                <td style ="border: 1px solid">Reaction Type</td>
                <td style ="border: 1px solid"><input type="text" v-model="type"/></td>
            </tr>
            <tr>
                <td style ="border: 1px solid">Reaction Scheme</td>
                <td style ="border: 1px solid"><input type="text" v-model="scheme"/></td>
            </tr>
            <tr>
                <td style ="border: 1px solid">Reaction Phase</td>
                <td style ="border: 1px solid"><input type="text" v-model="phase"/></td>
            </tr>
            <!-- Rows for reaction details based on selected library -->
            <tr v-if="showhide_detail" v-for="row in detail_list">
                <td style ="border: 1px solid">{{ row.detail_name }} ({{ row.units }})</td>
                <td style ="border: 1px solid"><input type="text" v-model="row.value"/></td>
            </tr>
        </table> <br>
        <!-- Library Selection -->
        Select Library:
        <select @change="get_details(selected_library.lib_ID)" v-model="selected_library">
            <option value="">Select a Library</option>
            <option v-for="library in library_list" :value="library">{{ library.lib_name }}</option>
        </select><br><br>
        <!-- Map Selection -->
        <button @click="showhide_map = !showhide_map">Select a Map this Reaction is a part of (if any)</button>
        <div v-if="showhide_map">
            <select v-model="selected_map">
                <option value="">Select a Map</option>
                <option v-for="map in map_list" :value="map">{{ map.map_ID }} : {{ map.reference }}</option>
            </select><br>
        </div><br><br>
        <!-- Submit button -->
        <button v-if="selected_library != ''" @click="handleSubmit()"> Submit New Reaction </button>
    </div>
    <br>
    <button v-on:click="showhide2 = !showhide2" style="background-color:#8ad2ed">Enter Reactions From a CSV</button> <br>
    <div v-if="showhide2">
        <br>
        <!-- Template Download Button -->
        Select a library to download a template for that library: <br>
        <select @change="get_details(selected_library.lib_ID)" v-model="selected_library">
            <option value="">Select a Library</option>
            <option v-for="library in library_list" :value="library">{{ library.lib_name }}</option>
        </select> <br>
        <button v-if="selected_library != ''" @click="templateDL()">Download {{ selected_library.lib_name }} Library Template</button> <br><br>
        <!-- file input that uploads when a new filepath is offered -->
        <form @submit.prevent="handleSubmitFile">
            <input type="file" @change="uploadFile" ref="file"> <br>
            <button v-if="reactionfile != null" type="submit">Submit</button> <br><br>
        </form>
    </div>
    <div v-if="showhide4" class="chemcheck">
        <!-- if there is an error display it -->
        <div v-if="this.errormessage == ''">
            Entering Reaction(s) . . .
        </div>
        <!-- otherwise display the chemical from the check and confirm submission -->
        <div v-else>
            {{ errormessage }} <br>
            <button @click="this.$router.push('/reaction/database')"> Browse Reactions </button>
            <button @click="showhide4=false"> [X] </button>
        </div>
    </div>
</template>

<script>

import axios from "axios"

export default{
    name: 'newreaction',
    data () {
        return{
            showhide1: false,
            showhide2: false,
            showhide3: false,
            showhide4: false,
            showhide_map: false,
            showhide_detail: false,
            library_list: [],
            selected_library: '',   
            map_list: [],
            selected_map: '',  
            detail_list: [],
            parent: '',
            product: '', 
            process: '',
            type: '',
            scheme: '',
            phase: '',
            reactionfile: null,
            errormessage: '',
        }
    },
    mounted() {
        const liburl = this.$apiname + "reaction/libraries"
        fetch(liburl, {mode:'cors'})
            .then((result) => result.json())
            .then((remoteRowData) => (this.library_list = remoteRowData));
        const mapurl = this.$apiname + "reaction/maps"
        fetch(mapurl, {mode:'cors'})
            .then((result) => result.json())
            .then((remoteRowData) => (this.map_list = remoteRowData));
    },
    methods: {
        // function for retreiving the list of details associated with a library
        get_details(libID) {
            this.showhide_detail = false
            const detailurl = this.$apiname + "reaction/details/" + libID
            axios
                // get the list of details from the backend
                fetch(detailurl, {mode:'cors'})
                    .then((result) => result.json())
                    .then((remoteRowData) => (this.detail_list = remoteRowData));
            
            // add a value parameter to each detail
            for(let row of this.detail_list){
                row.value = 0
            }
            this.showhide_detail = true
        },
        // function for submitting a new reaction
        handleSubmit() {
            this.errormessage = ''
            this.showhide4 = true;
            axios
                // Send the chemical to the backend
                .post(this.$apiname + "reaction/newreaction", {
                    parent: this.parent,
                    product: this.product,
                    process: this.process,
                    type: this.type,
                    scheme: this.scheme,
                    phase: this.phase,
                    library: this.selected_library.lib_ID,
                    details: this.detail_list,
                })
                // redirect the user to the database
                .then((res) => {
                    this.errormessage = (res.data)
                })
                ;
        },
        // function to download template for entering multiple reactions at once
        async templateDL() {
            axios
                // get the file from the backend
                .post(this.$apiname + "reaction/template_DL", {
                    responseType: 'blob',
                    name: this.selected_library.lib_name,
                })
                // open a download window
                .then((res) => {
                    let data = res.data;
                    const blob = new Blob([data], { type: 'application/zip' })
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = String(this.selected_library.lib_name)+'_reaction_entry_template.csv'
                    link.click()
                });
        },
        // sets the file to be uploaded to the database based on the file dialogue
        uploadFile() {
            this.reactionfile = this.$refs.file.files[0];
        },
        // submits a list of reactions to the database
        handleSubmitFile() {
            this.showhide4 = true;
            // create a html form and adds the file to it
            let formData = new FormData();
            formData.append('reactionfile', this.reactionfile);
            axios
                // sends the file to the backend to be added to the database
                .post(this.$apiname + "reaction/newreactfile", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                // redirect the user to the database
                .then((res) => {
                    this.errormessage = (res.data)
                })
        },
    },
}

</script>

<style>

.chemcheck{
    position:fixed;
    top:20%;
    left:10%;
    right:10%;
    text-align: center;
    border: 2px solid black;
    background-color: white;
}

</style>