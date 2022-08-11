<template>
    <br>
    <div v-if="reaction.reaction_process.toLowerCase().includes('hydrolysis')">
        <form @submit.prevent="hydroSubmit">
            pH: <input type="text" v-model="pH"/> <br>
            Temperature (°C): <input type="text" v-model="temp_C"/> <br>
            Activation Energy (kcal/mol): <input type="text" v-model="activation_energy"/> <br>
            Degradation Rate (days⁻¹): <input type="text" v-model="degradation_rate"/> <br>
            1st Order Rate Constant (second⁻¹): <input type="text" v-model="first_order_rc"/> <br>
            2nd Order Rate Constant (mol⁻¹ * second⁻¹): <input type="text" v-model="second_order_rc"/> <br>
            Reaction Rate Constant: <input type="text" v-model="reaction_rc"/> <br>
            Notes: <input type="text" v-model="notes"/> <br>
            Reference: <input type="text" v-model="reference"/> <br>
            DOI: <input type="text" v-model="doi"/> <br><br>
            <button type="submit">Submit</button> <br>
        </form>
    </div>
    <div v-if="reaction.reaction_process.toLowerCase().includes('pfas')">
        <br>
        <form @submit.prevent="pfasSubmit">
            Temperature (°C): <input type="text" v-model="temp_C"/> <br>
            Half Life (days): <input type="text" v-model="half_life"/> <br>
            Reaction System: <input type="text" v-model="reaction_system"/> <br>
            Metabolic Flag: <input type="text" v-model="is_metabolic"/> <br>
            Evnironmental Flag: <input type="text" v-model="is_environmental"/> <br>
            Notes: <input type="text" v-model="notes"/> <br>
            Reference: <input type="text" v-model="reference"/> <br>
            DOI: <input type="text" v-model="doi"/> <br><br>
            <button type="submit">Submit</button> <br>
        </form>
    </div>
</template>

<script>

import axios from "axios"

export default{
    name: 'newdetail',
    data () {
        return{
            showhide1: true,
            showhide2: true,
            reaction: [],
            pH: '',
            temp_C: '',
            activation_energy: '',
            degradation_rate: '',
            first_order_rc: '',
            second_order_rc: '',
            reaction_rc: '',
            notes: '',
            reference: '',
            doi: '',
            half_life: '',
            reaction_system: '',
            is_metabolic: '',
            is_environmental: '',
            reactID: '',
            reactiontype: '',
            return_route: '/reaction/' + this.$route.params.reactid
        }
    },
    methods: {
        hydroSubmit() {
            axios
                .post("http://127.0.0.1:5000/reaction/newdetail", {
                    pH: this.pH,
                    temp_C: this.temp_C,
                    activation_energy: this.activation_energy,
                    degradation_rate: this.degradation_rate,
                    first_order_rc: this.first_order_rc,
                    second_order_rc: this.second_order_rc,
                    reaction_rc: this.reaction_rc,
                    notes: this.notes,
                    reference: this.reference,
                    doi: this.doi,
                    reactiontype: 'hydrolysis',
                    reactID: this.$route.params.reactid,
                })
                .then( this.$router.push(this.return_route) 
                );
        },
        pfasSubmit() {
            axios
                .post("http://127.0.0.1:5000/reaction/newdetail", {
                    temp_C: this.temp_C,
                    half_life: this.half_life,
                    reaction_system: this.reaction_system,
                    is_metabolic: this.is_metabolic,
                    is_environmental: this.is_environmental,
                    notes: this.notes,
                    reference: this.reference,
                    doi: this.doi,
                    reactiontype: 'pfas',
                    reactID: this.$route.params.reactid,
                })
                .then( this.$router.push(this.return_route) 
                );
        },
    },
    computed: {
        url() {
            return "http://localhost:5000/reaction/" + this.$route.params.reactid
        }
    },
    created: async function(){
        const gResponse = await fetch(this.url);
        const gObject = await gResponse.json();
        this.reaction = gObject[0];
    },
}

</script>