const express = require('express')
const bodyParser = require('body-parser');
const { date } = require(__dirname + "/date.js");
const app = express();
const mongoose = require('mongoose')
const _ = require('lodash')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost:27017/todoDB', { useNewUrlParser: true })

const itemsSchema = {
    name: "String"
};

const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item({
    name: "Welcome to your todo list!"
})
const item2 = new Item({
    name: "Hit the + button to add a new item."
})
const item3 = new Item({
    name: "<--- Hit this to delete an item."
})

const defaultArray = [item1, item2, item3]

const listSchema = {
    name:String,
    items:[itemsSchema]
}

const List = mongoose.model('list',listSchema);



// Item.insertMany(defaultArray,function(err){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("Successfully saved default items to Database.")
//     }
// })

app.get('/', function (req, res) {

    Item.find({}, function (err, foundItem) {

        res.render('list', { day: "TODAY", newListItem: foundItem })

    })
    let day = date();
})

app.post('/', (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list
    const item = new Item({
        name: itemName
    });

    if(listName == "Today"){
        item.save();
        res.redirect('/');
    }else{
        List.findOne({name:listName},(err,foundList)=>{
            foundList.items.push(item)
            foundList.save();
            res.redirect('/'+listName);
        })
    }
})

app.post('/delete', (req, res) => {
    const checkedItem_id = req.body.checkbox;
    const listName = req.body.listName;

    if(listName == "Today"){
        Item.findByIdAndDelete(checkedItem_id, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("List Deleted...");
            }
            res.redirect('/')
        })
    }else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItem_id}}},(err,foundList)=>{
            if(!err){
                res.redirect('/'+listName)
            }
        });
    }
})


app.get('/:customListName',(req,res)=>{
    const customListName = _.capitalize(req.params.customListName)

    List.findOne({name:customListName},(err,foundList)=>{
        if(!err){
            if(!foundList){
                const list = new List({
                    name:customListName,
                    items:defaultArray
                })
                list.save();
                res.redirect('/'+customListName)
            }else{
                res.render('list',{ day: foundList.name, newListItem: foundList.items})
                console.log(foundList.name)
            }
        }
    })
})


app.get('/about', (req, res) => {
    res.render('about')
})

app.listen(3000, function () {
    console.log('Server started on Port: 3000')
})