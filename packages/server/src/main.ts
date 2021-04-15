import {ApolloServer} from "apollo-server";
import {Resolvers} from "./api/resolvers";
import { ApolloError } from 'apollo-server-errors';

// TODO: Migrate to GraphQL-tools: https://www.graphql-tools.com/docs/migration-from-import/
import {importSchema} from "graphql-import";
import {KeyRotator} from "./keyRotator";
import {RequestContext} from "./requestContext";
import {ValueGenerator} from "@circlesland/auth-util/dist/valueGenerator";
import {App} from "@circlesland/auth-data/dist/apps";

export class Main
{
    private readonly _resolvers: Resolvers;
    private readonly _keyRotator: KeyRotator;
    private _server: ApolloServer|null = null;

    constructor()
    {
        this._resolvers = new Resolvers();
        this._keyRotator = new KeyRotator();
    }

    async run()
    {
        if (!process.env.SVC_PORT)
        {
            throw new Error("The SVC_PORT environment variable is not set.");
        }
        if (!process.env.KEY_ROTATION_INTERVAL)
        {
            throw new Error("The KEY_ROTATION_INTERVAL environment variable is not set.");
        }

        // TODO: Determine the CORS origins in a per-request fashion instead of loading them all at startup. This also
        const corsOrigins = await App.getAllCorsOrigins();
        console.log("cors origins: ", corsOrigins);

        const apiSchemaTypeDefs = importSchema("../src/api/api-schema.graphql");
        this._server = new ApolloServer({
            context: RequestContext.create,
            typeDefs: apiSchemaTypeDefs,
            resolvers: {
                Mutation: this._resolvers.mutationResolvers,
                Query: this._resolvers.queryResolvers
            },
            cors: {
                origin: corsOrigins,
                credentials: true
            },
            formatError: (err) => {
                const errorId = ValueGenerator.generateRandomUrlSafeString(8);
                console.error({
                    timestamp: new Date().toJSON(),
                    errorId: errorId,
                    error: JSON.stringify(err)
                });
                return {
                    path: err.path,
                    message: `An error occurred while processing your request. `
                        + `If the error persists contact the admins at '${process.env.ADMIN_EMAIL}' `
                        + `and include the following error id in your request: `
                        + `'${errorId}'`
                }
            }
        });

        await this._server.listen({
            port: parseInt(process.env.SVC_PORT)
        });

        console.log(`Listening on http://0.0.0.0:${process.env.SVC_PORT}`);

        await this._keyRotator.start(parseInt(process.env.KEY_ROTATION_INTERVAL));
    }
}

new Main()
    .run()
    .then(() => "Running");
