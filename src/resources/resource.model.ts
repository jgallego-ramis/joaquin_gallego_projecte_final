import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.model';
export const RESOURCE_TYPES = [
  'laptop',
  'room',
  'software',
  'vehicle',
] as const;
export const RESOURCE_STATUSES = ['available', 'assigned'] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];
export type ResourceStatus = (typeof RESOURCE_STATUSES)[number];

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  name!: string;
  @Column()
  type!: ResourceType;
  @Column()
  status!: ResourceStatus;
  @Column()
  location!: string;
  @Column()
  createdAt!: string;
  @Column({ nullable: true })
  assignedToUserId!: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignedToUserId' })
  assignedToUser?: User | null;
}
