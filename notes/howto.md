# Run in Development

- Using Planet Scale w/ Proxy?
  - Start DB Local Proxy `npm run pscale:dev` (may require login confirmation)
- `npm run dev`
- open localhost:3000

# Update Schema

- Update schema.prisma
- Using Planet Scale?
  - Make sure schema.prisma is using the pscale proxy
  - Start DB Local Proxy `npm run pscale:dev` (may require login confirmation)
- run `npm run prisma:generate`
- run `npm run prisma:push`

# Upgrade NPM Packages

```
npm outdated
npm install package-name@latest
```
