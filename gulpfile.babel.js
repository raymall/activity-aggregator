import gulp from 'gulp'
import { exec } from 'child_process'

const typescript = (cb) => {
  exec(`pnpm tsc`, (error, stdout, stderr) => {
    console.log('Compiling...')

    stderr ? console.log(stderr) : null

    if (error) {
      console.error(command, error, stderr)
      return
    }
      
    stdout ? console.log(stdout) : null

    exec(`node dist/update.js`, (error, stdout, stderr) => {

      stderr ? console.log(stderr) : null
      
      if (error) {
        console.error(command, error)
        return
      }
        
      stdout ? console.log(stdout) : null
      console.log('Completed.')
    })
  })
  cb()
}

exports.default = function() {
  gulp.watch('app/**/*.ts', typescript)
}