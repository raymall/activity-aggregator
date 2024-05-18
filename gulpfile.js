const { watch } = require('gulp')
const { exec } = require('child_process')

function typescript(cb) {
  exec(`pnpm tsc`, (error, stdout, stderr) => {
    if (error) {
      console.error(`pnpm tsc`, error, stderr)
      return
    }
      
    stdout ? console.log(stdout) : null

    console.log('Compiling...')
    exec(`node dist/update.js`, (error, stdout, stderr) => {
      if (error) {
        console.error(`node`, error, stderr)
        return
      }
      
      stdout ? console.log(stdout) : null

      console.log(stdout)
      console.log('Completed')
    })
  })
  cb()
}

exports.default = function() {
  watch('src/**/*.ts', typescript)
}