import {prisma_ro} from "./prisma_ro";
import {Apps} from "@prisma/client";

export class App
{
    static async findById(appId: string) : Promise<Apps|null>
    {
        return prisma_ro.apps.findUnique({where:{appId: appId}})
    }

    static async getAllCorsOrigins() : Promise<string[]> {
        const apps = await prisma_ro.apps.findMany();
        const deduped = apps
            .map(o => o.corsOrigins.split(";"))
            .reduce((p,c) => p.concat(c), [])
            .reduce((p,c) => {
                p[c] = c;
                return p;
            }, <{[x:string]:any}>{});
        return Object.keys(deduped);
    }
}
