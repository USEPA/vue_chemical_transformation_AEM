<template>
    <content>
    <div>
        {{name}} <br>
        <img v-bind:src="source" style="width:150px;height:150px;"> <br>
        DTXSID: {{ DTXSID }} <br>
    </div>
    <button v-on:click="showhide = !showhide">Chemical Identifiers</button> <br>
    <div v-if="showhide">
        SMILES: {{smiles}} <br>
        CASRN: {{CASRN}} <br>
        INCHI KEY: {{inchi}} <br>
    </div>
    </content>
</template>

<script>

export default {
    name: 'Chemdetail',
    data () {
        return {
            name: 'Chemical Name',
            DTXSID: 'Chemical DTXSID',
            CASRN: 'Chemical casrn',
            smiles: 'Chemical smiles',
            inchi: 'Chemical inchi',
            showhide: false,
            source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Question_Mark.svg/2560px-Question_Mark.svg.png',
        }
    }
}

</script>