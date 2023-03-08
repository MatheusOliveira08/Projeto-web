import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class VideoHistory extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public videoId: number

  @column()
  public userId: number

  @column()
  public titulo: string

  @column()
  public username: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
