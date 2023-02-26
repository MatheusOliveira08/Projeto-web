import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Token from './Token'


export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Token)
  public tokens: HasMany<typeof Token>

  @hasMany(() => Token,{
    onQuery: (query) => query.where('type', 'PASSWORD_RESET')
  })
  public passwordResetTokens: HasMany<typeof Token>
  
  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
