<template>
    {{url}}
    <ag-grid-vue
        class="ag-theme-balham-dark"
        style="height:600px"
        :columnDefs="columnDefs.value"
        :rowData="rowData.value">
    </ag-grid-vue>
</template>



<script>

import {reactive, onMounted} from 'vue'
import {AgGridVue} from 'ag-grid-vue3'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css'

export default {
    name: 'Grid',
    components: {AgGridVue},
    setup(){
        const url = "http://localhost:5000/reaction/table/" + this.$route.params.reactid;
        const rowData = reactive({
            value: [],
        });
        const columnDefs = reactive({
            value: [
                {field:'pH', sortable: true, resizable: true},
                {field:'temp_C', sortable: true, resizable: true},
                {field:'activation_energy', sortable: true, resizable: true},
                {field:'degradation_rate', sortable: true, resizable: true},
                {field:'first_order_rc', sortable: true, resizable: true},
                {field:'second_order_rc', sortable: true, resizable: true},
                {field:'reaction_rc', sortable: true, resizable: true},
                {field:'notes', sortable: true, resizable: true},
                {field:'reference', sortable: true, filter: 'agTextColumnFilter', floatingFilter: true}
            ],
        });
        onMounted(() => {
            fetch("http://127.0.0.1:5000/reaction/table/123")
                .then((result) => result.json())
                .then((remoteRowData) => (rowData.value = remoteRowData));
        });
        return{
            columnDefs,
            rowData,
            url,
        };
    },
}



</script>



<style>

.ag-theme-balham-dark{
    --ag-header-column-resize-handle-display: block;
}

</style>
