<template>
    Library Name: <input type="text" v-model="libname"/> <br>
    Details:  <br>
    <table>
            <tr>
                <th style ="border: 1px solid">Name </th>
                <th style ="border: 1px solid">Units</th>
            </tr>
            <tr v-for="row in detail_list">
                <td style ="border: 1px solid"><input type="text" v-model="row[0]"/></td>
                <td style ="border: 1px solid"><input type="text" v-model="row[1]"/></td>
            </tr>
    </table>
    <button @click="detail_list.push(['',' '])">Add Detail</button> <br>
    <button v-if="detail_list.length > 2" @click="detail_list.splice(detail_list.length-1,1)">Remove Detail</button><br><br>
    <button @click="handleSubmit()">Submit</button>
    <div v-if="showhide4" class="chemcheck">
        <!-- wait for a response from the backend -->
        <div v-if="this.errormessage == ''">
            Entering Library . . .
        </div>
        <!-- display error or success message -->
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
    name: 'newlibrary',
    data () {
        return{
            libname: '',
            detail_list: [['Reference',' '],['DOI',' ']],
            errormessage: '',
            showhide4: false,
        }
    },
    methods: {
        // function for submitting a new library
        handleSubmit() {
            this.showhide4 = true;
            axios
                // Send the library to the backend
                .post(this.$apiname + "reaction/newlibrary", {
                    name: this.libname,
                    detail: this.detail_list,
                })
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
    right:40%;
    left:40%;
    text-align: center;
    border: 2px solid black;
}

</style>