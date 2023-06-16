# Ortege Widgets

Common react components for projects using ortege.

## Installation

```sh
# Install with npm
npm install @ortege/widgets

# Or install with yarn
yarn add @ortege/widgets
```

### Peer dependencies

This package requires `@ortege/sdk`, `react`, and `react-dom`.

## Contents

### Components

- `ChainLogo`: A logo icon for a given chain ID
- `MessageTimeline`: A timeline showing stages of message delivery
- `WideChevron`: A customizable version of ortege's chevron logo

### Hooks

- `useMessage`: Fetch data about a message from the ortege Explorer
- `useMessageStage`: Fetch and compute message delivery stage and timings
- `useMessageTimeline`: Fetch message data for use with `MessageTimeline`

## Learn more

For more information, see the [ortege documentation](https://docs.ortege.xyz/ortege-docs/developers/getting-started).
