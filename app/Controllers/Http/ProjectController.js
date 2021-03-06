'use strict'

const ProjectModel = use('App/Models/Project')

class ProjectController {
  async index () {
    const projects = await ProjectModel.query().with('user').fetch()
    return projects
  }

  async store ({ request, auth }) {
    const data = request.only(['title', 'description'])
    const project = await ProjectModel.create({ ...data, user_id: auth.user.id })
    return project
  }

  async show ({ params }) {
    const project = await ProjectModel.findOrFail(params.id)
    await project.load('user')
    await project.load('tasks')
    return project
  }

  async update ({ params, request }) {
    const project = await ProjectModel.findOrFail(params.id)
    const data = request.only(['title', 'description'])
    project.merge(data)
    await project.save()
    return project
  }

  async destroy ({ params }) {
    const project = await ProjectModel.findOrFail(params.id)
    await project.delete()
  }
}

module.exports = ProjectController
