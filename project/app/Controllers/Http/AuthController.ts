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
    
    public async store({ auth, response, request, view }: HttpContextContract) {
        const email = request.input('email')
        const password = request.input('password')
    
        try {
          await auth.use('web').attempt(email, password)
        } catch {
          throw new Exception('Caguei')
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
        const email = request.input('email')
        const password = request.input('password')

        await User.create({
            email: email,
            password: password
        })

        return response.redirect().toRoute('auth.login')
    }
}
