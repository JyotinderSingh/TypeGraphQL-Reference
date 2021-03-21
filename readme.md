# TypeGraphQL Boilerplate

I'm a noob so I keep such repos on my GitHub to refer back to in the future (2 weeks from now), when I've forgotten how this shit works.

## How this works

- We use TypeGraphQL to make it easier to use TS in GraphQL
- We use Apollo Server to setup a GraphQL server, using Express
- We use TypeORM as the ORM of choice, which makes using Postgresql easier
- We use bcrypt for hashing passwords (not the best choice, but is easy to setup - you probably want to use a stronger hashing library in production)
- we use sessions to keep user logged in, we use the express-session library for this
- connect-redis provides Redis session storage for Express
  - ioredis is the redis client that we're going to use
  - we also install cors so that we don't face problems with cookies
- We send confirmation emails to users on sign up to confirm their accounts, which contain a link that the user needs to click to be able to login to their account
