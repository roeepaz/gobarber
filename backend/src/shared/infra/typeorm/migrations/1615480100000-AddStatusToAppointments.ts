import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddStatusToAppointments1615480100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['pending', 'approved', 'rejected', 'cancelled'],
        default: "'pending'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('appointments', 'status');
  }
}
