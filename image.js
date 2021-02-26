var express = require('express');
var upload = require('express-fileupload');
const app = express();
const mysql = require('mysql');

	
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodepracticedb',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection created successfully');
    else
        console.log("error in db" + JSON.stringify(err, undefined, 2));
});
app.listen(3000, () => console.log('express is running'));
 


 app.use(upload());
 app.get("/",(req,res,next)=>{
 	res.status(200).send("Hello");
 });

 app.post("/imagenewupload",function(req,res,next){
 	console.log(req.body);
	// var file =req.body.file;
 	// var filename=file.name;
 	// var filedata=file.data;

 	// var filepath="./pdtImagesUploads/";
 	// var fileimage=filepath+filename;
 	// console.log(fileimage);


 	 // 	file.mv(filepath+filename,function(err,result){
 		// if(err){
 		// 	res.send(err);
 		// }
 		// // else{
 		// 		 var sql= "INSERT INTO users_image (uploadImage) VALUES (?)";
 		//  // var sql= "INSERT INTO users_image(image) VALUES(LOAD_FILE(?))";
		 //    mysqlConnection.query(sql,[file] , (err, rows, fields) => {
		 //        if (!err){
		 //            res.send("upload successfully");
		         
		 //        }
		 //        else
		 //            console.log(err);
		 //    });
 

 		
 			// res.send("file uploaded");
 		// }
 		// });

   

 });
