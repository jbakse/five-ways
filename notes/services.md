# CMS

Provider: Airtable
Database: Walker Five Way
https://airtable.com/appAbldtPXKMxU7ct

# Application Hosting

Provider: Vercel
Account: jbakse
Project Name: five-ways
https://vercel.com/jbakse/five-ways

"hobby" tier. free
"pro" tier. $20/month

# Database Hosting

Provider: Planet Scale
Organization: justin-tsfim
Database: five_ways
https://app.planetscale.com/justin-tsfim/five_ways

free — "hobby" tier, 5GB storage, 1b row reads, 10m row writes
$29/month — "scaler" tier, 10 GB storage, 100b row reads, 50m row writes

# Database Hosting Alt

Username: justin@tsfim
Provider: MongoDB Atlas
Database: fiveways
https://cloud.mongodb.com/v2/632e8c454a33233472992043#clusters

free - "shared/M0" tier, 512 MB storage,

# Design Files

https://www.figma.com/file/Vit8pQES2leJqj4NMbseJO/Make-Sense-of-This%3A-Salons?node-id=0%3A1

# Traffic Estimation

## Response Writes

days = 30
surveys = 1000 (very high estimate)
questions = 10
responses = 3 (create, answer, change mind once)
= total = days x surveys x questions x responses = 900,000

- well within the PlantScale "hobby" tier. free

## Response Reads

this should be just in the lobby/gallery screens

displays = 2
days = 30
hours = 24
minutes = 60
questionsPerMinute = 10
responsesPerQuestions = 90000 (3 months at 1000 surveys per day)
= total = displays x days x hours x minutes x questionsPerMinute x responsesPerQuestions = 77,760,000,000

\*this kicks us into the Planet Scale "scaler" tier. $29/month.

## Storage

months = 12
storedResponsesPerMonth = 300,000
kPerResponse = 1
= total = months _ storedResponsesPerMonth _ kPerResponse = 3,600,000k
3.6 gigabytes
