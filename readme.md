# circles.land authentication
Provides an e-mail based login solution for https://github.com/circlesland/circles-platform

## Introduction
This repository contains a nodejs/apollo server that can be used
to verify if a user is either in control of an e-mail account or in possession of
a specific private key.  

The service doesn't provide an account system. It only verifies one of the above claims and 
issues a signed JWT that can proof the fact to another party.

Example token payload:
```json
{
  "iss": "auth.your-domain.tld",
  "sub": "email-of-whom@was-authenticated.tld",
  "subType": "email",
  "aud": [
    "app.your-domain.tld"
  ],
  "exp": 1617143585,
  "iat": 1617143465,
  "jti": "0qoHUKCQ.037GZxC",
  "kid": "http://auth.your-domain.tld/graphql?query=query%20%7B%20keys%28kid%3A%222%22%29%20%7Bid%2C%20validTo%2C%20publicKey%20%7D%7D"
}
```

The generated JWTs can be verified with the [@circlesland/auth-client](https://github.com/circlesland/circles-auth/tree/main/packages/client/dist):
```typescript
import {Client} from "@circlesland/auth-client/packages/client/dist/client";

async function run() {
  const client = new Client("[audience]", "[issuer]");
  const result = await client.verify(`[jwt]`);
  console.log(result) // logs the verified payload or throws on verify()
}
run();
```

## Getting started
### Preparations
**1. Deploy the database:**
```shell
# Create a new directory as working space
mkdir circles-auth-db
cd circles-auth-db

# Get the schema
wget https://github.com/circlesland/circles-auth/edit/main/packages/data/src/schema_template.prisma

# Insert your connection string
yourConnectionString="[your connection string goes here]"
sedArgument="s/REPLACE_ME_WITH_THE_CONNECTION_STRING/${yourConnectionString//\//\\/}/g"
sed -i "${sedArgument}" schema_template.prisma

# Install prisma cli
npm i prisma

# Deploy to your server using prisma cli
npx --no-install prisma db push --schema schema_template.prisma  --preview-feature
```
**2. Gather all required parameters**  
To successfully run the service you will need some information about the environment in which it should run:
* SVC_PORT: The port on which apollo server should listen for connections
* KEY_ROTATION_INTERVAL: How long a signing-key should be valid (in seconds) before a new one is generated
* CONNECTION_STRING_RO: A connection string to a pg_bouncer that pools read-only replicas
* CONNECTION_STRING_RW: The connection string to the write-master.
* SMTP_SERVER, _USER, _PASS, _PORT: Regular SMTP-connection settings. These are used to send the magic login e-mails
* SMTP_SECURE: Can either be 'true' or 'false'. If 'true' then the connection will use TLS.
* ISSUER: Will be used as 'iss' claim in the issued JWTs. Can be any string but is usually a domain or URL you control
* EXTERNAL_URL: The full URL that points to this service from an external network. This value will be used in the
  'kid'-claim of issued JWTs and can be used to get the public part of the signing key to verify the issued JWTs
* ADMIN_EMAIL: The e-mail address of an administrative contact. This e-mail address is returned in some error messages. 

_Note:_ You can use the same connection string for CONNECTION_STRING_RO and CONNECTION_STRING_RW if you want to run the
service without a db-cluster.

### Run the service
**1. Pull the docker image:** 
```shell 
docker pull docker.pkg.github.com/circlesland/circles-auth/server:latest
```

**2. Run the image:**
```shell 
docker run \
 --name circles-auth \
 -d \
 -e SVC_PORT=1234 \
 -e KEY_ROTATION_INTERVAL=86400 \
 -e CONNECTION_STRING_RO='postgres://readonly@your-db-host.tld/db_name?schema=abc' \
 -e CONNECTION_STRING_RW='postgres://readwrite@your-db-host.tld/db_name?schema=abc' \
 -e SMTP_SERVER='smtp.your-provider.tld' \
 -e SMTP_USER='' \
 -e SMTP_PASS='' \
 -e SMTP_SECURE='true'|'false' \
 -e SMTP_PORT=465 \
 -e ISSUER='your-domain.tld' \
 -e EXTERNAL_URL='https://your-domain.tld/route-to-service' \
 -e ADMIN_EMAIL='your-administrative-contact@your-domain.tld' \
 docker.pkg.github.com/circlesland/circles-auth/server:latest 
```
_Note:_ EXTERNAL_URL must not have a trailing slash

### Setup apps (audiences)
Connect to your database and insert all audience apps that should use this service:
```sql
INSERT INTO "Apps" VALUES (
    'my.app.tld' -- appId
  , 'my1.app.tld;my2.app.tld' -- cors origins
  , 'https://my.app.tld/solve-hallenge/' -- redirectUrl
  , 120 --challenge lifetime
  , 120 --token lifetime
);
```
_Notes:_
* The cors origins are loaded on startup, so you currently need to restart the service after you added/altered apps.
* The value for the 'redirectUrl' column must have a trailing slash

### API
```graphql
type Mutation {
  # Sends a challenge to the specified email address and includes the 
  # redirectUrl of the app as well as the challenge code
  loginWithEmail(appId: String!, emailAddress: String!): LoginResponse!
  
  # Encrypts the challenge code with the given public key and returns that as challenge.
  loginWithPublicKey(appId: String!, publicKey: String!): LoginResponse!
  
  # Can be used to exchange a solved challenge against a signed JWT that can proof to 
  # other parties that the challenge was solved.
  verify(oneTimeToken: String!): VerifyResponse!
}

type Query {
  keys(kid: String!): PublicKey
  version: Version
}

type LoginResponse implements ActionResponse {
    success: Boolean!
    errorMessage: String
    challenge: String
}

type VerifyResponse implements ActionResponse {
    success: Boolean!
    errorMessage: String
    type: String
    key: String
    jwt: String!
}
```

### E-Mail template(s)
The mailer template(s) are currently located in [/packages/mailer/src/templates](https://github.com/circlesland/circles-auth/tree/main/packages/mailer/src/templates). They are evaluated with mustache.
The supplied data context looks like this:
```json
{
  "challenge": "the generated challenge code",
  "env": {
    ... all runtime environment variables (also sensitive ones!!)
  }
}
```
All existing paths in the context can be used within the template:
```typescript
export const login:Template = {
  subject: "Your magic login link",
  bodyPlain: `Please click the link below to sign-in: {{env.REDIRECT_URL}}{{challenge}}`,
  bodyHtml: `Please click the link below to sign-in:<br/><a href="{{env.REDIRECT_URL}}{{challenge}}">Sign-in</a>`
}
```