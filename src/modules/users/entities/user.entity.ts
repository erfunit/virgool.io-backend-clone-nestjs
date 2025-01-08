import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { OTPEntity } from './otp.entity';

@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  otpId: number;

  @OneToOne(() => OTPEntity, (otp) => otp.user, {
    nullable: true,
  })
  @JoinColumn()
  otp: OTPEntity;

  @UpdateDateColumn()
  updated_at: Date;
}
