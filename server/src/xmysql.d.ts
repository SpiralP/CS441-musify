interface SqlConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  readOnly: boolean;
}

declare module "xmysql/lib/xapi.js" {
  import mysql from "mysql";

  class Xapi {
    constructor(
      sqlConfig: SqlConfig,
      mysqlPool: mysql.Pool,
      app: Express.Application
    );

    init(cb: (err: any, results: any) => void): void;
  }

  export = Xapi;
}

declare module "xmysql/lib/util/cmd.helper.js" {
  function handle(sqlConfig: SqlConfig): void;

  export { handle };
}
