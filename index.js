const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.set('view engine','ejs')

app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))


let items = [];


app.get('/', (req,res) => {
    const Today = new Date;
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }

    const day = Today.toLocaleDateString('id-ID', options)

    res.render('list', {day, newListItem: items})
})

app.post('/', (req,res) => {
    items.push(req.body.newItem);

    res.redirect('/')

})

app.listen(process.env.PORT||3000, () => {
    console.log('server running on port 3000')
})