# Contributing to Novu

Thank you for showing an interest in contributing to Novu! All kinds of contribution are valuable to us. In this guide we will cover how you can quickly onboard and make your first contribution.

## Submitting an issue

Before submitting a new issue, please search the issues and discussion tabs maybe an issue or discussion already exists and might inform you of workarounds, or you can give new information.

While we want to fix all the issues, before fixing a bug we need to be able to reproduce and confirm it. Please provide us with a minimal reproduction scenario using a repository or [Gist](https://gist.github.com/). Having a live, reproducible scenario gives us the information without asking questions back & forth with additional questions like:

- 3rd-party libraries and their versions, mainly providers, but not exclusively
- a use-case that fails

Without said minimal reproduction, we won't be able to investigate all issues, and the issue might not be resolved.

You can open a new issues with this new [issue form](https://github.com/novuhq/novu/issues/new).

## Projects setup and Architecture

### Requirements

- Node.js version v14.19.3
- MongoDB
- Redis
- **(Optional)** pnpm - Needed if you want to install new packages
- **(Optional)** localstack (required only in S3 related modules)

### Setup the project

The project is a monorepo, meaning that it is a collection of multiple packages managed in the same repository.

To learn more about the project structure visit [https://docs.novu.co/community/monorepo-structure](https://docs.novu.co/community/monorepo-structure).

After cloning your fork, you will need to run the `npm run setup:project` command to install and build all dependencies.

To learn a detailed guide on running the project locally, visit [https://docs.novu.co/community/run-locally](https://docs.novu.co/community/run-locally).

## Missing a Feature?

If a feature is missing you can _request_ a new one by [submitting an issue](#submitting-an-issue) to our GitHub Repository.
If you would like to _implement_ it, an issue with your proposal must be submitted first, to be sure that we can use it. Please consider:


## Coding guides

To ensure consistency throughout the source code, keep these rules in mind as you are working:
- All features or bug fixes must be tested by one or more specs (unit-tests).
- We use [Eslint default rule guide](https://eslint.org/docs/rules/), with minor changes. An automated formatter is available using prettier.

## Need help? Questions and suggestions

Questions, suggestions and thoughts are most welcome. Feel free to open a [Github Discussion](https://github.com/novuhq/novu/discussions). We can also be reached in our [Discord Channel](https://discord.gg/heTZ9zJd).

## Ways to contribute

- Try the Novu API and platform and give feedback
- Add new providers
- Help with open issues
- Share your thoughts and suggestions with us
- Help create tutorials and blog posts
- Request a feature
- Report a bug
- **Improve documentation** - fix incomplete or missing [docs](https://docs.novu.co/), bad wording, examples or explanations.


## Missing a provider?

If you are in need of a provider we do not yet have, you can request a new one by [submitting an issue](#submitting-an-issue). Or you can build a new one by following our [create a provider guide](https://docs.novu.co/docs/community/create-provider).
