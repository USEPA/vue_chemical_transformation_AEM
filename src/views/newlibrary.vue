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
    <button @click="detail_list.push([[],[]])">Add Detail</button> <br>
    <button v-if="detail_list.length > 2" @click="detail_list.splice(detail_list.length-1,1)">Remove Detail</button><br><br>
    <button @click="handleSubmit()">Submit</button>
</template>

<script>

import axios from "axios"

export default{
    name: 'newlibrary',
    data () {
        return{
            libname: '',
            detail_list: [['Reference',' '],['DOI',' ']],
        }
    },
    methods: {
        // function for submitting a new reaction
        handleSubmit() {
            axios
                // Send the chemical to the backend
                .post(this.$apiname + "reaction/newlibrary", {
                    name: this.libname,
                    detail: this.detail_list,
                })
        },
    },
}

</script>