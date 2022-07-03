# Monorepo structure

In this guide, we will explore the Novu mono-repo structure and high-level structure of the different libraries and services we use.

![](/img/monorepo-structure.jpeg)

## Setting up the monorepo

Novu uses [PNPM](https://pnpm.js.org/) as its package manager, and [NX](https://nx.dev/) as its build CLI tool. PNPM help with reducing the installation time and generates symlinks to all the internal packages we use.

To initialize the monorepo, run the following command from the root of the project:

```bash
npm run setup:project
```

This will:

- run `pnpm install`, that will download all the needed dependencies and create symlinks for packages.
- will copy the `.env.example` file to the `.env` file for the API service
- will execute a `npm run build` command to build all the dependency tree locally.

## Apps

The apps folder contains high-level applications and API’s. The apps outputs usually contain deployable units that a user can interact with either as an API or as a web/cli application.

### API

The API package is our main service for handling backend logic. It handles anything from authentication, authorization, notification template management, triggering events, etc... This is where the Novu business logic is handled.

### WS aka Web-Socket

This is the WebSocket NestJs server, it connects to the widget and provides real-time updates about new notifications to the widget consumer.

### WEB aka Admin Panel

This is the Novu admin panel, it’s used to visually communicate with the API. You can configure templates, manage content, enable or disable notifications, visually track the notification activity feed, etc...

The `WEB` project is a create-react-app built, well, with React 😄

### Widget

This is the client of our embeddable notification center widget. It is consumed mainly with the embed script, in an Iframe. We can access it on port 4500 to interact with it directly.

## Libs

### @novu/dal

The `DAL` is our Data-Access-Layer, this is our connection to the DB service and wraps MongoDB and mongoose. When another service or API needs to consume the DB, it does not do that directly but uses the DAL as an interface. Importing `mongoose` directly outside the `dal` is not allowed.

### @novu/testing

This is a utility library that contains testing helpers, the testing helpers can generate a test session or other functionality for e2e and unit-tests we use between our services.

### @novu/shared

The shared library contains reusable code and typescript interfaces between client and server packages. Code in the shared library should not contain any sensitive content because it can be accessed and downloaded by a web or other clients.

### @novu/embed

This is the connector between our client's web app and the widget project. It’s a small shim script that generates an iframe and attaches it to a client-specified div to host the notification widget.

If you are familiar with the google analytics embed snippet or intercom-like embeds it uses the same mechanics.

## Packages (on npm)

### @novu/node

A Standalone Node.js wrapper around the Novu API. Exists to provide type-safe an easier access to the different API endpoint Novu exposes (Triggers, subscriber, etc…).

### @novu/nest

A Nest.js  wrapper around the `@novu/node` package created by the community to easily interact with the core library from a nest project. Also released on NPM as a package

### @novu/notification-center

React component library that contains widget bell with the notification center. Can get override of components like ‘bell icon’, ‘notification center’.

## Providers

These are the API wrappers created by the community to wrap communication providers in the following channels:

- Email
- SMS
- Push
- Web-Push
- Direct (Slack, MS Teams, Whatsapp, etc...)
