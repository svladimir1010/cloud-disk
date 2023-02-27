const fileService = require('../services/fileService')
const User = require('../models/User')
const File = require('../models/File')
const path = require('path')
const fs = require('fs')
const Uuid = require('uuid')

// noinspection JSUnresolvedFunction
class FileController {

  async createDir(req, res) {
    console.log('Server createDir')
    try {
      let {name, type, parent} = req.body
      let file = new File({name, type, parent, user: req.user.id})
      let parentFile = await File.findOne({_id: parent})

      if(!parentFile) {
        file.path = name
        await fileService.createDir(req, file)
      } else {
        file.path = `${parentFile.path}\\${file.name}`
        await fileService.createDir(req, file)

        parentFile.childs = file._id
        await parentFile.save()
      }
      await file.save()
      return res.json(file)
    } catch( e ) {
      console.log(e)
      return res.status(400).json(e)
    }
  }

  async getFiles(req, res) {
    console.log('Server getFiles')
    try {
      let {sort, parent} = req.query
      let files
      switch( sort ) {
        case 'name':
          files = await File.find({user: req.user.id, parent}).sort({name: 1})
          break

        case 'type':
          files = await File.find({user: req.user.id, parent}).sort({type: 1})
          break

        case 'date':
          files = await File.find({user: req.user.id, parent}).sort({date: 1})
          break

        default:
          files = await File.find({user: req.user.id, parent})
          break
      }
      return res.json(files)
    } catch( e ) {
      console.log(e.message)
      return res.status(500).json({message: 'Can not get file'})
    }
  }

  async uploadFile(req, res) {
    console.log('Server uploadFile')
    try {
      const file = req.files.file

      const parent = await File.findOne({user: req.user.id, _id: req.body.parent})
      const user = await User.findOne({_id: req.user.id})
      if(user.usedSpace + file.size > user.diskSpace) {
        return res.status(400).json({message: 'There no space on the disk'})
      }
      user.usedSpace += file.size

      let filePath
      if(parent) {
        // filePath = path.join(__dirname, `../files/${user._id}/${parent.path}/${file.name}`)
        filePath = req.filePath + `/${user._id}/${parent.path}/${file.name}`
      } else {
        filePath = req.filePath + `/${user._id}/${file.name}`
      }
      // существует ли файл по указанному пути
      if(fs.existsSync(filePath)) {
        return res.status(400).json({message: 'File already exists'})
      }
      file.mv(filePath)

      const type = file.name.split('.').pop()
      const relativePath = parent
          ? parent.path + '\\' + file.name
          : file.name

      const dbFile = new File({
        name: file.name,
        type,
        size: file.size,
        path: relativePath,
        parent: parent ? parent._id : null,
        user: user._id
      })

      await dbFile.save()
      await user.save()
      res.json(dbFile)
      console.log('uploadFile')
    } catch( e ) {
      console.log(e)
      return res.status(500).json({message: 'Upload Error'})
    }
  }

  // download from server
  async downloadFile(req, res) {
    console.log('Server downloadFile')
    try {
      const file = await File.findOne({_id: req.query.id, user: req.user.id})
      const filePath = fileService.getPath(req, file)
      if(fs.existsSync(filePath)) {
        return res.download(filePath, file.name)
      }
      return res.status(400).json({message: 'Download error'})
    } catch( e ) {
      console.log(e.message)
      return res.status(500).json({message: 'Download Error'})
    }
  }

  async deleteFile(req, res) {
    try {
      console.log('Server deleted file: ')
      const file = await File.findOne({_id: req.query.id, user: req.user.id})
      if(!file) {
        return res.status(400).json({message: 'File not found'})
      }
      await file.remove()
      fileService.deleteFile(req, file)
      return res.json({message: 'File was deleted'})
    } catch( e ) {
      console.log(e)
      return res.status(400).json({message: 'Dir is not empty'})
    }
  }


  async searchFile(req, res) {
    try {
      const searchName = req.query.search
      let files = await File.find({user: req.user.id})
      files = files.filter(file => file.name.includes(searchName))
      return res.json(files)
    } catch( e ) {
      console.log(e.message)
      return res.status(400).json({message: 'Search failed'})
    }
  }

  async deleteAvatar(req, res) {
    try {
      const user = await User.findById(req.user.id)
      console.log(user.avatar)
      fs.unlinkSync(path.join(__dirname, `../static/${user.avatar}`))
      user.avatar = null
      await user.save()
      console.log('server deleted avatar')
      return res.json(user)
    } catch( e ) {
      console.log(e.message)
      return res.status(400).json({message: 'Delete avatar failed'})
    }
  }

  async uploadAvatar(req, res) {
    try {
      const file = req.files.file
      const user = await User.findById(req.user.id)
      const avatarName = Uuid.v4() + '.jpg'
      // file.mv(config.get('staticPath') + '\\' + avatarName)


      console.log('__dirname: ', __dirname)
      console.log('/static/${avatarName}: ', `../static/${avatarName}`)
      console.log('req.filePath + `/static/${avatarName}`: ', path.join(__dirname, `../static/${avatarName}`))

      file.mv(path.join(__dirname, `../static/${avatarName}`))
      user.avatar = avatarName
      await user.save()
      console.log('server uploadAvatar')
      return res.json(user)

    } catch( e ) {
      console.log(e.message)
      return res.status(400).json({message: 'Upload avatar failed'})
    }
  }
}


module.exports = new FileController()