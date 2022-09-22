<template>
    <button v-on:click="showhide1 = !showhide1">Enter a Single Chemical by DTXSID</button> <br>
    <div v-if="showhide1">
        <form @submit.prevent="handleSubmit">
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
            dtxsid: '',
            chemfile: null,
        }
    },
    methods: {
        handleSubmit() {
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
        templateDL() {
            axios.post(this.$apiname + "chemicals/template_DL");
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