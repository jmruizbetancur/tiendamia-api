import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692290704593 implements MigrationInterface {
  name = 'Migration1692290704593'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar, "url" varchar, "price" decimal NOT NULL, "quantity" integer NOT NULL)`);
    await queryRunner.query(`CREATE TABLE "order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "create_date" datetime NOT NULL DEFAULT (datetime('now')), "status" varchar NOT NULL, "client" varchar NOT NULL, "shipping_address" varchar NOT NULL, "shipping_promise" date NOT NULL)`);
    await queryRunner.query(`CREATE TABLE "order_products" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL, "order_id" integer, "product_id" integer, CONSTRAINT "FK_f258ce2f670b34b38630914cf9e" FOREIGN KEY ("order_id") REFERENCES "order" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_2d58e8bd11dc840b39f99824d84" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "order_products"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "product"`);
  }

}
