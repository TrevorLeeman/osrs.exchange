## (WIP) osrs-prices.trevorleeman.com

Item flipping utility for the game Old School Runescape. Leverages the OSRS wiki [Real-Time Prices API](https://oldschool.runescape.wiki/w/RuneScape:Real-time_Prices).

Built using NextJS, PostgreSQL, NextUI, and SCSS modules. Hosted on Vercel and AWS RDS.

## Initialize Project

1. Clone this repo.
2. Download [Docker Desktop](https://www.docker.com/products/docker-desktop/).
3. Ensure you have at least [Node.js](https://nodejs.org/en/download/) 18.0 and npm 8.0 installed. You can check using `node -v` and `npm -v`, respectively.
4. Navigate to the root of the project. Install all other dependencies with `npm install --frozen-lockfile`
5. Create a new file `.env.local` in the root of the project. Copy the contents of `.env.sample` into it.
6. Start the local dev server with `npm run dev`. On the first run, this will build and install the PostgreSQL container.
7. Open a new terminal window. Run all database migrations with `npm run migrate:latest`.
8. Seed the database with `npm run seed`.
9. Navigate to `127.0.0.1:3000` in your browser and you should see the site up and running!

## Creating a new migration

To create a new migration, run `npm --name=your_name_here run migrate:new`
