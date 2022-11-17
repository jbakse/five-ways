# Survey

```
string      |  nickname             | human readable nickname (not unique!)
<<Question  | Questions             | ordered questions in this survey

```

# Question

```
string     | nickname                | human readable nickname (not unique!)
<<Survey   | Survey                  | survey this question belongs too

enum       | type                    | single, multiple, open

string     | propmtTextEnglish       |
string     | optionTextsEnglish      | newline delimited
string     | promptTextSpanish       |
string     | optionTextsSpanish      | newline delimited
string     | promptTextHmong         |
string     | optionTextsHmong        | newline delimited
string     | promtTextSomali         |
string     | optionTextsSomali       | newline delimited

attach[]   | images                  | image attachments
string     | imagesAlts              | newline delimited
```
