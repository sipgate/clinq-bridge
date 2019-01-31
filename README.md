# CLINQ Bridge Framework

This is the CLINQ Bridge framework for developing integration services.
It provides a unified way to connect the CLINQ web application to any contact provider.

## Bootstrapping a new bridge

If you want to bootstrap a new CLINQ Bridge you can use this repository:

[clinq-bridge-boilerplate](https://github.com/sipgate/clinq-bridge-boilerplate)

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
  // Provide either the full name or first and last name, not both
  name: null, // or null
  firstName: "Walter", // or null
  lastName: "Geoffrey", // or null
  organization: "Rocket Science Inc.", // or null
  contactUrl: "http://myapp.com/contacts/abc123", // or null
  avatarUrl: "http://myapp.com/avatar/abc123.png", // or null
  email: "walter@example.com", // or null
  phoneNumbers: [
    {
      label: "MOBILE", // or "WORK" or "HOME"
      phoneNumber: "+4915799912345"
    }
  ]
}
```

The minimum adapter implements the `getContacts` method:

```js
const bridge = require("@clinq/bridge");
const fetch = require('node-fetch');

const { ServerError } = bridge;

const adapter = {
  getContacts: async ({ apiKey, apiUrl }) => {
    // Fetch contacts using apiKey and apiUrl or throw on error
    const response = await fetch(`${apiUrl}/api/contacts`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    if (response.status === 401) {
      throw new ServerError(401, "Unauthorized");
    }
    if (response.ok) {
      const contacts = await response.json();
      // TODO: Convert contact to the structure above
      return contacts;
    } else {
      throw new ServerError(500, "Could not fetch contacts");
    }
  }
};

bridge.start(adapter);
```
