import { Injectable, OnModuleInit, INestApplication } from "@nestjs/common";
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService  extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        try{
        await this.$connect();
        console.log('                 Prisma connected Database: ok!');
        } catch (error) {
        console.log('--------> Prisma not connected');
        console.error(error);
       }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
    // async enableShutdownHooks(app: INestApplication) {  
    //     this.$on('beforeExit', async () => {
    //         await app.close();
    //     });
    // }

}