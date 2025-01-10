<template>
    <body>
        <h1 style="font-size:25px">Patch History</h1>
        <button @click="showhide_1_4 = !showhide_1_4">1.4</button><br>
        <p v-if="showhide_1_4">
            1.4.0 - CRACCM updates - added library about and library chemicals pages, default header routing to library about page, fixed some /false issues, added abbreviation option for reaction details on upload and in use on tables, made notes a mandatory column for all libraries, added library description to library upload for use in library about page, added parent and product ratio to reaction model, added CRACCM ID to reaction model, added reaction phase to reaction model, added ratio handling and stying to database/search result pages, added DOI linking to map page, added search visible chemicals button from reaction map, backend changes to accommodate library chemicals search; added library description, detail abbreviation, reaction phase, CRACCM ID, and reactant ratios to data-model, uploading, and passing to front end, added DOIs to maps, added search options for CRACCM ID, reaction phase, and open maps, uploading new db file to avoid wipe issues when editing
        </p>
        <button @click="showhide_1_3 = !showhide_1_3">1.3</button><br>
        <p v-if="showhide_1_3">
            1.3.0 - Backend changes to facilitate extensibility for future libraries, removed legacy elements, newlibrary page added, library fields now built by backend call rather than hardcoding, data table columns across application built by backend call rather than hardcoding, UI change to search results and database pages for clarity, atuomatic generation of template files added, template download options supplied with backend call rather than hardcoding, detail options by library supplied with backend call rather than hardcoding, chemicals added to search results, schema restructured, new chemical DSSTOX query exception handling added to deal with mixtures without associated compounds, file references restructured to avoid CWD errors<br>
            1.3.1 - Re-enabled units in details tables, pushing empty database file to be modified by user input<br>
            1.3.2 - Docker and Requirements Changes<br>
            1.3.3 - Migration to CCTE server, removing legacy returns to avoid error spam<br>
            1.3.4 - Removing print statement to fix error<br>
            1.3.5 - changes to requirements, database changes to prep for 1.3.6<br>
            1.3.6 - added frontend error messages, added sources to map page, fixed uncapped width on search results, added maps containing to reaction page, fixing ambiguous ID issues, added endpoint for reaction map lists<br>
            1.3.7 - added counts to search result pages, refined search terms (inchi by first block, casrn by nocas number only, exact match on dtxsid/inchi/casrn), darker AG grid table headers for clarity, download added date to avoid conflicts, restoring synonym search functionality, fixing ambiguous columns<br>
            1.3.8 - requests explicit CORS mode declared<br>
            1.3.9 - DB counts added to about page, substring search now option instead of default, avoiding clashes on downloads, added react map view to reaction ID page (new component to accommodate)<br>
            1.3.10 - User manual created and hosted externally, link added on about page to user manual<br>
            1.3.11 - Link to manual and about page from landing page, updating header with more recent links to applications
        </p>
        <button @click="showhide_1_2 = !showhide_1_2">1.2</button><br>
        <p v-if="showhide_1_2">
            1.2.0 - Name changed to CheT, Re-organization of navigation bar, Typeahead search only appears with 3+ characters in search field, Added EPA disclaimer to front page, Reaction database page two wide display, Image borders added for visual cleanliness, Secrets sequestered in backend
        </p>
        <button @click="showhide_1_1 = !showhide_1_1">1.1</button><br>
        <p v-if="showhide_1_1">
            1.1.0 - Batch Search added, Map Comparison tools, Maps added for PFAS set, changes to handle photolysis<br>
            1.1.1 - Cleanup of excess code<br>
            1.1.2 - Download tool touchups, Output file cleanup<br>
            1.1.3 - Improvements to Batch Search UI and information<br>
            1.1.4 - Fixed issues with Batch Search showing up during other searches<br>
            1.1.5 - More search display fixes, Exceptiong handling when API fails to connect<br>
            1.1.6 - Full matches only for synonym searching to mitigate over-matching<br>
            1.1.7 - Fixed issue with searches hanging, added DTXSIDs to URL instead of IDs<br>
            1.1.8 - More efficient hanging search fix<br>
            1.1.9 - Linking from reaction pages using DTXSIDs not internal IDs<br>
            1.1.10 - Fix to docker file for security reasons
        </p>
        <button @click="showhide_1_0 = !showhide_1_0">1.0</button><br>
        <p v-if="showhide_1_0">
            1.0.0 - EPA internal release, Submap Visualization tools<br>
            1.0.1 - Bugfix for grid issues on ChemID and Map pages
        </p>
    </body>
</template>
  
<style>
    main{font-size: 30px;}
</style>

<script>
    export default{
        name: 'history',
        data() {
            return {
                showhide_1_0:false,
                showhide_1_1:false,
                showhide_1_2:false,
                showhide_1_3:false,
                showhide_1_4:false,
            }
        },
    }
</script>

