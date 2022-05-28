var mongoose = require('mongoose');

mongoose.connect("mongodb+srv://Vasu:Vasu@cluster0.6vuhk.mongodb.net/course_recommendation?retryWrites=true&w=majority");



collectionSchema2 = mongoose.Schema({
    courseId:String,
    courseName:String,
    courseGroup:String,
    courseDur:Number,
    courseGenre:Number
})

collectionModel2 = mongoose.model('courses',collectionSchema2);

module.exports = collectionModel2;