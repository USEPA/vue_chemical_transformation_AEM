<template>
    <body>
        <h1 style="font-size:25px">{{ libname }}</h1>
        <p>
            <span v-if="!libdesc">Missing Library Description</span>
            {{ libdesc }}
        </p>
        <div>
            <router-link v-bind:to="'/chemical/chemset/'+libname" style="text-transform: capitalize;">Chemicals Found in this Reaction Library</router-link><br>
            <router-link v-bind:to="'/reaction/searchresults/'+libname+'/reaction_library/false'" style="text-transform: capitalize;">List of Reactions in this Reaction Library</router-link>
        </div>
    </body>
</template>

<script>
    export default{
        name: 'libabout',
        data() {
            return{
                library_list:'',
                libname:'',
                libdesc:'',
            }
        },
        mounted() {
            const liburl = this.$apiname + "reaction/libraries"
            fetch(liburl, {mode:'cors'})
                .then((result) => result.json())
                .then((remoteRowData) => (
                    this.library_list = remoteRowData.filter(row => row.lib_name == this.$route.params.libid),
                    this.libname = this.library_list[0].lib_name,
                    this.libdesc = this.library_list[0].lib_desc
                ));
        },
    }
</script>

<style>
    main{font-size: 30px;}
</style>