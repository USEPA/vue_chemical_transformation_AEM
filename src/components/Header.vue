<template>
    <header>
      <nav>
        <div>
          <h1 class="navstyle" style="font-size:25px"><RouterLink to="/">Chemical Transformations Database &nbsp; &nbsp;</RouterLink></h1>  
        </div>
        <b-nav><h1 class="navstyle" style="font-size:16px"><RouterLink to="/chemical/database">Search Chemicals</RouterLink></h1></b-nav>
        <b-nav-item-dropdown text="Reaction Lists" class="navstyle" style="font-size:16px">
          <b-dropdown-item to="/reaction/database">Complete Reaction Database</b-dropdown-item>
          <b-dropdown-item to="/reaction/searchresults/hydrolysis/reaction_library">Abiotic Hydrolysis</b-dropdown-item>
          <b-dropdown-item to="/reaction/searchresults/PFAS/reaction_library">PFAS</b-dropdown-item>
          <b-dropdown-item to="/reaction/searchresults/metapath/reaction_library">Metapath</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown text="Tools" class="navstyle" style="font-size:16px">
          <div v-if="this.$cookie.getCookie('user')">
            <b-dropdown-item to="/chemical/newchemical">Register New Chemicals</b-dropdown-item>
            <b-dropdown-item to="/reaction/newreaction">Register New Reactions</b-dropdown-item>
            <b-dropdown-item to="/errorlist">List of Errors</b-dropdown-item>
            <b-dropdown-item v-on:click="this.$cookie.removeCookie('user').then(this.forceUpdate())">Logout</b-dropdown-item>
          </div>
          <div v-else>
            <b-dropdown-item to="/register">Register</b-dropdown-item>
            <b-dropdown-item to="/login">Login</b-dropdown-item>
          </div>
        </b-nav-item-dropdown>
        <b-nav><h1 class="navstyle" style="font-size:16px"><RouterLink to="/about">About</RouterLink></h1></b-nav>
        <b-nav><h1 class="navstyle" style="font-size:16px"><RouterLink to="/errorreport">Submit Comments</RouterLink></h1></b-nav>
        <b-nav><h1 class="navstyle" style="font-size:16px"><RouterLink to="/contactpage">Contact Us</RouterLink></h1></b-nav>
      </nav>
    </header>
    <br>
</template>

<script>

export default {
    name: 'Header',
    mounted() {  
      document.title = 'CTDB - Chemical Transformations DataBase';  
    }, 
    data () {
      return {
        devshowhide:false,
        listshowhide:false,
        dbshowhide:false,
      }
    }
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