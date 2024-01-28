import { updateTag } from 'controllers/TagController'
import Router from 'express'
import { createTag, deleteTag, getAllTags } from 'repository/TagRepository'

const tag = Router()

tag.post('/', createTag)
tag.put('/', updateTag)
tag.delete('/', deleteTag)
tag.get('/', getAllTags)

export default tag
