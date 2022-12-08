import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Video from 'App/Models/Video'

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
        const titulo = request.input('titulo')
        const description = request.input('description')

        /*VideosController.videos.size += 1

        const id = VideosController.videos.size

        VideosController.videos.values[id] = {
            id: id,
            video: video,
            description: description,
        }*/

        await Video.create({
            titulo: titulo,
            description: description
        })


        return response.redirect().toRoute('videos.admin')
    }

    public async show ({ view, params }: HttpContextContract){
        const id = params.id
        //const video = VideosController.videos.values[id]
        const video = await Video.findOrFail(id)

        return view.render('videos/show', { video: video })
    }

    public async destroy({ params, response }: HttpContextContract) {
        const video = await Video.findOrFail(params.id)
        await video.delete()
        return response.redirect().toRoute('videos.admin')
      }


}
