import { exec } from 'child_process'

async function sendUpdate() {
  exec(`curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello, World!"}' ${process.env.SLACK_APP_WEBHOOK_URL}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing cURL request: ${error} ${stderr}`)
      return
    }
    console.log(`cURL request response: ${stdout}`)
  })
}

sendUpdate()
