# todo-cli

A small command-line to-do list written in TypeScript and run directly by Node.js.

## Features

- Add, list, complete and remove tasks
- Tasks are stored in a JSON file
- Input from the command line and from the file is validated
- Clear error messages and exit codes

## Requirements

Node.js 22.18 or newer (it runs `.ts` files without a build step).

## Installation

```
git clone git@github.com:yaroslav-svidersky/todo-cli.git
cd todo-cli
npm install
```

## Usage

```
node src/cli.ts add "Buy bread"
node src/cli.ts list
node src/cli.ts done 1
node src/cli.ts remove 1
node src/cli.ts help
```

Tasks are saved to `output/tasks.json`. Set the `TODO_FILE` environment variable to use another file:

```
TODO_FILE=/tmp/tasks.json node src/cli.ts list
```

## Development

```
npm test           # run the tests
npm run typecheck  # check types with tsc
npm run format     # format the code with Prettier
```

## Project structure

- `src/tasks.ts` – pure functions that work with the task list
- `src/storage.ts` – loading and saving tasks, validation of the file contents
- `src/cli.ts` – command-line interface
