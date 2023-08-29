<template>

    <transition>
        <div v-if="showhide">
            <EPA_header />
        </div>
    </transition>
    <!-- Inherits Show/Hide value from component -->
    <Header v-on:toggleHeader="(value) => this.showhide = value"/>
    <!-- Displays the page specified by the URL -->
    <router-view :key="$route.path"></router-view>
    <br>
    <transition>
        <div v-if="showhide">
            <EPA_footer />
        </div>
    </transition>
    <transition>
        <div class="popup" v-if="popup_showhide">
            <p>The Official EPA Header <br> and Footer have been <br> hidden for your convenience.</p>
            <button style="position:fixed; top:95px; right:25px; font-size:xx-small;" v-on:click="popup_showhide = false" >[X]</button>
        </div>
    </transition>
    <div style="position:fixed; bottom:5px; right:25px">
        Version: 1.3.0
    </div>
</template>


<script>

import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import EPA_header from '@/components/EPA_Header.vue'
import EPA_footer from '@/components/Footer.vue'



export default {
    name: 'App',
    components: {
        Header,
        EPA_header,
        EPA_footer,
    },
    data () {
        return {
            showhide: true,
            popup_showhide: true,
            }
    },
    // Give a name to tabs/windows containing the app
    metaInfo: {
        title: 'CHET - Chemical Transformations Database',
        titleTemplate: '%s',
    },
    // Sets time for fade in/out of the EPA header and the popup explaining it
    mounted: async function(){
        setTimeout(() => this.showhide = false, 1500)
        setTimeout(() => this.popup_showhide = false, 5000)
    },
}

</script>









<style>
@import '@/assets/base.css';

#app {
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

html { font-family: sans-serif; background: #eee; padding: 1rem; }
body { margin: 0 auto; background: white; }
h1 { font-family: serif; color: #377ba8; margin: 1rem 0; }
a { color: #377ba8; }
hr { border: none; border-top: 1px solid lightgray; }
nav { background: #0e6993;  align-items: center; padding: 0 0.5rem; }
nav h1 { flex: auto; margin: 0; }
nav h1 a { text-decoration: none; padding: 0.25rem 0.5rem; }
nav ul  { display: flex; list-style: none; margin: 0; padding: 0; }
nav ul li a, nav ul li span, header .action { display: block; padding: 0.5rem; }
table, th, td {border: 1px solid black; font-size:16px; text-align: center;}
td:empty::before {content: "---"}
.content { padding: 0 1rem 1rem; }
.content > header { border-bottom: 1px solid lightgray; display: flex; align-items: flex-end; }
.content > header h1 { flex: auto; margin: 1rem 0 0.25rem 0; }
.flash { margin: 1em 0; padding: 1em; background: #cae6f6; border: 1px solid #377ba8; }
.post > header { display: flex; align-items: flex-end; font-size: 0.85em; }
.post > header > div:first-of-type { flex: auto; }
.post > header h1 { font-size: 1.5em; margin-bottom: 0; }
.post .about { color: slategray; font-style: italic; }
.post .body { white-space: pre-line; }
.content:last-child { margin-bottom: 0; }
.content form { margin: 1em 0; display: flex; flex-direction: column; }
.content label { font-weight: bold; margin-bottom: 0.5em; }
.content input, .content textarea { margin-bottom: 1em; }
.content textarea { min-height: 12em; resize: vertical; }
input.danger { color: #cc2f2e; }
input[type=submit] { align-self: start; min-width: 10em; }

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.popup{
    position:fixed;
    top:20px;
    right:20px;
    height:100px;
    width:250px;
    color: white;
    background-color: #377680;
    text-align: center;
    border: 2px solid black;
}
</style>


