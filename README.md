# CLINQ Bridge Library

This is the CLINQ Bridge library for developing integration services.
It provides a unified way to connect the CLINQ web application to any contact provider.

## Bootstrapping a new bridge

If you want to bootstrap a new CLINQ Bridge you can use one of these repositories:

- JavaScript: [clinq-bridge-boilerplate](https://github.com/sipgate/clinq-bridge-boilerplate)
- TypeScript: [clinq-bridge-boilerplate-typescript](https://github.com/sipgate/clinq-bridge-boilerplate-typescript)

## Installation

```shell
npm install --save @clinq/bridge
# or
yarn add @clinq/bridge
```

## Quick Start

```js
const bridge = require("@clinq/bridge");

const adapter = {
	getContacts: async ({ apiKey, apiUrl }) => {
		// TODO: Fetch contacts using apiKey and apiUrl or throw on error
		return [
			{
				id: "abc123",
				name: "Walter Geoffrey",
				company: "Rocket Science Inc.",
				email: "walter@example.com",
				phoneNumbers: [
					{
						label: "Mobile",
						phoneNumber: "+4915799912345"
					}
				]
			}
		];
	}
};

bridge.start(adapter);
```
