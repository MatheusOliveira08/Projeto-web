import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@adonisjs/core/build/standalone'
import User from 'App/Models/User'
import { SOURCE_ID } from 'sqlite3'

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
        const email = request.input('email')
        const password = request.input('password')
        const user = request.input('user')

        await User.create({
            email: email,
            password: password,
            user: user
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

    public async delete({ params, response }: HttpContextContract) {
        const user = await User.findOrFail(params.id)
        await user.delete()
        return response.redirect().toRoute('videos.index')
      }
    
}
