import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class VirgoolBackendClone1736774088317 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create User Table
    // Create User Table
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'username', type: 'varchar', isUnique: true },
          { name: 'phone', type: 'varchar', isNullable: true, isUnique: true },
          { name: 'email', type: 'varchar', isNullable: true, isUnique: true },
          { name: 'password', type: 'varchar', isNullable: true },
          { name: 'otpId', type: 'int', isNullable: true },
          { name: 'profileId', type: 'int', isNullable: true },
          { name: 'new_email', type: 'varchar', isNullable: true },
          { name: 'new_phone', type: 'varchar', isNullable: true },
          { name: 'email_verified', type: 'boolean', default: false },
          { name: 'phone_verified', type: 'boolean', default: false },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // Create Category Table
    await queryRunner.createTable(
      new Table({
        name: 'category',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'title', type: 'varchar', isUnique: true },
          { name: 'priority', type: 'int', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // Create Profile Table
    await queryRunner.createTable(
      new Table({
        name: 'profile',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'nick_name', type: 'varchar' },
          { name: 'bio', type: 'text', isNullable: true },
          { name: 'profile_image', type: 'varchar', isNullable: true },
          { name: 'bg_image', type: 'varchar', isNullable: true },
          { name: 'gender', type: 'varchar', isNullable: true },
          { name: 'birthday', type: 'date', isNullable: true },
          { name: 'linkedin_profile', type: 'varchar', isNullable: true },
          { name: 'x_profile', type: 'varchar', isNullable: true },
          { name: 'userId', type: 'int' },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'profile',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    // Create OTP Table
    await queryRunner.createTable(
      new Table({
        name: 'otp',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'code', type: 'varchar' },
          { name: 'expiresIn', type: 'timestamp' },
          { name: 'userId', type: 'int' },
          { name: 'method', type: 'varchar', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'otp',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKeys('user', [
      new TableForeignKey({
        columnNames: ['otpId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'otp',
        onDelete: 'SET NULL',
      }),
      new TableForeignKey({
        columnNames: ['profileId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'profile',
        onDelete: 'SET NULL',
      }),
    ]);

    // Create Blog Table
    await queryRunner.createTable(
      new Table({
        name: 'blog',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'title', type: 'varchar' },
          { name: 'slug', type: 'varchar', isUnique: true },
          { name: 'time_for_study', type: 'int' },
          { name: 'description', type: 'text' },
          { name: 'content', type: 'text' },
          { name: 'image', type: 'varchar', isNullable: true },
          {
            name: 'status',
            type: 'enum',
            enum: ['Draft', 'Published'],
            default: "'Draft'",
          },
          { name: 'authorId', type: 'int' },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'blog',
      new TableForeignKey({
        columnNames: ['authorId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    // Create BlogCategory Table
    await queryRunner.createTable(
      new Table({
        name: 'blog_category',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'blogId', type: 'int' },
          { name: 'categoryId', type: 'int' },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('blog_category', [
      new TableForeignKey({
        columnNames: ['blogId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'blog',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
        onDelete: 'CASCADE',
      }),
    ]);

    // Create BlogBookmark Table
    await queryRunner.createTable(
      new Table({
        name: 'blog_bookmark',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'blogId', type: 'int' },
          { name: 'userId', type: 'int' },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('blog_bookmark', [
      new TableForeignKey({
        columnNames: ['blogId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'blog',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    ]);

    // Create BlogComment Table
    await queryRunner.createTable(
      new Table({
        name: 'blog_comment',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'text', type: 'text' },
          { name: 'accepted', type: 'boolean', default: true },
          { name: 'blogId', type: 'int' },
          { name: 'userId', type: 'int' },
          { name: 'parentId', type: 'int', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('blog_comment', [
      new TableForeignKey({
        columnNames: ['blogId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'blog',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['parentId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'blog_comment',
        onDelete: 'CASCADE',
      }),
    ]);

    // Create BlogLike Table
    await queryRunner.createTable(
      new Table({
        name: 'blog_like',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'blogId', type: 'int' },
          { name: 'userId', type: 'int' },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('blog_like', [
      new TableForeignKey({
        columnNames: ['blogId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'blog',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys and table for blog_like
    await queryRunner.dropForeignKeys(
      'blog_like',
      await queryRunner
        .getTable('blog_like')
        .then((table) => table!.foreignKeys),
    );
    await queryRunner.dropTable('blog_like');

    // Drop foreign keys and table for blog_comment
    await queryRunner.dropForeignKeys(
      'blog_comment',
      await queryRunner
        .getTable('blog_comment')
        .then((table) => table!.foreignKeys),
    );
    await queryRunner.dropTable('blog_comment');

    // Drop foreign keys and table for blog_bookmark
    await queryRunner.dropForeignKeys(
      'blog_bookmark',
      await queryRunner
        .getTable('blog_bookmark')
        .then((table) => table!.foreignKeys),
    );
    await queryRunner.dropTable('blog_bookmark');

    // Drop foreign keys and table for blog_category
    await queryRunner.dropForeignKeys(
      'blog_category',
      await queryRunner
        .getTable('blog_category')
        .then((table) => table!.foreignKeys),
    );
    await queryRunner.dropTable('blog_category');

    // Drop foreign keys and table for blog
    await queryRunner.dropForeignKeys(
      'blog',
      await queryRunner.getTable('blog').then((table) => table!.foreignKeys),
    );
    await queryRunner.dropTable('blog');

    // Drop foreign keys from user table
    await queryRunner.dropForeignKeys(
      'user',
      await queryRunner.getTable('user').then((table) => table!.foreignKeys),
    );

    // Drop table for category
    await queryRunner.dropTable('category');

    // Drop table for user
    await queryRunner.dropTable('user');

    // Drop foreign keys and table for profile
    await queryRunner.dropForeignKeys(
      'profile',
      await queryRunner.getTable('profile').then((table) => table!.foreignKeys),
    );
    await queryRunner.dropTable('profile');

    // Drop foreign keys and table for otp
    await queryRunner.dropForeignKeys(
      'otp',
      await queryRunner.getTable('otp').then((table) => table!.foreignKeys),
    );
    await queryRunner.dropTable('otp');
  }
}
