/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('auth/login', 'AuthController.login').as('auth.login')
//Route.post('/login', 'AuthController.showLogin').as('auth.showLogin')
Route.post('auth/login', 'AuthController.store').as('auth.store')
Route.get('/logout', 'AuthController.destroy').as('auth.destroy').middleware('auth:web')
Route.get('auth/create', 'AuthController.signup').as('auth.signup')
Route.post('auth/create', 'AuthController.create').as('auth.create')


Route.get('/', 'VideosController.home').as('videos.home')
Route.get('/videos', 'VideosController.index').as('videos.index')
Route.get('/videos/:id', 'VideosController.show').as('videos.show').where('id', Route.matchers.number())
Route.get('/videosLog/:id', 'VideosController.showLogged').as('videos.showLogged').where('id', Route.matchers.number())
Route.get('/videos/:id/delete', 'VideosController.destroy').as('videos.destroy').where('id', Route.matchers.number())

Route.get('/password/forgot', 'PasswordResetController.forgot').as('password.forgot')
Route.post('/password/send', 'PasswordResetController.send').as('password.send')
Route.get('/password/reset/:token', 'PasswordResetController.reset').as('password.reset')
Route.post('/password/store', 'PasswordResetController.store').as('password.store')

Route.group(() => {
    Route.get('/videos/user', 'VideosController.telaUser').as('videos.user')
    Route.get('/videos/admin', 'VideosController.telaAdmin').as('videos.admin')
    Route.get('/videos/create', 'VideosController.create').as('videos.create')
    Route.post('/videos/store', 'VideosController.store').as('videos.store')
    Route.get('auth/profile/', 'AuthController.profile').as('auth.profile')
    Route.get('auth/profile/edit/', 'AuthController.profileEdit').as('auth.edit')
    Route.post('auth/profile/edit/:id', 'AuthController.update').as('auth.update')
    Route.post('/auth/:id/delete', 'AuthController.delete').as('auth.delete')
    Route.get('/videos/history', 'VideosController.hist').as('videos.hist') 
    Route.get('/auth/delProf', 'AuthController.deleteProfile').as('auth.delProf')
}).middleware('auth:web')
