# Activity Aggregator

Activity Aggregator is a Node.js application that fetches time entries from Harvest and assigned tasks from ClickUp, then it posts a summary on Slack.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Installation

Before you begin, ensure you have [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed.

Install dependencies:
```bash
pnpm install
```

## Usage

To run the application locally, use the following command:
```bash
pnpm run dev
```

## Commands

- `pnpm run dev`: Runs the application in development mode.
- `pnpm run build`: Builds the application for production.
- `pnpm run start`: Start the application locally.

## Configuration

To configure the application, you need to set up environment variables. Create a .env file from .env.template in the root directory of the project with the following content:

```bash
NODE_ENV=development

# SLACK
SLACK_APP_WEBHOOK_URL=

# CLICKUP
CLICKUP_API_TOKEN=
CLICKUP_TEAM_ID= # Workspace ID on ClickUp
CLICKUP_USER_ID=

# HARVEST
HARVEST_ACCOUNT_ID=
HARVEST_USER_ID=
HARVEST_API_TOKEN=

# GITHUB
GITHUB_TOKEN=


### PRODUCTION
# SLACK_APP_WEBHOOK_URL=
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Push to the branch.
6. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.