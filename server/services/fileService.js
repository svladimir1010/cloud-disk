const fs = require('fs')
const path = require('path')

class FileService {

  createDir(req, file) {
    const filePath = this.getPath(req, file)
    return new Promise(((resolve, reject) => {
      try {
        if(!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath)
          return resolve({message: 'File was created'})
        } else {
          return reject({message: 'File already exists'})
        }
      } catch( err ) {
        return reject({message: 'File Error: ' + err.message})
      }
    }))
  }

  deleteFile(req, file) {
    const path = this.getPath(req, file)
    if(file.type === 'dir') {
      fs.rmdirSync(path, {recursive: true})
    } else {
      fs.unlinkSync(path)
    }
  }

  getPath(req, file) {
    // const filePath = `${config.get('filePath')}\\${file.user}\\${file.path}`
    // return path.join(__dirname, `../files/${file.user}/${file.path}`)
    return req.filePath + `/${file.user}/${file.path}`
  }
}


module.exports = new FileService()

