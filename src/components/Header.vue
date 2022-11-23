<template>
    <header>
      <nav>
        <div>
          <h1 class="navstyle" style="font-size:22px"><RouterLink to="/">Chemical Transformations Database &nbsp; &nbsp;</RouterLink></h1>  
        </div>
        <b-nav><h1 class="navstyle" style="font-size:16px"><RouterLink to="/chemical/database">Search Chemicals</RouterLink></h1></b-nav>
        <b-nav-item-dropdown text="Reaction Lists" class="navstyle" style="font-size:16px">
          <b-dropdown-item to="/reaction/database">Complete Reaction Database</b-dropdown-item>
          <b-dropdown-item to="/reaction/searchresults/hydrolysis/reaction_library">Abiotic Hydrolysis</b-dropdown-item>
          <b-dropdown-item to="/reaction/searchresults/PFAS/reaction_library">PFAS</b-dropdown-item>
          <b-dropdown-item to="/reaction/searchresults/metapath/reaction_library">MetaPath</b-dropdown-item>
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
        <b-nav><h1 style="font-size:16px, color:transparent">_________</h1></b-nav>
        <!--
        <b-nav-item-dropdown text="Related Applications" class="navstyle" style="font-size:16px">
          <b-dropdown-item href="http://v2626umcth819.rtord.epa.gov:9414/">Chemical Transformations Database</b-dropdown-item>
          <b-dropdown-item href="http://v2626umcth819.rtord.epa.gov:81/substances">Analytical QC</b-dropdown-item>
          <b-dropdown-item href="http://v2626umcth819.rtord.epa.gov:5173/">Spectral and Methods Database</b-dropdown-item>
          <b-dropdown-item href="http://v2626umcth819.rtord.epa.gov:9004/molmass_web.py">Molecular Mass Calculator</b-dropdown-item>
        </b-nav-item-dropdown>
        -->
        <b-nav>
          <div  v-if="showhide" style="display: flex; justify-content: flex-end;">
            <button v-on:click="showhide = !showhide; this.$emit('toggleHeader',false)" style="font-size:xx-small">Hide EPA Header and Footer</button>
          </div>
          <div  v-else style="display: flex; justify-content: flex-end;">
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
    mounted() {  
      document.title = 'CTDB - Chemical Transformations DataBase';  
    }, 
    data () {
      return {
        devshowhide:false,
        listshowhide:false,
        dbshowhide:false,
        showhide:false,
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