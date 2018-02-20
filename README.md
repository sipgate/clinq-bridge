# CLINQ CRM-Bridge Server

This is the CLINQ CRM-Bridge Server.
It provides a unified way to connect the CLINQ browser extension to any CRM software.

## Bootstrapping a new bridge

If you want to bootstrap a new CRM-Bridge you can use one of these repositories:

* [JavaScript](https://github.com/sipgate/clinq-crm-bridge-boilerplate)
* [TypeScript](https://github.com/sipgate/clinq-crm-bridge-boilerplate-typescript)

## Installation

```shell
npm install --save clinq-crm-bridge
# or
yarn add clinq-crm-bridge
```

## Quick Start

```js
const bridge = require("clinq-crm-bridge");

const adapter = {
	getContacts: async apiKey => {
		// TODO: Fetch contacts from CRM using apiKey or throw on error
		return [
			{
				name: "Benjamin Kluck",
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
