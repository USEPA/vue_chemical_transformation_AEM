<template>
    <header>
            <nav>
            <h1>Chemical Transformations Database</h1>    
            <p>
            <div v-if="this.$cookie.getCookie('user')">
              {{ this.$cookie.getCookie('user') }} &nbsp;
              <button @click="this.$cookie.removeCookie('user').then(this.forceUpdate())">Log Out</button> &nbsp;
            </div>
            <div v-else>
              <RouterLink to="/register">Register</RouterLink> &nbsp;
              <RouterLink to="/login">Login</RouterLink> &nbsp;
            </div>
            <div v-if="this.$cookie.getCookie('user')">  
              <RouterLink to="/errorlist">List of Errors</RouterLink> &nbsp;
            </div>
              <RouterLink to="/errorreport">Report an Error on this Page</RouterLink> &nbsp;
            </p>

            <button v-on:click="showhide1 = !showhide1">Chemical Tools</button>
            <div v-if="showhide1" class="content1">
              <ul><RouterLink to="/chemical/database">Chemical Database</RouterLink></ul>
              <div v-if="this.$cookie.getCookie('user')">
                <ul><RouterLink to="/chemical/newchemical">Register New Chemicals</RouterLink></ul>
              </div>
            </div>
            <button v-on:click="showhide2 = !showhide2">Reaction Tools</button>
            <div v-if="showhide2" class="content1">
              <ul><RouterLink to="/reaction/database">Reaction Database</RouterLink> &nbsp;</ul>
              <div v-if="this.$cookie.getCookie('user')">
                <ul><RouterLink to="/reaction/newreaction">Register New Reactions</RouterLink> &nbsp;</ul>
              </div>
            </div>
            </nav>
    </header>
    <br>
</template>

<script>

export default {
    name: 'Header',
    data () {
        return {
            LoggedIn: true,
            showhide1: false,
            showhide2: false,
            }
        }
}

</script>