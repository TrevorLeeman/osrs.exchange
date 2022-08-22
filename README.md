## osrs-prices.trevorleeman.com

Item flipping utility for the game Old School Runescape. Leverages the OSRS wiki x RuneLite Real-time Prices API.

Build using NextJS, PostgreSQL, NextUI, and SCSS modules.

Hosted on Vercel and AWS RDS.

## Initialize Project

1. Clone this repo
2. Ensure you have at least node 18.0 and npm 8.0 installed. You can check using `node -v` and `npm -v`, respectively
3. Install `pnpm` with `npm install -g pnpm`
4. Install all other dependencies with `pnpm install --frozen-lockfile`

## Database Initialization

A PostgreSQL server is required to initialize the database.

1. Run the `/src/db/init.sql` script on your PostgreSQL server to create the `items` database.
2. Run all database migrations with `pnpm migrate:latest`
3. Todo, seed data...

## Creating a new migration

To create a new migration, run `pnpm --name=your_name_here new-migration`

## Environment Variables

Create a new file `.env.local` in the root of the project. Copy the contents of `env.sample` into it, and update the values to match your database settings.
