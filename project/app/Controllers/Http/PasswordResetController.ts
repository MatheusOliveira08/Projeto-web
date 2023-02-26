import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail'
import Route from '@ioc:Adonis/Core/Route'
import Env from '@ioc:Adonis/Core/Env'
import {schema, rules} from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Token from 'App/Models/Token'


export default class PasswordResetController {
    public async forgot({ view }: HttpContextContract) {
        return view.render('password/forgot')
    }

    public async send({ request, response, session}: HttpContextContract) {
        const emailSchema = schema.create({
            email: schema.string([rules.email()])
        })

        const { email } = await request.validate({ schema: emailSchema })
        const user = await User.findBy('email', email)
        const token = await Token.generatePasswordResetToken(user)
        const resetLink = Route.makeSignedUrl('password.reset', { token })

        if(user){
            await Mail.send((message) => {
                message
                    .from('noreply@slaydios.com')
                    .to(user.email)
                    .subject('Recuperação de senha')
                    .html(`<p>Olá, você solicitou a recuperação de senha. Clique no link abaixo para redefinir sua senha.</p><br><a href = "${Env.get('DOMAIN')}${resetLink}}">Redefinir senha</a>`)
            })
        }


        session.flash('success', 'Se existir uma conta com esse email, você receberá um email com as instruções para redefinir sua senha.')
        return response.redirect().back()
    }

    public async reset({ view , params }: HttpContextContract) {
        const token = params.token
        const isValid = await Token.verifyPasswordResetToken(token)

        return view.render('password/reset', { isValid, token })
    }

    public async store({ request, session, auth, response}: HttpContextContract) {
        const passwordSchema = schema.create({
            token: schema.string(),
            password: schema.string({ trim: true }, [rules.minLength(6), rules.maxLength(20)]),
        })

        const { token, password } = await request.validate({ schema: passwordSchema })
        const user = await Token.getPasswordResetUser(token)

        if(!user){
            session.flash('error', 'Token inválido')
            return response.redirect().back()
        }

        user.password = password
        await user.save()
        await auth.login(user)
        await Token.expirePasswordResetTokens(user)
        

        return response.redirect().toRoute('videos.admin')
    
    }
}
