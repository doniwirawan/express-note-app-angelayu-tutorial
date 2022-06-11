const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true })

const itemSchema = {
    name: String
}

const Item = mongoose.model('Item', itemSchema)

// let items = []
// let workItems = []


app.get('/', (req, res) => {
    // const Today = new Date;
    // const options = {
    //     weekday: "long",
    //     day: "numeric",
    //     month: "long",
    //     year: "numeric"
    // }

    // const day = Today.toLocaleDateString('id-ID', options)

    res.render('list', { listTitle: day, newListItem: items })
})

app.get('/work', (req, res) => {
    res.render('list', { listTitle: 'Work', newListItem: workItems })
})

app.post('/', (req, res) => {
    console.log(req.body)

    if (req.body.button == 'Work') {
        workItems.push(req.body.newItem);
        res.redirect('/work')
    }

    items.push(req.body.newItem);

    res.redirect('/')

})

app.post('/work', (req, res) => {
    workItems.push(req.body.newItem);

    res.redirect('/work')

})

app.listen(process.env.PORT || 3000, () => {
    console.log('server running on port 3000')
})