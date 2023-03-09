import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Video from 'App/Models/Video'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import VideoHistory from 'App/Models/VideoHistory'

export default class VideosController {

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

    public async store ({ response, request, auth }: HttpContextContract) {

        const videoSchema = schema.create({
            titulo: schema.string({ trim: true }, [
                rules.minLength(3),
                rules.maxLength(30),
                rules.regex(/^[a-zA-Z0-9-_ ]+$/),
                rules.unique({ table: 'videos', column: 'titulo' })
            ]),
            description: schema.string({ trim: true }, [ 
                rules.minLength(1),
                rules.maxLength(50),
                rules.regex(/^[a-zA-Z0-9-_ ]+$/)]),
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
        const link = 'https://www.youtube.com/embed/' + validatedData.link.substring(32, 90)

        await Video.create({
            titulo: titulo,
            description: description,
            link: link,
            user_id: auth.user?.id
        })


        return response.redirect().toRoute('videos.admin')
    }

    public async show ({ view, params }: HttpContextContract){
        const id = params.id
        const video = await Video.findOrFail(id)

        video.views += 1

        await video.save()

        return view.render('videos/show', { video: video })
    }

    public async showLogged ({ view, params, auth }: HttpContextContract){
        const id = params.id
        const video = await Video.findOrFail(id)
        const user = auth.user?.id
        const username = auth.user?.user

        video.views += 1
        await video.save()

        await VideoHistory.create({
            userId: user,
            videoId: id,
            username: username,
            titulo: video.titulo
        })

        return view.render('videos/showLogged', { video: video })
    }

    public async destroy({ params, response,  }: HttpContextContract) {
        const video = await Video.findOrFail(params.id)
        await video.delete()
        return response.redirect().toRoute('videos.admin')
    }

    public async hist({ view }: HttpContextContract){
        const history = await VideoHistory.all() 
        //const user = auth.user?.id
        //const videos = await Video.all()

        return view.render('videos/history', { history: history })
    } 
}    
