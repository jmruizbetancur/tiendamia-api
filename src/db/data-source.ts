import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'tiendamiaDB.sqlite',
  entities: [ 'dist/**/*.entity.js' ],
  migrations: [ 
    'dist/db/migrations/*.js', 
    'dist/db/seeders/*.js' 
  ],
  logging: true
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
