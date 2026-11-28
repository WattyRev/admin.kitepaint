[![Master][actions-badge]][actions]

[actions-badge]: https://github.com/WattyRev/admin.kitepaint/actions/workflows/master.yml/badge.svg
[actions]: https://github.com/WattyRev/admin.kitepaint/actions

# admin.kitepaint

KitePaint Admin is a FrontEnd application that provides tools for administration of KitePaint.com. It is a React app bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Scripts

- `npm start` runs the app on [http://localhost:3000](http://localhost:3000) against the local mock API (`mock-api/`, port 13390).
- `npm test` runs the Jest tests in watch mode. Add `-- --coverage` for a coverage report.
- `npm run lint` runs ESLint.
- `npm run build`, `build:beta` and `build:prod` build the app into `build/` using the matching environment from `.env.js`.
- `npm run deploy:beta` and `deploy:prod` build and upload `build/` over SFTP. They need the `SFTP_HOST`, `SFTP_USER` and `SFTP_PASS` environment variables.

Pushes to `staging` deploy to beta and pushes to `master` deploy to production, after tests pass (see `.github/workflows`).
