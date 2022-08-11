<template>
    <button v-on:click="showhide1 = !showhide1">Enter a Single Reaction</button> <br>
    <div v-if="showhide1">
        <form @submit.prevent="handleSubmit">
            Parent DTXSID: <input type="text" placeholder="Parent DTXSID" v-model="parent"/> <br>
            Product DTXSID: <input type="text" placeholder="Product DTXSID" v-model="product"/> <br>
            Reaction Process: <input type="text" placeholder="Process" v-model="process"/> <br>
            Reaction Type: <input type="text" placeholder="Type" v-model="type"/> <br>
            Reaction Scheme: <input type="text" placeholder="Scheme" v-model="scheme"/> <br>
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
            reactionfile: null,
        }
    },
    methods: {
        handleSubmit() {
            axios
                .post("http://127.0.0.1:5000/reaction/newreaction", {
                    parent: this.parent,
                    product: this.product,
                    process: this.process,
                    type: this.type,
                    scheme: this.scheme,
                })
                .then((response) => {
                    const data = response.data;
                    this.reaction.push(data);
                })
                .then( this.$router.push('/reaction/database') 
                );
        },
        hydroDL() {
            axios.post("http://127.0.0.1:5000/reaction/hydro_DL");
        },
        pfasDL() {
            axios.post("http://127.0.0.1:5000/reaction/pfas_DL");
        },
        uploadFile() {
            this.reactionfile = this.$refs.file.files[0];
        },
        handleSubmitFile() {
            let formData = new FormData();
            formData.append('reactionfile', this.reactionfile);
            axios
                .post("http://127.0.0.1:5000/reaction/newreactfile", formData, {
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