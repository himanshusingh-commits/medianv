import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  symbol: string; 

  @Column()
  name: string;  

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  currentPrice: number;
}