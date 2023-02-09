import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Video from 'App/Models/Video'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import VideoHistory from 'App/Models/VideoHistory'
import User from 'App/Models/User'

export default class VideosController {
    /*public static videos = {
        size: 3,
        values: {
            1: {id: 1, titulo: 'Aula 01:', description: 'Introdução Web'},
            2: {id: 2, titulo: 'Aula 02:', description: 'Introdução ao HTTP'},
            3: {id: 3, titulo: 'Aula 03:', description: 'Introdução HTML'}
        }
    }*/

    public async home({ response }: HttpContextContract){
        return response.redirect().toRoute('videos.index')
    }

    public async index({ view }: HttpContextContract){
        //const videos = VideosController.videos.values
        const videos = await Video.all()

        return view.render('videos/index', { videos: videos})
    }

    public async telaUser({ view }: HttpContextContract){
        //const videos = VideosController.videos.values
        const videos = await Video.all()

        return view.render('videos/telaUser', { videos: videos})
    }

    public async telaAdmin({ view }: HttpContextContract){
        //const videos = VideosController.videos.values
        const videos = await Video.all()

        return view.render('videos/telaAdmin', { videos: videos})
    }

    public async create({ view }: HttpContextContract){
        return view.render('videos/create')
    }

    public async store ({ response, request }: HttpContextContract) {

        const videoSchema = schema.create({
            titulo: schema.string({ trim: true }, [
                rules.minLength(3),
                rules.maxLength(30),
                rules.regex(/^[a-zA-Z0-9-_]+$/),
                rules.unique({ table: 'videos', column: 'titulo' })
            ]),
            description: schema.string({ trim: true }, [ 
                rules.minLength(1),
                rules.maxLength(50),
                rules.regex(/^[a-zA-Z0-9-_]+$/)]),
            link: schema.string({ trim: true }, [/*rules.regex(/^[a-zA-Z0-9-_]+$/)*/]),
        })

        const validatedData = await request.validate({ 
            schema: videoSchema, 
            messages:{
                'titulo.required': 'O campo titulo é obrigatório',
                'titulo.minLength': 'O campo titulo deve ter no mínimo 3 caracteres',
                'titulo.maxLength': 'O campo titulo deve ter no máximo 30 caracteres',
                'titulo.regex': 'O campo titulo deve conter apenas letras, números, hífen e underline',
                'titulo.unique': 'O campo titulo deve ser único',

                'description.required': 'O campo descrição é obrigatório',
                'description.minLength': 'O campo descrição deve ter no mínimo 1 caracteres',
                'description.maxLength': 'O campo descrição deve ter no máximo 50 caracteres',
                'description.regex': 'O campo descrição deve conter apenas letras, números, hífen e underline',

                'link.required': 'O campo link é obrigatório',
                'link.regex': 'O campo link deve ser do youtube e deve conter embed',
            }
        })


        const titulo = validatedData.titulo
        const description = validatedData.description
        const link = validatedData.link

        await Video.create({
            titulo: titulo,
            description: description,
            link: link
        })


        return response.redirect().toRoute('videos.admin')
    }

    public async show ({ view, params }: HttpContextContract){
        const id = params.id
        //const video = VideosController.videos.values[id]
        const video = await Video.findOrFail(id)

        return view.render('videos/show', { video: video })
    }

    public async showLogged ({ view, params, auth }: HttpContextContract){
        const id = params.id
        //const video = VideosController.videos.values[id]
        const video = await Video.findOrFail(id)
        const user = auth.user?.id

        await VideoHistory.create({
            userId: user,
            videoId: id
        })

        return view.render('videos/showLogged', { video: video })
    }

    public async destroy({ params, response }: HttpContextContract) {
        const video = await Video.findOrFail(params.id)
        await video.delete()
        return response.redirect().toRoute('videos.admin')
      }

    public async hist({ view }: HttpContextContract){

        return view.render ('videos/hist')
    } 

}
