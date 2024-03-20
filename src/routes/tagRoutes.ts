import {
  createTag,
  deleteTag,
  getAllTags,
  updateTag,
} from 'controllers/TagController'
import Router from 'express'

const tag = Router()

tag.post('/', createTag)
tag.put('/', updateTag)
tag.delete('/:tagId', deleteTag)
tag.get('/', getAllTags)

export default tag
