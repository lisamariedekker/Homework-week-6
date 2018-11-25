import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, ValidateIf, IsIn } from 'class-validator'

export const boardColor = ['red', 'blue', 'green', 'yellow', 'magenta']

const defaultBoard = [
  ['o', 'o', 'o'],
  ['o', 'o', 'o'],
  ['o', 'o', 'o']
]

@Entity()
export default class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @Column('text', { nullable: false })
  name: String

  @ValidateIf(o => o.color)
  @IsIn(boardColor)
  @Column('text', { nullable: false })
  color: String

  @Column('json', { default: defaultBoard })
  board: JSON
}