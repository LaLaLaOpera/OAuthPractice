// import { DataSource } from 'typeorm';
// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { RLSConnection } from '@avallone-io/rls';
// @Injectable()
// export class CustomRLSProvider implements OnModuleInit {
//   private rlsConnection: RLSConnection;

//   constructor(private readonly dataSource: DataSource) {}

//   async onModuleInit() {
//     // Get tenantId and actorId from request or any other source
//     const tenantId = 'someTenantId';
//     const actorId = 'someActorId';

//     // Create a new RLSConnection instance
//     this.rlsConnection = new RLSConnection(this.dataSource, {
//       tenantId,
//       actorId,
//     });
//   }

//   public getRLSConnection(): RLSConnection {
//     return this.rlsConnection;
//   }
// }
