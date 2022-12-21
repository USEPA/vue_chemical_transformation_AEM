<template>
    <button v-on:click="showhide1 = !showhide1" style="background-color:#8ad2ed">Enter a Single Chemical by DTXSID</button> <br>
    <div v-if="showhide1">
        <br>
        <!-- when a chemical is submitted, displays a popup -->
        <form @submit.prevent="chemcheck">
            DTXSID: <input type="text" placeholder="DTXSID#########" v-model="dtxsid"/> <br>
            <button type="submit">Submit</button> <br><br>
        </form>
    </div>
    <br>
    <button v-on:click="showhide2 = !showhide2" style="background-color:#8ad2ed">Enter Chemicals From a CSV</button> <br>
    <div v-if="showhide2">
        <br>
        <form @submit.prevent="handleSubmitFile">
            <!-- file input that uploads when a new filepath is offered -->
            <input type="file" @change="uploadFile" ref="file"> <br>
            <button type="submit">Submit</button> <br><br>
        </form>
        <button @click="templateDL">Download Chemical Entry Template</button> <br><br>
    </div>
    <br>
    <p>If a chemical you would like to enter into the database does not have a DTXSID please contact Antony Williams (see contact page).</p>
    <!-- popup for single chemical submission -->
    <div v-if="showhide3" class="chemcheck">
        <!-- if there is an error display it -->
        <div v-if="checkchem.data.error">
            {{checkchem.data.error}} <button @click="showhide3=false"> [X] </button>
        </div>
        <!-- otherwise display the chemical from the check and confirm submission -->
        <div v-else>
            Is this the chemical you intend to enter?<hr>
            {{checkchem.data.name}}<br>
            <img v-bind:src="'data:image/png;base64,'+checkchem.data.img" alt="missing image" style="display: block; margin-left: auto; margin-right: auto; width:300px; height:300px;" /><hr>
            <button style="width:130px" @click="handleSubmit">Yes</button><button style="width:130px" @click="showhide3=false">No</button>
        </div>
    </div>
</template>

<script>

import axios from "axios"

export default{
    name: 'newchemical',
    data () {
        return{
            showhide1: false,
            showhide2: false,
            showhide3: false,
            chemical: [],
            dtxsid: '',
            chemfile: null,
            checkchem:[],
        }
    },
    methods: {
        // function for determining whether an entered DTXSID is the intended chemical
        async chemcheck() {
            // use the backend to check with DSSTOX and get an image for the chemical
            const url = this.$apiname + "chemicals/verify/" + this.dtxsid
            // set the displayed chemical to the retreived image and show the verification popup
            this.checkchem = await axios.get(url)
            this.showhide3 = true
        },
        // function for submitting a new chemical
        async handleSubmit() {
            axios
                // Send the chemical to the backend
                .post(this.$apiname + "chemicals/newchemical", {
                    dtxsid: this.dtxsid,
                })
                // redirect the user to the database
                .then(this.$router.push('/chemical/database') 
                );
        },
        // function to download template for entering multiple chemicals at once
        async templateDL() {
            await axios
                // get the file from the backend
                .post(this.$apiname + "chemicals/template_DL", {responseType: 'blob',})
                // open a download window
                .then((res) => {
                    let data = res.data;
                    const blob = new Blob([data], { type: res.data.type })
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = 'chemical_entry_template.csv'
                    link.click()
                });
        },
        // sets the file to be uploaded to the database based on the file dialogue
        uploadFile() {
            this.chemfile = this.$refs.file.files[0];
        },
        // submits a list of chemicals to the database
        handleSubmitFile() {
            // create a html form and adds the file to it
            let formData = new FormData();
            formData.append('chemfile', this.chemfile);
            axios
                // sends the file to the backend to be added to the database
                .post(this.$apiname + "chemicals/newchemfile", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                // redirects the user to the database
                .then( this.$router.push('/chemical/database') )
        },
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