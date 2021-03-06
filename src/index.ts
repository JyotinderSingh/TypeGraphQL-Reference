import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { redis } from "./redis";
import path from "path";

require("dotenv").config();

const main = async () => {
  await createConnection();

  const SESSION_SECRET = process.env.SESSION_SECRET;

  const schema = await buildSchema({
    // below line looks at all directories inside the modules folder, and picks resolvers (id it finds any)
    // from all the TS files
    resolvers: [path.join(__dirname, "modules", "**", "*.ts")],
    authChecker: ({ context: { req } }) => {
      // Will return false if userId is not set (meaning user is not logged in)
      return !!req.session.userId;
    },
  });

  const apolloServer = new ApolloServer({
    schema,
    // We pass a function to our context that accesses the request object
    // provided by Express, and we return it as it is to make it available in the context
    // And as we are passing a function we get a new req/res object on every call
    context: ({ req, res }: any) => ({ req, res }),
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      // the following is the host that we accept our frontend to be at
      origin: "http://localhost:3000",
    })
  );

  // you want to apply the session middleware anytime before you applyMiddleware on apolloServer
  // Otherwise our resolvers wil get called before we actually have our session ready
  const sessionOption: session.SessionOptions = {
    store: new RedisStore({
      client: redis as any,
    }),
    name: "qid",
    secret: SESSION_SECRET || "",
    // resave and saveUninitialized are turned off so that we
    // don't constantly create a new session for the user unless we change something
    resave: false,
    saveUninitialized: false,
    cookie: {
      // httpOnly so that JS can't access it
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
    },
  };

  app.use(session(sessionOption));

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000/graphql");
  });
};

main();
