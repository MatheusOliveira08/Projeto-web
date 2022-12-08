import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

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

    public async showLogin({ request, response }: HttpContextContract) {
        if(request.input('perfil') == 'admin') {
            return response.redirect().toRoute('videos.admin')
        }
        else{
            return response.redirect().toRoute('videos.user')
        }
    }
}
