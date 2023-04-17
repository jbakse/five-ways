## Getting Started

To get started:

- clone the repo
- Install Global Tooling
- Install Local Tooling
- Launch Launching Local Planet Scale Proxy
- Run in Development

## Install Global Tooling

This project uses Planet Scale, you'll need the CLI to use it.

Installing Planet Scale CLI
`brew install planetscale/tap/pscale`

Upgrade pscale
`brew upgrade pscale`

## Install Local Tooling

This project has development and code dependencies which can be installed using npm.

`npm install`

# Launching Local Planet Scale Proxy

If you are using Planet Scale you can connect directly or through a local proxy using the `pscale` app.

Run pscale to start the proxy.
`npm run pscale:dev`

You might be prompted to log in.

# Run in Development

`npm run dev`
`open http://localhost:3000`

# Update Prisma Schema

Make your changes to `schema.prisma`
`npm run prisma:generate`
`npm run prisma:push`

# Reset Database

Deletes all the data, and rebuild database from schema

`npx prisma migrate reset`

# Upgrade NPM Packages

See whats outdated
`npm outdated`

Install specific versions of package
`npm install package-name@latest`
