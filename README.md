# @moshontong/winston-transport-sentry-bun

`@moshontong/winston-transport-sentry-bun` is a Winston v3 transport for sending logs to [Sentry](https://sentry.io) using the `@sentry/bun` SDK. This package allows you to easily integrate Sentry into your logging pipeline for error tracking and monitoring.

## Features

- Supports Sentry logging for various severity levels (`info`, `error`, `debug`, etc.).
- Automatically captures and sends exceptions to Sentry.
- Allows tagging, user context, and additional metadata with logs.
- Fully compatible with Winston v3 and Bun runtime.

## Installation

Install the package and its dependencies:

```bash
bun add @moshontong/winston-transport-sentry-bun winston
```

## Usage

Below is an example of how to configure and use the transport in your application.

### Example

```javascript
import {
  SentryTransport,
  type SentryTransportOptions,
} from "@moshontong/winston-transport-sentry-bun/sentry-winston";
import winston from "winston";

// Configure SentryTransport options
const options: SentryTransportOptions = {
  sentry: {
    dsn: Bun.env.SENTRY_DSN, // Replace with your Sentry DSN
    environment: Bun.env.APP_MODE, // Set environment (e.g., production, staging)
    enabled: Bun.env.APP_MODE === "production", // Enable only in production
  },
  level: "error", // Log errors to Sentry
  format: winston.format.combine(
    winston.format.label({ label: "background-worker" }), // Custom label
    winston.format.timestamp(), // Add timestamp
    winston.format.json() // JSON format for Sentry logs
  ),
};

// Create a logger instance
const logger = winston.createLogger({
  level: Bun.env.APP_MODE === "production" ? "info" : "debug", // Set log level based on environment
  format: winston.format.combine(
    winston.format.colorize(), // Add color to the console output
    winston.format.simple() // Simple text format for console logs
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new SentryTransport(options), // Log to Sentry
  ],
});

// Example logging
logger.info("This is an info message"); // Logs to console only
logger.error("This is an error message"); // Logs to console and Sentry

export default logger;
```

## Configuration Options

### `SentryTransportOptions`

| Option          | Type                        | Description                                                                 |
|------------------|-----------------------------|-----------------------------------------------------------------------------|
| `sentry`         | `Sentry.BunOptions`        | Configuration options for Sentry (e.g., `dsn`, `environment`, etc.).       |
| `level`          | `string`                   | The log level to capture (e.g., `error`, `info`, `debug`).                 |
| `silent`         | `boolean`                  | If `true`, suppresses sending logs to Sentry.                              |
| `levelsMap`      | `Record<string, string>`   | Custom mapping of Winston log levels to Sentry severity levels.            |
| `skipSentryInit` | `boolean`                  | If `true`, skips initializing Sentry (useful if already initialized).      |
| `format`         | `winston.Logform.Format`   | Custom formatting for logs sent to Sentry.                                 |

## Environment Variables

This package supports the following environment variables for easy configuration:

| Variable          | Description                                      |
|--------------------|--------------------------------------------------|
| `SENTRY_DSN`       | Your Sentry DSN for sending logs.                |
| `APP_MODE`         | Application environment (`production`, `dev`).   |
| `SENTRY_DEBUG`     | Enable Sentry debug mode (optional).             |

## Advanced Features

### Adding Tags, User Context, and Metadata

You can include additional context in your logs by adding `tags`, `user`, or `meta` fields to your log messages:

```javascript
logger.error("Error occurred", {
  tags: { feature: "background-job" }, // Add tags
  user: { id: "1234", email: "user@example.com" }, // Add user context
  someMetaKey: "someMetaValue", // Add extra metadata
});
```

### Capturing Exceptions

If a log contains an `Error` object, the transport will capture it as an exception in Sentry:

```javascript
try {
  throw new Error("Something went wrong");
} catch (error) {
  logger.error("Caught an exception", { error });
}
```

## Contributing

Contributions are welcome! If you encounter bugs or have suggestions, feel free to create an issue or submit a pull request on [GitHub](https://github.com/moshOntong-IT/winston-transport-sentry-node).

## License

This package is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.