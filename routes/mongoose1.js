var mongoose = require('mongoose');

mongoose.connect("mongodb+srv://Vasu:Vasu@cluster0.6vuhk.mongodb.net/course_recommendation?retryWrites=true&w=majority");

collectionSchema1 = mongoose.Schema({
        name:String,
        email:String,
        password:String,
        course:Array   
});



collectionModel1 = mongoose.model('users',collectionSchema1);


module.exports = collectionModel1;



