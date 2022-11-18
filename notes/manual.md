- Questions can belong to more than one survey.
  - This allows for some flexibility.
    e.g.
    kiosk survey: questions A, B, C
    lobby survey: questions A, B (c not shown in lobby)
    e.g.
    you can have some questions that are asked on every survey, while others change
  - The data export will include a survey ID so you could break down the data by survey/questions pairs
  - The lobby report will show ALL results for that question across surveys
  - You could create duplicates of a question if you want to separate reporting.
  - Restated. Question results show all results for a question on all surveys the question is part of. If you want the results to be survey specific, you need to create duplicate of the question.

# Airtable

- Be VERY careful deleting or editing questions and surveys.
  - Responses contain the ids of their questions and surveys, not the actual text.
  - If you change the text of a question or answer, your responses will loose integrety.

# Questions

- Complete all fields. Airtable doesn't enforce required fields, but everything should be filled out.

# Options

- Each option should be on its own line.
- There should be no empty lines, even at the end.
- Each language should have the same number of options.
- If you provide image attachments, there should be one for each option.

# Images

- Upload images pre-sized and compressed.

  - When in doubt
    - 1920x1080
    - 80% jpg for photos
    - png for logos

- Provide 'alt' tags for all images. These are used for accessibility and SEO.
- Alt tags do not support translation.

# Details

- System expects all responses to come in between Jan 1 2000 and Jan 1 3000
