const express = require('express')
const app = express()
const port = 8000
const cors = require('cors')
const { default: axios } = require('axios')
const { parse } = require('rss-to-json')

app.use(cors())


function formatter(type, data) {
    function toDevto(item) {
        return {
            id: item.id,
            title: item.title,
            url: item.url,
            description: item.description,
            reactionCount: item.public_reactions_count,
            coverImage: item.cover_image,
            source: 'DEVTO'
        }
    }

    function toMedium(item) {
        return {
            id: item.id,
            title: item.title,
            url: item.link,
            description: item.description,
            reactionCount: undefined,
            coverImage: undefined,
            source: 'MEDIUM'
        }
    }

    var response;

    switch (type) {
        case 'DEV.TO':
            response = data.map(toDevto)
            break;
    
        default:
            response = data.map(toMedium)
            break;
    }

    return response
}

app.get('/api/articles', async (req, res) => {
    try {
        const { data } = await axios.get('https://dev.to/api/articles?username=kaninkearpimy')
        const rss =  await parse('https://medium.com/feed/@kaninkearpimy')
        const devto = formatter('DEV.TO', data)
        const medium = formatter('MEDIUM', rss.items)
        const response = [...devto, ...medium]
        res.send(response, 200)
    } catch (error) {
        throw error
    }
})

app.listen(port, (error) => {
    if(error) throw error
    console.log(`Server started at ${port}`)
})