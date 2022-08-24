const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const { response } = require('express')
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
                // console.log(items)
                res.render('list', { listTitle: "Today", newListItem: items })
            }
        }
    })

})


// app.get('/work', (req, res) => {
//     res.render('list', { listTitle: 'Work', newListItem: workItems })
// })

app.post('/', async (req, res) => {
    // console.log(req.body)

    // if (req.body.button == 'Work') {
    //     workItems.push(req.body.newItem);
    //     res.redirect('/work')
    // }

    // items.push(req.body.newItem);

    // res.redirect('/')

    const itemName = req.body.newItem
    const listName = req.body.list

    const item = await new Item({
        name: itemName
    })

    if (listName === 'Today') {
        await item.save()
        await res.redirect('/')
    } else {
        List.findOne({ name: listName }, (err, res) => {
            res.items
        })
    }



})

app.post('/delete', (req, res) => {
    const itemSelected = req.body.checkbox
    console.log(itemSelected)


    Item.findByIdAndRemove(itemSelected, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('item deleted')
            res.redirect('/')
        }
    })
})

// app.get('/:categoryItem', (req, res) => {
//     const parameter = req.params.categoryItem
//     console.log(parameter)

// })

// app.post('/work', (req, res) => {
//     workItems.push(req.body.newItem);

//     res.redirect('/work')

// })


app.get('/:customListName', (req, res) => {
    const customListName = req.params.customListName

    List.findOne({ name: customListName }, (err, result) => {
        if (!err) {
            if (!result) {
                // console.log('doesnt exist')
                // create new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })

                list.save()
                res.redirect(`/${customListName}`)
                // process.exit(1)
                // res.end('done')

            } else {
                // console.log('exist')
                // show an existing list
                res.render("list", { listTitle: result.name, newListItem: result.items })
                // res.redirect(`/${customListName}`)
                // process.exit(1)
                // res.end('done')

            }
        }
    })


})

app.listen(process.env.PORT || 3000, () => {
    console.log('server running on port 3000')
})