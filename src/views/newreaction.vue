<template>
    <button v-on:click="showhide1 = !showhide1">Enter a Single Reaction</button> <br>
    <div v-if="showhide1">
        <form @submit.prevent="chemcheck">
            <br>
            <p>To enter multiple parent or product DTXSIDs, separate them with commas.</p>
            <div style="display:flex">
                <span style="font-size:18px">
                    Parent DTXSID: <br>
                    Product DTXSID: <br>
                    Reaction Library: <br>
                    Reaction Process: <br>
                    Reaction Type: <br>
                    Reaction Scheme: &nbsp;&nbsp; <br>
                </span>
                <span style="font-size:14px">
                    <input type="text" placeholder="Parent DTXSID" v-model="parent"/> <br>
                    <input type="text" placeholder="Product DTXSID" v-model="product"/> <br>
                    <input type="text" list="typeaheadlist" placeholder="Reaction Library" v-model="library"/>
                    <datalist id="typeaheadlist">
                        <option value="hydrolysis"></option>
                        <option value="pfas"></option>
                        <option value="metapath"></option>
                    </datalist> <br>
                    <input type="text" placeholder="Process" v-model="process"/> <br>
                    <input type="text" placeholder="Type" v-model="type"/> <br>
                    <input type="text" placeholder="Scheme" v-model="scheme"/> <br>
                </span>
            </div>
            <br>
            <button type="submit">Submit</button> <br><br>
        </form>
    </div>
    <button v-on:click="showhide2 = !showhide2">Enter Reactions From a CSV</button> <br>
    <div v-if="showhide2">
        <br>
        <button @click="hydroDL">Download Template for Hydrolysis Reactions</button> <br>
        <button @click="pfasDL">Download Template for PFAS Reactions</button> <br><br>
        <button @click="metaDL">Download Template for Metapath Reactions</button> <br><br>
        <form @submit.prevent="handleSubmitFile">
            <input type="file" @change="uploadFile" ref="file"> <br>
            <button type="submit">Submit</button> <br><br>
        </form>
    </div>
    <div v-if="showhide3" class="chemcheck">
        <div v-if="checkparent.data.error || checkproduct.data.error">
            {{checkparent.data.error}} <button @click="showhide3=false"> [X] </button>
        </div>
        <div v-else>
            Is this the reaction you intend to enter?<hr>
            {{checkparent.data.name}} => {{checkproduct.data.name}}<br>
            <div style="display:flex">
            <img v-bind:src="'data:image/png;base64,'+checkparent.data.img" alt="missing image" style="display: block; margin-left: auto; margin-right: auto; width:300px; height:300px; vertical-align:middle;" /> =>
            <img v-bind:src="'data:image/png;base64,'+checkproduct.data.img" alt="missing image" style="display: block; margin-left: auto; margin-right: auto; width:300px; height:300px; vertical-align:middle;" />
            </div>
            <hr>
            <button style="width:130px" @click="handleSubmit">Yes</button><button style="width:130px" @click="showhide3=false">No</button>
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
            reaction: [],
            parent: '',
            product: '',
            process: '',
            type: '',
            scheme: '',
            library:'',
            reactionfile: null,
            checkparent:[],
            checkproduct:[],
        }
    },
    methods: {
        async chemcheck() {
            const url1 = this.$apiname + "chemicals/verify/" + this.parent
            this.checkparent = await axios.get(url1)
            const url2 = this.$apiname + "chemicals/verify/" + this.parent
            this.checkproduct = await axios.get(url2)
            this.showhide3 = true
        },
        handleSubmit() {
            axios
                .post(this.$apiname + "reaction/newreaction", {
                    parent: this.parent,
                    product: this.product,
                    process: this.process,
                    type: this.type,
                    scheme: this.scheme,
                    library: this.library,
                })
                .then((response) => {
                    const data = response.data;
                    this.reaction.push(data);
                })
                .then( this.$router.push('/reaction/database') 
                );
        },
        async hydroDL() {
            axios
                .post(this.$apiname + "reaction/hydro_DL", {responseType: 'blob'})
                .then((res) => {
                    let data = res.data;
                    const blob = new Blob([data], { type: 'application/zip' })
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = 'hydrolysis_reaction_entry_template.csv'
                    link.click()
                });
        },
        async pfasDL() {
            axios
                .post(this.$apiname + "reaction/pfas_DL", {responseType: 'blob'})
                .then((res) => {
                    let data = res.data;
                    const blob = new Blob([data], { type: 'application/zip' })
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = 'PFAS_reaction_entry_template.csv'
                    link.click()
                });
        },
        async metaDL() {
            axios
                .post(this.$apiname + "reaction/meta_DL", {responseType: 'blob'})
                .then((res) => {
                    let data = res.data;
                    const blob = new Blob([data], { type: 'application/zip' })
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = 'metapath_reaction_entry_template.csv'
                    link.click()
                });
        },
        uploadFile() {
            this.reactionfile = this.$refs.file.files[0];
        },
        handleSubmitFile() {
            let formData = new FormData();
            formData.append('reactionfile', this.reactionfile);
            axios
                .post(this.$apiname + "reaction/newreactfile", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then( this.$router.push('/reaction/database') 
                )
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