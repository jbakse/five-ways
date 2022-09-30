# Refactor

Clean up airtable.js function names and exports.

should be exporting: getSurvey() {id: nick: questions:}

create link chain to all routes from index

index -> survey
index -> responses -> /id
index -> surveys -> /id

rename survey to takeSurvey?

# Design Questions

## Where should Should Survey Data Live?

    - Edited in Airtable, Loaded From Airtable
        - Rate limits too restrictive
        - Hard to connect responses in DB to survey data in Airtable
    - Edited in Airtable, Imported to DB
        - Have to write an importer
        - Would probably import as one big JSON
        - What happens if survey needs to be updated?
            No matter what this gets weird: if question is changed after the survey is opened how do we deal with that?
            Probably need to disallow that?
    - Custom Editor
        - Create Schemas
        - Create Editor

## Response Depth

    - Shallow: Responses have IDs of question
    - Deep: Responses store question/option text
