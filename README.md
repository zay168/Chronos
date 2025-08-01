# Chronos

Simple React application to manage and visualize a timeline. 

## Development

1. Install dependencies
   ```bash
   npm install
   ```
2. Initialize the local database
   ```bash
   npx prisma db push
   ```
   This creates the SQLite file specified in `.env`.
3. Start the development server
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` by default.
4. Start the API server in another terminal
   ```bash
   npm run server
   ```

## Build

To create a production build run:

```bash
npm run build
```

And preview it with:

```bash
npm run preview
```

## Environment

This project uses a local SQLite database managed by Prisma. An example
`.env` file is included in the repository. It defines the database location
and the API server port:

```bash
DATABASE_URL=file:./dev.db
PORT=3001
```

The file can be found at the project root. Feel free to adjust the values
if you need to change the database path or server port.
