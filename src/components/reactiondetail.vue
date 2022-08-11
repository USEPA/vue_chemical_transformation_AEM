<template>
    <content>
    <div>
        {{parent_name}} → {{product_name}}<br>
        <img v-bind:src="parent_img" style="width:150px;height:150px;vertical-align:middle;"> → <img v-bind:src="product_img" style="width:150px;height:150px;vertical-align:middle;"> <br>
        Reaction Process: {{react_process}} <br>
        Reaction Type: {{react_type}} <br>
        Reaction Scheme: {{react_scheme}} <br>
    </div>
    <button v-on:click="showhide = !showhide">Reaction Details</button> <br>
    <div v-if="showhide">
        <Grid />
    </div>
    </content>
</template>

<script>

import Grid from '@/components/grid.vue'

export default {
    name: 'Reactiondetail',
    components: {
        Grid,
        },
    data () {
        return {
            parent_name: 'Parent Name',
            product_name: 'Product Name',
            react_process: 'Chemical casrn',
            react_type: 'Chemical smiles',
            react_scheme: 'Chemical inchi',
            showhide: false,
            parent_img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Question_Mark.svg/2560px-Question_Mark.svg.png',
            product_img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Question_Mark.svg/2560px-Question_Mark.svg.png',
            }
        }
}

</script>