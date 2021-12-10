const express = require('express')
const app = express()
const port = 3000
const axios = require('axios')
const execSync = require('child_process').execSync; // generally a bad idea

const chuck_api = 'https://api.chucknorris.io/jokes/random'

const SECRET_KEY = "this_should_not_be_leaked_to_bad_guys_on_the_internet_or_contained_in_a_repo!"

var webhook = process.env.webhook // Ok, we will not actually leak stuff

app.get('/', (req, res) => {
  axios.get(chuck_api).then(response => {
      var mydata = response.data;
      axios.post(webhook, JSON.stringify({text: mydata.value})).then(() => {
          res.send(mydata.value)
      }).catch((err) => {
          console.log("ERR: Error posting to webhook: ", err)
          res.send(mydata.value)
      })
  }).catch((err) => {
      console.log("ERR: Error getting joke: ", err)
      res.status(404).end()
  })
})

app.get('/dangerzone', (req, res) => {
  // Code for the brave: remote code execution will make Chuck Norris knock on your door at night
  var mycat = req.query.category
  console.log("INFO: received mycat: " + mycat)
  res.setHeader('Content-Type', 'text')
  if (mycat) {
    var joke = execSync(`curl ${chuck_api}?category=${mycat}`) //DANGER, Johnny! 
    res.send(joke)
  } else {
    var joke = execSync(`curl ${chuck_api}|jq ".value"`)
    res.send(joke)
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})