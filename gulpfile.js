const { watch, series } = require('gulp')
const { exec } = require('child_process')

function typescript(cb) {
  // body omitted
  exec(`pnpm tsc`, (error, stdout, stderr) => {
    console.log('Typescript compiled')
    exec(`node dist/update.js`, (error, stdout, stderr) => {
      console.log('Node script executed')
      console.log(error, stdout, stderr)
    })
  })
  cb()
}

exports.default = function() {
  // You can use a single task
  watch('src/**/*.ts', typescript)
  // Or a composed task
  // watch('src/*.js', series(clean, javascript))
}