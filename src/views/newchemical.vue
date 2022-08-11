<template>
    <button v-on:click="showhide1 = !showhide1">Enter a Single Chemical</button> <br>
    <div v-if="showhide1">
        <form @submit.prevent="handleSubmit">
            Primary Name: <input type="text" placeholder="Name" v-model="primary_name"/> <br>
            Other Names: <input type="text" placeholder="Name" v-model="other_names"/> <br>
            DTXSID: <input type="text" placeholder="DTXSID" v-model="dtxsid"/> <br>
            Smiles: <input type="text" placeholder="Smiles" v-model="smiles"/> <br>
            Inchi Key: <input type="text" placeholder="Inchi Key" v-model="inchi"/> <br>
            CASRN: <input type="text" placeholder="CASRN" v-model="casrn"/> <br>
            <button type="submit">Submit</button> <br><br>
        </form>
    </div>
    <button v-on:click="showhide2 = !showhide2">Enter Chemicals From a CSV</button> <br>
    <div v-if="showhide2">
        <br>
        <button @click="templateDL">Download Chemical Entry Template</button>
        <form @submit.prevent="handleSubmitFile">
            <input type="file" @change="uploadFile" ref="file"> <br>
            <button type="submit">Submit</button> <br><br>
        </form>
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
            chemical: [],
            primary_name: '',
            other_names: '',
            dtxsid: '',
            smiles: '',
            inchi: '',
            casrn: '',
            chemfile: null,
        }
    },
    methods: {
        handleSubmit() {
            axios
                .post("http://127.0.0.1:5000/chemicals/newchemical", {
                    primary_name: this.primary_name,
                    other_names: this.other_names,
                    dtxsid: this.dtxsid,
                    smiles: this.smiles,
                    inchi: this.inchi,
                    casrn: this.casrn,
                })
                .then((response) => {
                    const data = response.data;
                    this.chemical.push(data);
                })
                .then( this.$router.push('/chemical/database') 
                );
        },
        templateDL() {
            axios.post("http://127.0.0.1:5000/chemicals/template_DL");
        },
        uploadFile() {
            this.chemfile = this.$refs.file.files[0];
        },
        handleSubmitFile() {
            let formData = new FormData();
            formData.append('chemfile', this.chemfile);
            axios
                .post("http://127.0.0.1:5000/chemicals/newchemfile", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then( this.$router.push('/chemical/database') )
        },
    },
}

</script>