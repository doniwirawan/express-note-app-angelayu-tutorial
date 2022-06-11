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


const item1 = new Item({
    name: "Test 1"
})
const item2 = new Item({
    name: "Test 2"
})
const item3 = new Item({
    name: "Test 3"
})

const defaultItems = [item1, item2, item3]

// Item.insertMany(defaultItems, (err) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log('Insert Many Success')
//     }
// })

app.get('/', (req, res) => {
    Item.find({}, (err, items) => {
        if (err) {
            console.log(err)
        } else {
            console.log(items)

            res.render('list', { listTitle: "today", newListItem: items })
        }
    })

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