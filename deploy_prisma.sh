#!/bin/bash
DO_PGSQL_CONNECTIONSTRING=${DO_PGSQL_CONNECTIONSTRING//\//\\/}
DO_PGSQL_CONNECTIONSTRING=${DO_PGSQL_CONNECTIONSTRING/\&/\\&}
sedArgument="s/REPLACE_ME_WITH_THE_CONNECTION_STRING/${DO_PGSQL_CONNECTIONSTRING}/g"
cp -f packages/data/src/schema_template.prisma packages/data/src/schema.prisma
sed -i "${sedArgument}" packages/data/src/schema.prisma
cd packages/data/src
npx prisma --version
npx prisma db push --preview-feature