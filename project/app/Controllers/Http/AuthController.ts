import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@adonisjs/core/build/standalone'
import User from 'App/Models/User'

export default class AuthController {
    /*public static contas = {
        size: 1,
        values: {
            1: { id: 1, email: 'matheus@gmail.com', senha: '1234', typeUser: 'Administrador' }
        }
    }*/

    public async login({ view }: HttpContextContract) {
        return view.render('auth/login')
    }

    /*public async showLogin({ request, response }: HttpContextContract) {
        if(request.input('perfil') == 'admin') {
            return response.redirect().toRoute('videos.admin')
        }
        else{
            return response.redirect().toRoute('videos.user')
        }
    }*/
    
    public async store({ auth, response, request }: HttpContextContract) {
        const email = request.input('email')
        const password = request.input('password')
    
        try {
          await auth.use('web').attempt(email, password)
        } catch {
          throw new Exception('Credenciais erradas, tente novamente')
        }
    
        return response.redirect().toRoute('videos.admin')
    }
    
    public async destroy({ auth, response }: HttpContextContract){
        await auth.use('web').logout()
        return response.redirect().toRoute('videos.index')
    }

    public async signup({ view }: HttpContextContract) {
        return view.render('auth/create')
    }

    public async create ({ response, request }: HttpContextContract) {

        const userSchema = schema.create({
            user: schema.string({ trim: true }, [
                rules.minLength(3),
                rules.maxLength(20),
                rules.regex(/^[a-zA-Z0-9-_]+$/),
                rules.unique({ table: 'users', column: 'user' })
            ]),
            email: schema.string({ trim: true }, [rules.unique({ table: 'users', column: 'email' }), /*rules.email()*/]),
            password: schema.string({ trim: true }, [rules.minLength(6), rules.maxLength(20)]),
        })

        const validatedData = await request.validate({ 
            schema: userSchema, 
            messages:{
                'user.required': 'O campo Nome de Usuário é obrigatório!',
                'user.minLength': 'O campo Nome de Usuário deve ter no mínimo 3 caracteres!',
                'user.maxLength': 'O campo Nome de Usuário deve ter no máximo 20 caracteres!',
                'user.regex': 'O campo Nome de Usuário deve conter apenas letras, números, hífen e underline!',
                'user.unique': 'O campo Nome de Usuário já está em uso!',

                'email.required': 'O campo Email é obrigatório!',
                'email.email': 'O campo Email deve ser um email válido!',
                'email.unique': 'O campo Email já está em uso!',

                'password.required': 'O campo Senha é obrigatório!',
                'password.minLength': 'O campo Senha deve ter no mínimo 6 caracteres!',
                'password.maxLength': 'O campo Senha deve ter no máximo 20 caracteres!',
            }
        })

        /*const email = request.input('email')
        const password = request.input('password')
        const user = request.input('user')*/

        await User.create({
            email: validatedData.email,
            password: validatedData.password,
            user: validatedData.user
        })

        

        return response.redirect().toRoute('auth.login')
    }

    public async profile({ view }: HttpContextContract) {
        
        return view.render('auth/profile')
    }

    public async profileEdit({ view }: HttpContextContract) {

        return view.render('auth/update')
    }

    public async update({ response, request, params }: HttpContextContract) {
        const id = params.id
        const user = await User.findOrFail(id)
        const email = request.input('email')
        const password = request.input('password')
        const username = request.input('user')

        user.email = email
        user.user = username
        user.password = password

        await user.save()
        return response.redirect().toRoute('auth.profile')
    }

    public async deleteProfile({ view }: HttpContextContract) {

        return view.render('auth/deleteProfile')
    }

    public async delete({ params, response }: HttpContextContract) {
        const user = await User.findOrFail(params.id)
        await user.delete()
        return response.redirect().toRoute('videos.index')
    }

}
