import gulp from 'gulp'
import { exec } from 'child_process'

const execCommand = (command, message, callbackFn) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(command, error, stderr)
      return
    }
      
    stdout ? console.log(stdout) : null

    console.log(stdout)
    console.log(message)
    callbackFn ? callbackFn() : null
  })
}

const typescript = (cb) => {
  execCommand(
    `pnpm tsc`,
    'Compiling...',
    execCommand(`node dist/update.js`, 'Completed')
  )
  cb()
}

exports.default = function() {
  gulp.watch('app/**/*.ts', typescript)
}