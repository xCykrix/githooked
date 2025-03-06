
# githooked

Tool | DevOps - Beta - Manage git hooks across your project with cross-platform support and mobility. Comfortably integrates with git to allow custom scripting. Designed for Bash 4.0 or compatible. Compatible with Git SCM (Git for Windows).

Find more in-depth guidance and documentation at the [GitHub Wiki](https://github.com/xCykrix/githooked/wiki)

![GitHub License](https://img.shields.io/github/license/xCykrix/githooked?style=for-the-badge&logo=github&cacheSeconds=86400)
![GitHub Issues](https://img.shields.io/github/issues/xCykrix/githooked?style=for-the-badge&logo=github&cacheSeconds=3600)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/xCykrix/githooked?style=for-the-badge&logo=github&cacheSeconds=3600)
![GitHub Discussions](https://img.shields.io/github/discussions/xCykrix/githooked?style=for-the-badge&logo=github&cacheSeconds=3600)

## Installation / Usage

https://github.com/xCykrix/githooked/wiki

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
  ./githooked install
  ./githooked generate prepare-commit-msg pre-commit pre-push
```

## Support

For support, please open an issue or reach out via Discord.

## Contributing

This project utilizes a Makefile to control the development, workflow, and distribution of the project. Dev Container support is required and VSCode is recommended.

When creating a clone, please execute the following command(s):

```sh
$ make setup
$ make build
```

Application is built to `./dist/` when compiled by the `make build` task.

## Releases

Tag-based releases to GitHub have been automated. This project is only published to GitHub Releases.

## Acknowledgements

- [Typicode's Husky](https://github.com/typicode/husky): Inspiration of githooked fundamentals.
