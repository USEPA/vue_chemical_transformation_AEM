<template>
    <header>
        <nav>
            <div>
                <h1 class="navstyle" style="font-size:22px"><RouterLink to="/">Chemical Transformations Database &nbsp; &nbsp;</RouterLink></h1>  
            </div>
            <b-nav-item-dropdown text="Search" class="navstyle" style="font-size:16px">
                <b-dropdown-item to="/">Homepage (Search Reactions)</b-dropdown-item>
                <b-dropdown-item to="/chemical/database/tiles/1/false">Browse Chemicals</b-dropdown-item>
                <b-dropdown-item to="/reaction/database/1/false">Browse Reactions</b-dropdown-item>
                <b-dropdown-item to="/reaction/batchsearch">Batch Search</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="Reaction Libraries" class="navstyle" style="font-size:16px">
                <b-dropdown-item to="/reaction/database/1/false">Complete Reaction Database</b-dropdown-item>
                <b-dropdown-item v-for="library in library_list" :to="'/about/'+library.lib_name">{{library.lib_name}}</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="Tools" class="navstyle" style="font-size:16px">
                <div v-if="this.$cookie.getCookie('user')">
                    <b-dropdown-item to="/chemical/newchemical">Register New Chemicals</b-dropdown-item>
                    <b-dropdown-item to="/reaction/newlibrary">Register New Libraries</b-dropdown-item>
                    <b-dropdown-item to="/reaction/newreaction">Register New Reactions</b-dropdown-item>
                    <b-dropdown-item to="/errorlist">List of Errors</b-dropdown-item>
                    <b-dropdown-item v-on:click="this.$cookie.removeCookie('user').then(this.forceUpdate())">Logout</b-dropdown-item>
                </div>
                <div v-else>
                    <b-dropdown-item to="/register">Register</b-dropdown-item>
                    <b-dropdown-item to="/login">Login</b-dropdown-item>
                </div>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="About" class="navstyle" style="font-size:16px">
                <b-dropdown-item to="/about">About</b-dropdown-item>
                <b-dropdown-item to="/history">Patch History</b-dropdown-item>
                <b-dropdown-item to="/errorreport">Submit Comments</b-dropdown-item>
                <b-dropdown-item to="/contactpage">Contact Us</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="Related Applications" class="navstyle" style="font-size:16px">
                <b-dropdown-item href="https://ccte-cced-amos.epa.gov/#/">Analytical Methods and Open Spectra Database</b-dropdown-item>
                <b-dropdown-item href="https://ccte-cced-chemster.epa.gov/#/">Chemical Space Mapping Tool</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav style="position: absolute; right:15px">
                <div  v-if="showhide" >
                    <button v-on:click="showhide = !showhide; this.$emit('toggleHeader',false)" style="font-size:xx-small">Hide EPA Header and Footer</button>
                </div>
                <div  v-else>
                    <button v-on:click="showhide = !showhide; this.$emit('toggleHeader', true)" style="font-size:xx-small">Show EPA Header and Footer</button>
                </div>
            </b-nav>
        </nav>
    </header>
    <br>
</template>

<script>

export default {
    name: 'Header',
    data () {
        return {
            devshowhide:false,
            listshowhide:false,
            dbshowhide:false,
            showhide:false,
            library_list: [],
        }
    },
    mounted() {  
        document.title = 'CheT - Chemical Transformations DataBase';  
        const liburl = this.$apiname + "reaction/libraries"
        fetch(liburl, {mode:'cors'})
            .then((result) => result.json())
            .then((remoteRowData) => (this.library_list = remoteRowData));
    }, 
    emits:{
        toggleHeader:true,
    },
}

</script>

<style scoped>



nav{
    display:flex;
    align-items: left;
    justify-content: left;
    background: #0e6993;
}

nav .navstyle{
    padding: 5px;
    position: relative;
    float: left;
    text-align: left;
    border-bottom: 3px solid transparent;
    display: flex;
    transition: 0.4s;
    font-family:'Roboto';
    color:white;
    margin-left: 0;
    background: #0e6993;
}

a { color: white; }
a:hover{ color:white; }
</style>