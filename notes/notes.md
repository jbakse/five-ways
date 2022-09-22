# Libraries

## Form Builders

https://formik.org/
https://surveyjs.io/

## React Reference

https://www.robinwieruch.de/react-hooks-fetch-data/
https://polvara.me/posts/fetching-asynchronous-data-with-react-hooks
https://overreacted.io/a-complete-guide-to-useeffect/

https://github.com/vercel/swr

## Planet Scale Reference

https://planetscale.com/blog/how-to-setup-next-js-with-prisma-and-planetscale

## Airtable Reference

https://community.airtable.com/t/filterbyformula-using-link-record-id/30418

## Tooling

Using Planet Scale CLI

```bash
brew install planetscale/tap/pscale
```

```bash
pscale connect five_ways dev --port 3309 # run proxy
# pscale branch promote five_ways main # promote to production
```

Prisma

```bash
npx prisma db push # sync prisma.schema
npx prisma studio # open database viewing api
```
