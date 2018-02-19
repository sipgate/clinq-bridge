# CLINQ CRM-Bridge Server

## Installation

```shell
yarn add clinq-crm-bridge
```

## Quick Start

```js
const bridge = require("clinq-crm-bridge");

const adapter = {
	getContacts: function() {
		return Promise.resolve([{ name: "Benjamin Kluck", email: "ben@fug.lu" }]);
	}
};

bridge.start(adapter);
```
