<template>
    <button v-on:click="showhide1 = !showhide1">Enter a Single Chemical by DTXSID</button> <br>
    <div v-if="showhide1">
        <form @submit.prevent="chemcheck">
            DTXSID: <input type="text" placeholder="DTXSID#########" v-model="dtxsid"/> <br>
            <button type="submit">Submit</button> <br><br>
        </form>
    </div>
    <button v-on:click="showhide2 = !showhide2">Enter Chemicals From a CSV</button> <br>
    <div v-if="showhide2">
        <br>
        <button @click="templateDL">Download Chemical Entry Template</button> <br><br>
        <form @submit.prevent="handleSubmitFile">
            <input type="file" @change="uploadFile" ref="file"> <br>
            <button type="submit">Submit</button> <br><br>
        </form>
    </div>
    <br>
    <p>If a chemical you would like to enter into the database does not have a DTXSID please contact Antony Williams (see contact page).</p>
    <div v-if="showhide3" class="chemcheck">
        <div v-if="checkchem.data.error">
            {{checkchem.data.error}} <button @click="showhide3=false"> [X] </button>
        </div>
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
        async chemcheck() {
            const url = this.$apiname + "chemicals/verify/" + this.dtxsid
            this.checkchem = await axios.get(url)
            this.showhide3 = true
        },
        async handleSubmit() {
            axios
                .post(this.$apiname + "chemicals/newchemical", {
                    dtxsid: this.dtxsid,
                })
                .then((response) => {
                    const data = response.data;
                    this.chemical.push(data);
                })
                .then(this.$router.push('/chemical/database') 
                );
        },
        async templateDL() {
            await axios
                .post(this.$apiname + "chemicals/template_DL", {responseType: 'blob',})
                .then((res) => {
                    let data = res.data;
                    const blob = new Blob([data], { type: res.data.type })
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = 'chemical_entry_template.csv'
                    link.click()
                });
        },
        uploadFile() {
            this.chemfile = this.$refs.file.files[0];
        },
        handleSubmitFile() {
            let formData = new FormData();
            formData.append('chemfile', this.chemfile);
            axios
                .post(this.$apiname + "chemicals/newchemfile", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
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