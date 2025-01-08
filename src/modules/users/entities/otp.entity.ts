import { Column, Entity, OneToOne } from 'typeorm';
import { EntityName } from '../../../common/enums/entity.enum';
import { BaseEntity } from 'src/common/abstracts/base.entity';
import { UserEntity } from './user.entity';

@Entity(EntityName.OTP)
export class OTPEntity extends BaseEntity {
  @Column()
  code: string;

  @Column()
  expiresIn: Date;

  @Column()
  userId: number;

  @OneToOne(() => UserEntity, (user) => user.otp, { onDelete: 'CASCADE' })
  user: UserEntity;
}
