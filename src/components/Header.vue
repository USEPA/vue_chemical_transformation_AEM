<template>
    <header>
            <nav>
            <h1>Chemical Transformations Database</h1>    
            <p style="text-align:right;">
            <div v-if="this.$cookie.getCookie('user')" style="display:inline-block;">
              {{ this.$cookie.getCookie('user') }} &nbsp;
              <button @click="this.$cookie.removeCookie('user').then(this.forceUpdate())">Log Out</button> &nbsp;
            </div>
            <div v-else style="display:inline-block;">
              <RouterLink to="/register">Register</RouterLink> &nbsp;
              <RouterLink to="/login">Login</RouterLink> &nbsp;
            </div>
            </p>

            <div style="display:inline-block;">
              <RouterLink to="/chemical/database">Chemical Database</RouterLink> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            </div>
            <div style="display:inline-block;">
              <div v-if="this.$cookie.getCookie('user')">
                <RouterLink to="/chemical/newchemical">Register New Chemicals</RouterLink>
              </div>
            </div> <br>

            <div style="display:inline-block;">
              <ul><RouterLink to="/reaction/database">Reaction Database</RouterLink> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</ul>
            </div>
            <div style="display:inline-block;">
              <div v-if="this.$cookie.getCookie('user')">
                <ul><RouterLink to="/reaction/newreaction">Register New Reactions</RouterLink></ul>
              </div>
            </div> <br>

            <RouterLink to="/errorreport">Report an Error on this Page</RouterLink> &nbsp;
            <div v-if="this.$cookie.getCookie('user')" style="display:inline-block;">  
              <RouterLink to="/errorlist">List of Errors</RouterLink> &nbsp;
            </div>
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
}

</script>