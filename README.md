
# githooked

Tool | DevOps - Beta - Manage git hooks across your project with cross-platform support and mobility. Comfortably integrates with git to allow custom scripting. Designed for Bash 4.0 or compatible. Compatible with Git SCM (Git for Windows).

Find more in-depth guidance and documentation at https://xcykrix.github.io/githooked.html

![GitHub License](https://img.shields.io/github/license/xCykrix/githooked?style=for-the-badge&logo=github&cacheSeconds=86400)
![GitHub issues](https://img.shields.io/github/issues/xCykrix/githooked?style=for-the-badge&logo=github&cacheSeconds=3600)
![GitHub pull requests](https://img.shields.io/github/issues-pr/xCykrix/githooked?style=for-the-badge&logo=github&cacheSeconds=3600)
![GitHub Discussions](https://img.shields.io/github/discussions/xCykrix/githooked?style=for-the-badge&logo=github&cacheSeconds=3600)

## Installation

https://xcykrix.github.io/githooked.html#githooked-installation-and-help

## Usage

```
$ ./githooked --help
githooked - Manage git hooks across your project with cross-platform support and mobility. Comfortably integrates with git to allow custom scripting. Designed for Bash 4.0 or compatible. Compatible with Git SCM (Git for Windows).

Usage:
  githooked [OPTIONS] COMMAND
  githooked [COMMAND] --help | -h
  githooked --version | -v

Commands:
  install    Install githooked runtime on the current path. Requires './.git/' to be present.
  generate   Generate default githooked 'no-op' placeholder hooks.

Options:
  --trace, -t
    Print additional information and details.

  --help, -h
    Show this help

  --version, -v
    Show version number

Examples:
  ./githooked --help
  ./githooked install --help
  ./githooked generate --help
  ./githooked generate prepare-commit-msg pre-commit pre-push
  ./githooked upgrade
```

## Contributing

This project utilizes a Makefile to control the development, workflow, and distribution of the project. This project requires the Snap Store to be installed on your Linux Operating System. These projects are designed for development with Ubuntu Linux 22.04.

When creating a clone, please execute the following command(s):

```sh
$ make setup
$ make build-dev
```

Application is built to `./dist/` when compiled by the `make build-dev` task.

## Support

For support, please open an issue or discussion on GitHub for this project.

## Acknowledgements

- [Typicode's Husky](https://github.com/typicode/husky): Inspiration of githooked fundamentals.
