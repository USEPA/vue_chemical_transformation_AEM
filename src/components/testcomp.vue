<template>
    <div v-for="row in filterout">
        <hr>
        <p>Name: <router-link v-bind:to="'/chemical/'+row.local_IDnum"> {{row.primary_name}} </router-link> </p>
        <p>DTXSID: <a :href="'https://comptox.epa.gov/dashboard/chemical/details/' + row.dtxsid" target="_blank"> {{row.dtxsid}} ↗</a></p>
        <p><img v-bind:src="'data:image/png;base64,'+row.image" alt="missing image" style="width:150px;height:150px;" /> </p>
    </div>
</template>


<script>

export default {
    name: 'testcomp',
    props: ['filterout'],
}

</script>