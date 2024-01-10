<template>
    <body>
        <h1 style="font-size:25px">Staement Of Purpose</h1>
        <p>
        Manufactured chemicals are often transformed into different molecules in environmental and biological systems, 
        and the resulting transformation products generally differ from the parent chemical in their toxicity and physicochemical
        properties. The EPA Chemical Transformations Database is a curated compilation of observed organic chemical transformation 
        pathways reported in scientific journals and regulatory reports.  The database captures mapped parent/product linkages and 
        transformation kinetics, along with the data source and a summary of experimental conditions for observed data.  
        The transformations are categorized by reaction type (e.g., abiotic hydrolysis, direct photolysis, mammalian metabolism, etc.) 
        and a specific reaction name which identifies the chemical class and transformation mechanism (e.g., nitroaromatic reduction).  
        The database is searchable by chemical information (name, CAS #, DTXSID) and transformation information (reaction type, reaction 
        name).  It is intended to support chemical exposure and risk assessment activities, aid in the interpretation of laboratory and 
        field studies, and provide datasets for the development of models to predict transformation products and rate constants.
        A number of articles describing the Chemical Transformation Simulator have been published 
        (<a href="https://doi.org/10.1021/acs.est.6b05412" target="_blank">1</a>,<a href="https://doi.org/10.1021/acs.est.0c00484" target="_blank">2</a>,<a href="https://doi.org/10.1021/acs.est.0c08745" target="_blank">3</a>,<a href="https://doi.org/10.1039/D1EM00445J" target="_blank">4</a>)
        </p>
        <h1 style="font-size:25px">Statistics</h1>
        <p>
        Currently CHET has {{ counts[0]['COUNT(*)'] }} chemicals and {{ counts[1]['COUNT(*)'] }} transformations represented in the database.
        </p>
        <h1 style="font-size:25px">Disclaimer</h1>
        <p>
        This resource is a compilation of information sourced from many databases and literature sources, including U.S. Federal and 
        state sources and international bodies, which can save the user time by providing information in one location. The data are not 
        fully reviewed by USEPA – the user must apply judgment in use of the information. You should consult the original scientific 
        paper or data source if possible.
        Reference herein to any specific commercial products, process, or service by trade name, trademark, manufacturer, or otherwise, 
        does not necessarily constitute or imply its endorsement, recommendation, or favoring by the United States Government. The 
        views and opinions of the developers of the site expressed herein do not necessarily state or reflect those of the United States 
        Government, and shall not be used for advertising or product endorsement purposes
        With respect to documents available from this server, neither the United States Government nor any of their employees, 
        makes any warranty, express or implied, including the warranties of merchantability and fitness for a particular purpose, or 
        assumes any legal liability or responsibility for the accuracy, completeness, or usefulness of any information, apparatus, 
        product, or process disclosed, or represents that its use would not infringe privately owned rights.
        </p>
    </body>
</template>
  
<style>
    main{font-size: 30px;}
</style>

<script>
    export default{
        name: 'about',
        data() {
            return {counts:[[],[]]}
        },
        mounted() {
            const countURL = this.$apiname + "reaction/dbcounts"
            fetch(countURL, {mode:'cors'})
                .then((result) => result.json())
                .then((remoteRowData) => (
                    this.counts = remoteRowData
                ));
        },
    }
</script>

