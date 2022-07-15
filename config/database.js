const mongoose=require('mongoose')

exports.connect=()=>{
    mongoose.connect('mongodb://localhost:27017/BooksShop',{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(()=>{
        console.log('Successfully connected to database');
    })
    .catch((error)=>{
        console.log('database connection failed');
        console.log(error);
    })
}