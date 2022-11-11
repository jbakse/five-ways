# Tooling

# API

Add cache headers so that Next will cache the API responses from airtable

# Refactor

Async probably shouldn't be imposing .content-block

# Design Questions

## Response Storage

    - Consider how we store unanswered questions. No response at all until an answer is given? false? []? is it currently [false, false]?


    - (Currently) Shallow: Responses have IDs of question
    - (Would this be better?) Deep: Responses store question/option text
