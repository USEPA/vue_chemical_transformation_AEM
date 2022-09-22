<template>
    <button v-on:click="showhide1 = !showhide1">Enter a Single Reaction</button> <br>
    <div v-if="showhide1">
        <form @submit.prevent="handleSubmit">
            <br>
            <p>To enter multiple parent or product DTXSID's, separate them with commas.</p>
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
        <form @submit.prevent="handleSubmitFile">
            <input type="file" @change="uploadFile" ref="file"> <br>
            <button type="submit">Submit</button> <br><br>
        </form>
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
            reaction: [],
            parent: '',
            product: '',
            process: '',
            type: '',
            scheme: '',
            library:'',
            reactionfile: null,
        }
    },
    methods: {
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
        hydroDL() {
            axios.post(this.$apiname + "reaction/hydro_DL");
        },
        pfasDL() {
            axios.post(this.$apiname + "reaction/pfas_DL");
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