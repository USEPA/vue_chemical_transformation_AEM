<template>
    <br>
    <!-- list of stored details for the hydrolysis reaction library-->
    <div v-if="reaction.reaction_library.toLowerCase().includes('hydrolysis')">
        <form @submit.prevent="hydroSubmit">
            <table>
                <tr>
                    <th style ="border: 1px solid">Property </th>
                    <th style ="border: 1px solid">Value</th>
                </tr>
                <tr>
                    <td style ="border: 1px solid">pH: </td>
                    <td style ="border: 1px solid"><input type="text" v-model="pH"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">Temperature (°C): </td>
                    <td style ="border: 1px solid"><input type="text" v-model="temp_C"/> </td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">Activation Energy (kcal/mol): </td>
                    <td style ="border: 1px solid"><input type="text" v-model="activation_energy"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">Degradation Rate (days⁻¹): </td>
                    <td style ="border: 1px solid"><input type="text" v-model="degradation_rate"/> </td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">1st Order Rate Constant (second⁻¹): </td>
                    <td style ="border: 1px solid"><input type="text" v-model="first_order_rc"/> </td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">2nd Order Rate Constant (mol⁻¹ * second⁻¹): </td>
                    <td style ="border: 1px solid"><input type="text" v-model="second_order_rc"/> </td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">Reaction Rate Constant: </td>
                    <td style ="border: 1px solid"><input type="text" v-model="reaction_rc"/> </td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">Notes: </td>
                    <td style ="border: 1px solid"><input type="text" v-model="notes"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">Reference: </td>
                    <td style ="border: 1px solid"><input type="text" v-model="reference"/> </td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">DOI: </td>
                    <td style ="border: 1px solid"><input type="text" v-model="doi"/></td>
                </tr>
            </table>
            <br>
            <button type="submit">Submit</button>
        </form>
    </div>
    <!-- list of stored details for the PFAS reaction library-->
    <div v-if="reaction.reaction_library.toLowerCase().includes('pfas')">
        <br>
        <form @submit.prevent="pfasSubmit">
            <table>
                <tr>
                    <th style ="border: 1px solid">Property </th>
                    <th style ="border: 1px solid">Value</th>
                </tr>
                <tr>
                    <td style ="border: 1px solid">Temperature (°C): </td>
                    <td style ="border: 1px solid"><input type="text" v-model="temp_C"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">Half Life (days): </td>
                    <td style ="border: 1px solid"><input type="text" v-model="half_life"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">Reaction System: </td>
                    <td style ="border: 1px solid"><input type="text" v-model="reaction_system"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">Metabolic Flag: </td>
                    <td style ="border: 1px solid"><input type="text" v-model="is_metabolic"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">Evnironmental Flag: </td>
                    <td style ="border: 1px solid"><input type="text" v-model="is_environmental"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">Notes: </td>
                    <td style ="border: 1px solid"><input type="text" v-model="notes"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">Reference: </td>
                    <td style ="border: 1px solid"><input type="text" v-model="reference"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">DOI: </td>
                    <td style ="border: 1px solid"><input type="text" v-model="doi"/></td>
                </tr>
            </table>
            <br>
            <button type="submit">Submit</button> 
        </form>
    </div>
    <!-- list of stored details for the metapath reaction library-->
    <div v-if="reaction.reaction_library.toLowerCase().includes('metapath')">
        <br>
        <form @submit.prevent="metaSubmit">
            <table>
                <tr>
                    <th style ="border: 1px solid">Property </th>
                    <th style ="border: 1px solid">Value</th>
                </tr>
                <tr>
                    <td style ="border: 1px solid">Species: </td>
                    <td style ="border: 1px solid"><input type="text" v-model="species"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">Notes/Specification: </td>
                    <td style ="border: 1px solid"><input type="text" v-model="notes"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">Reference: </td>
                    <td style ="border: 1px solid"><input type="text" v-model="reference"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">DOI: </td>
                    <td style ="border: 1px solid"><input type="text" v-model="doi"/></td>
                </tr>
            </table><br>
            <button type="submit">Submit</button> 
        </form>
    </div>
    <!-- list of stored details for the Photolysis reaction library-->
    <div v-if="reaction.reaction_library.toLowerCase().includes('photolysis')">
        <br>
        <form @submit.prevent="photoSubmit">
            <table>
                <tr>
                    <th style ="border: 1px solid">Property </th>
                    <th style ="border: 1px solid">Value</th>
                </tr>
                <tr>
                    <td style ="border: 1px solid">k_pa </td>
                    <td style ="border: 1px solid"><input type="text" v-model="k_pa"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">half_pa </td>
                    <td style ="border: 1px solid"><input type="text" v-model="half_pa"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">alpha </td>
                    <td style ="border: 1px solid"><input type="text" v-model="alpha"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">half_pr </td>
                    <td style ="border: 1px solid"><input type="text" v-model="half_pr"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">pH </td>
                    <td style ="border: 1px solid"><input type="text" v-model="pH"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">light_source </td>
                    <td style ="border: 1px solid"><input type="text" v-model="light_source"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">Notes: </td>
                    <td style ="border: 1px solid"><input type="text" v-model="notes"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">Reference: </td>
                    <td style ="border: 1px solid"><input type="text" v-model="reference"/></td>
                </tr>
                <tr>
                    <td style ="border: 1px solid">DOI: </td>
                    <td style ="border: 1px solid"><input type="text" v-model="doi"/></td>
                </tr>
            </table>
            <br>
            <button type="submit">Submit</button> 
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
            species: '',
            reactID: '',
            reactiontype: '',
            return_route: '/reaction/' + this.$route.params.reactid
        }
    },
    methods: {
        // function for submitting a hydrolysis reaction detail
        hydroSubmit() {
            axios
                // send the entered information to the backend
                .post(this.$apiname + "reaction/newdetail", {
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
                // return the user to the page for the reaction
                .then( this.$router.push(this.return_route) 
                );
        },
        // function for submitting a PFAS reaction detail
        pfasSubmit() {
            axios
                // send the entered information to the backend
                .post(this.$apiname + "reaction/newdetail", {
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
                // return the user to the page for the reaction
                .then( this.$router.push(this.return_route) 
                );
        },
        // function for submitting a metapath reaction detail
        metaSubmit() {
            axios
                // send the entered information to the backend
                .post(this.$apiname + "reaction/newdetail", {
                    species: this.species,
                    notes: this.notes,
                    reference: this.reference,
                    doi: this.doi,
                    reactiontype: 'metapath',
                    reactID: this.$route.params.reactid,
                })
                // return the user to the page for the reaction
                .then( this.$router.push(this.return_route) 
                );
        },
        // function for submitting a Photolysis reaction detail
        photoSubmit() {
            axios
                // send the entered information to the backend
                .post(this.$apiname + "reaction/newdetail", {
                    k_pa: this.k_pa,
                    half_pa: this.half_pa,
                    alpha: this.alpha,
                    half_pr: this.half_pr,
                    pH: this.pH,
                    light_source: this.light_source,
                    notes: this.notes,
                    reference: this.reference,
                    doi: this.doi,
                    reactiontype: 'photolysis',
                    reactID: this.$route.params.reactid,
                })
                // return the user to the page for the reaction
                .then( this.$router.push(this.return_route) 
                );
        },
    },
    computed: {
        url() {
            return this.$apiname + "reaction/" + this.$route.params.reactid
        }
    },
    // get information on the reaction to determinw which fields to display
    created: async function(){
        const gResponse = await fetch(this.url);
        const gObject = await gResponse.json();
        this.reaction = gObject[0];
    },
}

</script>