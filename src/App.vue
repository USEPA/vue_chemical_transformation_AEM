<template>
<div v-if="showhide">
    <EPA_header />
</div>
<div style="display: flex; justify-content: flex-end;">
    <button v-on:click="showhide = !showhide" style="font-size:xx-small">Show/Hide EPA Header and Footer</button>
</div>
<Header />
<router-view></router-view>
<br>
<div v-if="showhide">
    <EPA_footer />
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
        EPA_footer
    },
    data () {
        return {
            CRtoggle: true,
            showhide: true,
            }
    },
    metaInfo: {
        title: 'CTDB - Chemical Transformations Database',
        titleTemplate: '%s',
    }
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
nav { background: lightgray;  align-items: center; padding: 0 0.5rem; }
nav h1 { flex: auto; margin: 0; }
nav h1 a { text-decoration: none; padding: 0.25rem 0.5rem; }
nav ul  { display: flex; list-style: none; margin: 0; padding: 0; }
nav ul li a, nav ul li span, header .action { display: block; padding: 0.5rem; }
table, th, td {border: 1px solid black; font-size:10px; text-align: center;}
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

</style>


