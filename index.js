const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const _ = require('lodash')
const { response } = require('express')
const app = express()
require('dotenv').config()

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })

const itemSchema = {
    name: String
}

const Item = mongoose.model('Item', itemSchema)


const item1 = new Item({
    name: "Test 1"
})
// const item2 = new Item({
//     name: "Test 2"
// })
// const item3 = new Item({
//     name: "Test 3"
// })

const defaultItems = [item1]

const listSchema = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List", listSchema)

app.get('/', (req, res) => {
    Item.find({}, (err, items) => {
        if (err) {
            console.log(err)
        } else {
            if (items.length == 0) {
                Item.insertMany(defaultItems, (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('Insert Many Success')
                    }
                })
                res.redirect('/')
            } else {
                res.render('list', { listTitle: "Today", newListItem: items })
            }
        }
    })

})

app.get('/:customListName', (req, res) => {
    const customListName = _.capitalize(req.params.customListName)

    List.findOne({ name: customListName }, (err, result) => {
        if (!err) {
            if (!result) {

                const list = new List({
                    name: customListName,
                    items: defaultItems
                })

                list.save()
                res.redirect(`/${customListName}`)

            } else {
                res.render("list", { listTitle: result.name, newListItem: result.items })
            }
        }
    })


})

app.post('/', async (req, res) => {

    const itemName = req.body.newItem
    const listName = req.body.list

    const item = new Item({
        name: itemName
    })

    if (listName === 'Today') {
        item.save()
        res.redirect('/')
    } else {
        List.findOne({ name: listName }, function (err, result) {

            result.items.push(item)
            result.save()
            res.redirect(`/${listName}`)
        })
    }

})

app.post('/delete', (req, res) => {
    const itemSelected = req.body.checkbox
    const listName = req.body.listName

    console.log(itemSelected)
    if (listName === 'Today') {
        Item.findByIdAndRemove(itemSelected, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log('item deleted')
                res.redirect('/')
            }
        })
    } else {
        List.findOneAndUpdate(
            { name: listName }, { $pull: { items: { _id: itemSelected } } },
            function (err, result) {
                if (!err) {
                    res.redirect(`/${listName}`)
                }
            }
        )
    }



})



app.listen(process.env.PORT || 3000, () => {
    console.log('server running on port 3000')
})