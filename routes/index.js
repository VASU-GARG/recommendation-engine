var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');


var collectionModel1 = require('./mongoose1');
var collectionModel2 = require('./mongoose2');


var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var crypto = require("crypto");

let secrateKey = "secrateKey";

function encrypt(text) {
    encryptalgo = crypto.createCipher('aes192', secrateKey);
    let encrypted = encryptalgo.update(text, 'utf8', 'hex');
    encrypted += encryptalgo.final('hex');
    return encrypted;
}

function decrypt(encrypted) {
    decryptalgo = crypto.createDecipher('aes192', secrateKey);
    let decrypted = decryptalgo.update(encrypted, 'hex', 'utf8');
    decrypted += decryptalgo.final('utf8');
    return decrypted;
}

var bcrypt = require('bcryptjs');


router.get('/', async function(req, res, next) {
  all_rec_course=[];
  allCourses=[];
  let flag;
  await collectionModel2.find({})
    .then(allCourse=>{
          allCourses = allCourse;
    })

  if(req.session.userRecord)
  {
    res.redirect('/index');
  }
  else{
    res.render('index', {c:all_rec_course,all_courses:allCourses,status:"Log in"});
  }

});


router.get('/signIn', function(req,res){
  res.render('signin')
});


router.get('/signUp',function(req,res){
  res.render('signup',{ title: 'recommendation engine' })
})


router.get('/allCourse',async function(req,res,next){
  allCourses=[];
  await collectionModel2.find({})
    .then(allCourse=>{
          allCourses = allCourse;
    })
  
  if(req.session.userRecord)
  {
    res.render('allcourse', {all_courses:allCourses,status:"Your Account"});
  }
  else{
    res.render('allcourse', {all_courses:allCourses,status:"Log in"});
  }
})


router.get('/account', function(req,res){
  if(req.session.userRecord)
  {
    res.render('account',{user:req.session.userRecord})
  }
  else{
    res.redirect('/');
  }
})



router.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect('/');
});



router.get('/index', async function(req,res,next){

  let user_detail = [];
  let last_viewed_courseId = [];

  let loggedUser = req.session.userRecord;
  await collectionModel1.find({email:loggedUser.email})
  .then(user=>{
      if(user.length==0)
        res.render('index',{course_rec_list:""});

      else{
        user_detail=user;
        last_viewed_courseId = user[0].course;
      }

  }); 

  let allCourses=[];
  let dur,genre,grp;
  let euclidean = [];
  let k,p;
  let courseIdArray=[];
  let rec_courses = [];
  let otherCourses = [];
  let all_rec_course = [];
  let name;
  for(m=0;m<last_viewed_courseId.length;m++)
  {
    k=0;
    p=0;
    courseIdArray = [];
    euclidean=[];
    rec_courses=[];
    await collectionModel2.find({courseId:last_viewed_courseId[m]})
    .then(courseDetail=>{

        dur = courseDetail[0].courseDur;
        genre = courseDetail[0].courseGenre;
        grp = courseDetail[0].courseGroup;
        name = courseDetail[0].courseName;

    });

    
    await collectionModel2.find({})
    .then(allCourse=>{
          allCourses = allCourse;
          for(i=0;i<allCourse.length;i++)
          {
              if(allCourse[i].courseGroup===grp)
              {
                let x = allCourse[i].courseDur;
                let y = allCourse[i].courseGenre;
                let z = allCourse[i].courseId;
                let euc_dist = Math.sqrt((x-dur)*(x-dur)+(y-genre)*(y-genre));
                courseIdArray[k]=z;
                euclidean[k]=euc_dist;
                rec_courses[k] = allCourse[i];
                k++;
              }
            else{
                
            }
        }
    })

    // sorting the euclidean array and courseIdArray array
    for(i=0;i<euclidean.length;i++)
    {
      for(j=0;j<euclidean.length-1-i;j++)
      {
          if(euclidean[j]>euclidean[j+1])
          {
              let temp1 = euclidean[j+1];
              euclidean[j+1] = euclidean[j];
              euclidean[j] = temp1;

              let temp2 = courseIdArray[j+1];
              courseIdArray[j+1] = courseIdArray[j];
              courseIdArray[j] = temp2;5

              let temp3 = rec_courses[j+1];
              rec_courses[j+1] = rec_courses[j];
              rec_courses[j] = temp3;
          }
      }
    }
    //console.log(courseIdArray);
    all_rec_course[m] = rec_courses;
  } 

  let l = all_rec_course.length-1;
  let x=0;
  let latest_recom=[];

  if(l>=2)
  {
    for(i=l;i>=l-2;i--)
    {
      latest_recom[x++] = all_rec_course[i];
    }
  }
  else{
    for(i=l;i>=0;i--)
    {
      latest_recom[x++] = all_rec_course[i];
    }
  }
  if(allCourses.length==0)
  {
    await collectionModel2.find({})
    .then(allCourse=>{
          allCourses = allCourse;
    })
  }

  res.render('index',{c:latest_recom,all_courses:allCourses,status:"Your Account"});
  //console.log(all_rec_course);

});


router.post('/signIn',urlencodedParser,function(req,res)
{

  let emailEntered = req.body.email;

  let pass = req.body.pass;
  var findRecord = collectionModel1.find({email:emailEntered});

  findRecord.exec(function(err,data)
  {
    if(err)
      throw err;
    
    if(data.length == 0)
      res.render('signin',{message:"Email Id not registered"});
    else{
      // check whether password matches with the password in the database
      if(bcrypt.compareSync(pass,data[0].password))
      {
        req.session.userRecord = data[0];
        console.log(req.session.userRecord);
        res.redirect('/index');
      }
      else{
        res.render('signin', {message:"Password not matched"});
      }
    }
  });

});



router.post('/signUp', urlencodedParser, function(req,res)
{
  let nameEntered = req.body.name;
  let emailEntered = req.body.email;
  let pass = req.body.password;
  var findRecord = collectionModel1.find({email:emailEntered});

  findRecord.exec(function(err,data)
  {
    if(err)
      throw err;
    
    if(data.length > 0 )
    {
      res.render('signin', {message:"Email Id already registered."});
    }
    else{
        var record = new collectionModel1({
          name: nameEntered,
          email: emailEntered,
          password: bcrypt.hashSync(pass,10),
          course:[]
        });

        record.save(function(err,ress)
        {
          if(err) throw err;

          res.render('signup',{message: "Registered Successfullt.  Login to continue"});
        });
      }
  });
});


router.post('/newCourseSelect', async function(req,res){
    let courseSelectedName = req.body.course;
    let courseSelectedId;
    let courseSelected;
    let courseSelectedGrp;
    let userCourseGrp;
    let loggedUser = req.session.userRecord;
    await collectionModel2.find({courseName:courseSelectedName})
    .then(c=>{
        courseSelectedId = c[0].courseId;
        courseSelectedGrp = c[0].courseGroup;
        courseSelected = c[0];
    })

    if(req.session.userRecord)
    {
      let user_record;
      await collectionModel1.find({email:loggedUser.email})
      .then(user=>{
        user_record = user[0];

      })

      let flag = 0;

      for(i=0;i<user_record.course.length;i++)
      {
        await collectionModel2.find({courseId:user_record.course[i]})
        .then(record=>{
          //console.log(record[0].courseGroup);
          //console.log(courseSelectedGrp);
          if(record[0].courseGroup === courseSelectedGrp)
          {
            flag++;
          }
        })
      }
      if(flag==0)
      {

          let user_past_course_length = user_record.course.length;
          let updated_course_id_array=[];
          for(i=0;i<user_past_course_length;i++)
          {
            updated_course_id_array[i] = user_record.course[i];
          }
    
          updated_course_id_array[user_past_course_length] = courseSelectedId;
          await collectionModel1.updateOne({email:loggedUser.email},{'course':updated_course_id_array})
          .then(c=>{
            console.log("record updated");
          })
      }
    }
    if(req.session.userRecord)
    {
      res.render('specific_course',{course:courseSelected,status:"Your Account"});
    }
    else{
      res.render('specific_course',{course:courseSelected,status:"Log In"});
    }
});




module.exports = router;
