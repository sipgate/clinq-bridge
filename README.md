# CLINQ CRM-Bridge Server

## Installation

```shell
yarn add clinq-crm-bridge
```

## Quick Start

```js
const bridge = require("clinq-crm-bridge");

const adapter = {
	getContacts: () =>
		Promise.resolve([
			{ name: "Benjamin Kluck", phoneNumbers: ["01579-9912345"] }
		])
};

bridge.start(adapter);
```
