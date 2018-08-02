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

CLINQ accepts contacts in this format:

```js
{
  id: "abc123",
  name: "Walter Geoffrey",
  company: "Rocket Science Inc.", // or null
  email: "walter@example.com", // or null
  phoneNumbers: [
    {
      label: "Mobile", // or null
      phoneNumber: "+4915799912345"
    }
  ]
}
```

The minimum adapter implements the `getContacts` method:

```js
const bridge = require("@clinq/bridge");
const fetch = require('node-fetch');

const adapter = {
  getContacts: async ({ apiKey, apiUrl }) => {
    // Fetch contacts using apiKey and apiUrl or throw on error
    const response = await fetch(`${apiUrl}/api/contacts`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    if (response.status === 401) {
      bridge.unauthorized();
    }
    if (response.ok) {
      const contacts = await response.json();
      // TODO: Convert contact to the structure above
      return contacts;
    } else {
      throw new Error("Could not fetch contacts :(");
    }
  }
};

bridge.start(adapter);
```
