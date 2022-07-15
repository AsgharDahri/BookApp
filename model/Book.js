// const mongoose=require('mongoose')

// const BookSchema=new mongoose.Schema({
//     BookName:{type:String},
//     BookDescription:{type:String},
//     BookAvailability:{type:String},
//     AddedBy:{type:String}
// })


// module.exports=mongoose.model('Book',BookSchema)

const mongoose=require('mongoose')

const BookSchema=new mongoose.Schema({
        BName:{type:String},
        BDescription:{type:String},
    BAvailability:{type:String},
    AddedBy:{type:String}
})

module.exports=mongoose.model("book",BookSchema)