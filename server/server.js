const { response } = require('express')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node')
const lyricsFinder = require('lyrics-finder')


const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/retoken', async (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:5000',
        clientId: 'e7e5fbb54fdf4b37a0ae1e1c8a5c907d',
        clientSecret: 'e47d0c87972c4c89942a8ab6d268ba2a',
        refreshToken
    })
    try {
        const response = await spotifyApi.refreshAccessToken()
        console.log(response.body)
        res.json({
            accessToken: response.body.accessToken,
            expiresIn: response.body.expiresIn
        })
    } catch (e) {
        console.log(e)
        res.sendStatus(400)
    }
})

app.post('/login', async (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:5000',
        clientId: 'e7e5fbb54fdf4b37a0ae1e1c8a5c907d',
        clientSecret: 'e47d0c87972c4c89942a8ab6d268ba2a',
    })

    try {
        const response = await spotifyApi.authorizationCodeGrant(code)
        res.json({
            accessToken: response.body.access_token,
            refreshToken: response.body.refresh_token,
            expiresIn: response.body.expires_in
        })
    } catch (e) {
        console.log(e)
        res.sendStatus(400)
    }
})

app.get('/lyrics', async (req, res) => {
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || 'No lyrics found! :('
    res.json({ lyrics })
})

app.listen(5001, () => {
    console.log(`Server listening at http://localhost:5001`)
})