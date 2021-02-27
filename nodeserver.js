const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');

var app = express();
var nodemailer = require('nodemailer');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(bodyparser.raw());
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({ extended: true }));

var upload = require('express-fileupload');
 app.use(upload());





const  multipart  =  require('connect-multiparty');
// const  multipartMiddleware  =  multipart({ uploadDir:  './pdtImagesUploads' });




var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header( 'Access-Control-Allow-Headers', 'Accept,Accept-Language,Content-Language,Content-Type');
    next();
}

app.use(allowCrossDomain);

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'goatoo',
    multipleStatements: true
});
mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection created successfully');
    else
        console.log("error in db" + JSON.stringify(err, undefined, 2));
});
app.listen(3000, () => console.log('express is running'));

//get all customer datas  ex:/customer
app.get('/customer', (req, res) => {
    mysqlConnection.query('select * from customer', (err, rows, fields) => {
        if (!err)
        // console.log(rows); displays in terminal
        //to display in browser
            res.send(rows);

        else
            console.log(err);
    });
});

//get particular customer using id ex:/customer/1
app.get('/customer/:id', (req, res) => {
    mysqlConnection.query('select * from customer where id=?', [req.params.id], (err, rows, fields) => {
        if (!err)
        // console.log(rows); displays in terminal
        //to display in browser
            res.send(req.params);
        else
            console.log(err);
    });
});

//delete an customer
app.delete('/customer/:id', (req, res) => {
    mysqlConnection.query('delete from customer where id=?', [req.params.id], (err, rows, fields) => {
        if (!err)

            res.send('deleted successfuly');
        else
            console.log(err);
    });
});

app.post('/addCustomer', (req, res) => {
    //insert an customer

console.log(req.body);
    const val = req.body;
    var sql= "INSERT INTO customer (name, email,phone,password,address) VALUES (?,?,?,?,?)";
    mysqlConnection.query(sql,[val.name,val.email,val.phone,val.password,val.address] , (err, rows, fields) => {
        if (!err){
            res.send("inserted successfully");
         
        }
        else
            console.log(err);
    });
});


//edit and update customer details
app.post('/editCustomer',(req,res) => {

    const val = req.body;
    var query = 'UPDATE customer SET name = ?, phone =?,password=?,address=? WHERE id=?';  

mysqlConnection.query(query,[val.name,val.phone,val.password,val.address,val.id], (err, rows, fields) => {
        if (!err){
            res.send("updated successfully");
           
        }
        else
            console.log(err);
    });


});

//product

//get all addproduct datas  ex:/addproduct
app.get('/product', (req, res) => {
    mysqlConnection.query('select * from addproduct', (err, rows, fields) => {
        if (!err){
            rows.sort(function(a,b){
            return new Date(b.pdtCreatedDate) - new Date(a.pdtCreatedDate);
        });
            res.send(rows);
        }
        else{
            console.log(err);
        }
    });
});

//get particular addproduct using id ex:/addproduct/1
app.get('/addproduct/:id', (req, res) => {
    mysqlConnection.query('select * from addproduct where productID =?', [req.params.id], (err, rows, fields) => {
        if (!err)
        // console.log(rows); displays in terminal
        //to display in browser
            res.send(req.params);
        else
            console.log(err);
    });
});

//delete an addproduct
app.get('/deleteproduct/:id', (req, res) => {
    mysqlConnection.query('delete from addproduct where productID =?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    });
});

//insert an addproduct
app.post('/addproduct', (req, res) => {
    const params = req.body
    mysqlConnection.query('INSERT INTO addproduct SET ?', params, (err, rows, fields) => {
        if (!err)
            res.send("inserted successfully");
        else
            console.log(err);
    });
});


// get category details

app.get('/getCategory', (req, res) =>{
    mysqlConnection.query('select * from category', (err, rows, fields) => {
        if (!err)
        // console.log(rows); displays in terminal
        //to display in browser
            res.send(rows);

        else
            console.log(err);
    });
})


// get sub category details

app.get('/getSubCategory', (req, res) =>{
    mysqlConnection.query('select * from subcategory', (err, rows, fields) => {
        if (!err)
        // console.log(rows); displays in terminal
        //to display in browser
            res.send(rows);

        else
            console.log(err);
    });
});

// get overall product with category and subcategory

var categoryList = [];
var subCategoryList = []
var productList = [];
var productData = [];
app.get('/getProducts', (req, res) => {
    mysqlConnection.query('select * from category', (err, rows, fields) =>{
        if(!err){
            categoryList = rows;
        mysqlConnection.query('select * from subcategory', (errcategory, subCat, fields) => {
        if (!errcategory){
            subCategoryList = subCat;
            mysqlConnection.query('select * from addproduct', (errproduct, product, fields) => {
            if (!errproduct){
                productList = product;        
                    categoryList.forEach((cat,c) =>{
                        cat.subcategory = [];
                        subCategoryList.forEach((sub,s) =>{
                            if(cat.catID == sub.catID){
                                cat.subcategory.push(sub);
                                sub.product = [];
                                productList.forEach((pr,p) =>{
                                    if((cat.catID == pr.categoryID) && (sub.subCatID == pr.subcategoryID))
                                    {
                                        sub.product.push(pr);
                                    }
                                })
                            }
                        });
                    });
                    res.send(categoryList);
            }
            else{
                console.log(errproduct);
            }

            });

        }
        else{
            console.log(errcategory);
        }
        })
    }
        else{
            console.log(err);
        }
        
    })
});

// get product by category id
var subCategoryProducts = [];
var productByCategory = [];
app.get('/getCategoryProduct/:id', (req, res) => {
    mysqlConnection.query('select * from subcategory where catID =?', [req.params.id], (err, subCategoryProduct, fields) => {
        if (!err)
        {
            subCategoryProducts = subCategoryProduct;
            mysqlConnection.query('select * from addproduct where categoryID =?', [req.params.id], (errproduct, productCat, fields) => {
                            if (!errproduct){ 
                                productByCategory = productCat;
                                subCategoryProducts.forEach((sub,s) =>{
                                    sub.product = [];
                                    productByCategory.forEach((pr,p) =>{
                                        if(sub.subCatID == pr.subcategoryID)
                                        {
                                            sub.product.push(pr);
                                        }
                                    })
                                });
                               res.send(subCategoryProducts);
                            }
                            
        });
            
        }
        else{
            console.log(err);
        }
    });
});


// get particular product details

app.get('/getProductDetails/:id', (req, res) => {

    mysqlConnection.query('select * from addproduct where productID =?', [req.params.id], (errprod, getProducts, fields) => {
        if(!errprod){
            res.send(getProducts);
        }
        console.log(getProducts);
    })

})


//add to cart get details
app.get('/getCart', (req, res) =>{
    mysqlConnection.query('select * from addtocart', (err, rows, fields) => {
        if (!err)
        // console.log(rows); displays in terminal
        //to display in browser
            res.send(rows);

        else
            console.log(err);
    });
});

//add to cart insert details
var temp=0;
var arr=[];
app.post('/addCart', (req, res) => {
    //insert an cart
obj=Object.assign({}, req.body);
var date = new Date();
for(i=0;i<req.body.length;i++){

val=obj[i];
   arr.push(val);
    var sql= "INSERT INTO addtocart (productName,productID,productDesc,productImage,categoryID,customerID,createdDate,productQuantity,productPrice,totalPrice) VALUES (?,?,?,?,?,?,?,?,?,?)";
    mysqlConnection.query(sql,[val.productName,val.productID,val.productDesc,val.productImage,val.categoryID,val.customerID,date,val.productQuantity,val.productPrice,val.totalPrice] , (err, rows, fields) => {
        if (!err){
             temp=temp+1;
            // arr.push(val);
            // console.log(val);
        }
        else
            console.log(err);
    });
}
console.log('temp value',temp,req.body.length);
res.send(true);
orderEmailNotification();
  if(temp==req.body.length){
    res.send(true);
}
});

function orderEmailNotification()
{
         let transport = nodemailer.createTransport({
            service:'gmail',
            auth: {
               user: 'facteuronline@gmail.com',
               pass: 'Facteur@123'
            }
        });
       console.log(arr);
      totalpricevalue=0;
    var content_html='<table style="width:100%"  border = "1" cellpadding = "5" cellspacing = "5"><caption><h3>Product Details</h3></caption><tr> <th>Product Name</th><th>Product Count</th><th>Product Rate</th></tr>';
    for (var i = 0; i < arr.length; i++) {
        totalpricevalue +=arr[i].totalPrice;
    content_html += '<tr><td>'+arr[i].productName+'</td><td>'+arr[i].productQuantity+'</td><td>'+arr[i].productPrice+'</td></tr>';
    }
    content_html +='<tr><td colspan="2" style="text-align:right;">Total Price</td><td>'+totalpricevalue+'</td></tr></table>';

        const message = {
            from: 'facteuronline@gmail.com', // Sender address
            to: ['facteuronline@gmail.com','deivapandi18@gmail.com'],         // List of recipients
            subject: 'Goatoo Order Placed Successfully', // Subject line
            html: content_html
        };
        transport.sendMail(message, function(err, info) {
            if (err) {
              console.log(err)
            } else {
              console.log(info);
            }
        });


}

//get particular customer using id ex:/customer/1
app.get('/getCustomerProduct/:id', (req, res) => {
    mysqlConnection.query('select * from addtocart where customerID=?', [req.params.id], (err, rows, fields) => {
        if (!err){ 
        rows.sort(function(a,b){
            return new Date(b.createdDate) - new Date(a.createdDate);
        });
            res.send(rows);
        }
        else{ 
            console.log(err);
        }
    });
});



// wishlist save

app.post('/wishlist', (req, res) => {
    const val = req.body;
    var sql= "INSERT INTO wishlist (productID,customerID) VALUES (?,?)";
    mysqlConnection.query(sql,[val.productID,val.customerID] , (err, rows, fields) => {
        if (!err){
            res.send("Wishlist Added Successfully");
         
        }
        else
            console.log(err);
    });
});


// delete wishlist

app.get('/deleteWishlist/:id', (req, res) => {
    mysqlConnection.query('delete from wishlist where productID=?', [req.params.id], (err, rows, fields) => {
        if (!err){
            res.send("Wishlist Deleted Successfully");
        }
        else
            console.log(err);
    });
});



app.get('/getWishlist/:id', (req, res) => {
    const val = req.body;
    console.log(req.body);
   mysqlConnection.query('select * from wishlist where customerID=?',[req.params.id], (err, rows, fields) => {
        if (!err){
            res.send(rows);
        }
        else
            console.log(err);
    });
});



// create category

app.post('/createCategory', (req, res) => {
    const val = req.body;
    console.log(val.catName);
    var sql= "INSERT INTO category (catName) VALUES (?)";
    mysqlConnection.query(sql,[val.catName] , (err, rows, fields) => {
        if (!err){
            res.send("true");
        }
        else
            console.log(err);
    });
});



// create sub category

app.post('/createSubCategory', (req, res) => {
    const val = req.body;
    console.log(val.catName);
    var sql= "INSERT INTO subcategory (catID,subCatName) VALUES (?,?)";
    mysqlConnection.query(sql,[val.catID,val.subCatName] , (err, rows, fields) => {
        if (!err){
            res.send("true");
        }
        else
            console.log(err);
    });
});




//check customer is exists or not
var isValid='';
app.post('/checkCustomer', (req, res) =>{
    var email = req.body.username;
    var password = req.body.password;
    var userArray = [];
     
    // var sql='SELECT * FROM customer WHERE name = ? AND password = ?';
    mysqlConnection.query('select * from customer where email =? AND password=?', [email,password], (errprod, user, fields) => {

        if(!errprod){
            isValid=user;
            userArray = user;
            console.log(user.length);
            if(user.length==1){
                res.send(userArray);
            }
            else{
                res.send(userArray)
            }
            
        }
      
    });
    // if(isValid==''){console.log('Username and Password  match');res.send('match')}
    //     else   {console.log('Username and Password not match');res.send('notmatch')}
    
   
});

// image upload
var fs = require('fs');
const  multipartMiddleware  =  multipart({ uploadDir:  './pdtImagesUploads' });
;
app.get('/api/imageupload', (req, res) => {
    console.log('image get',multipartMiddleware);
    res.json({
        'message': 'hello'
    });
});
app.post('/api/imageupload', multipartMiddleware, (req, res) => {
   console.log('add new product image testing')


     var tmp_path = req.files.uploads[0].path;
    var target_path = './pdtImagesUploads/' + req.files.uploads[0].name;
    console.log(tmp_path);

    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            res.send('File uploaded to: ' + target_path);
        });
    });
    // res.json({
    //     'message': 'File uploaded successfully'
    // });  
});




var uploadImage='';
 app.post("/productImageUpload",function(req,res,next){
    // console.log('imagepath',req);
    uploadImage =req.body.file;
    console.log('image file',uploadImage);
    // var filename=file.name;
    // var filedata=file.data;

    // var filepath="./pdtImagesUploads/";
    // var fileimage=filepath+filename;
    // console.log(fileimage);


     //     file.mv(filepath+filename,function(err,result){
        // if(err){
        //  res.send(err);
        // }
        // else{
                 var sql= "INSERT INTO users_image (uploadImage) VALUES (?)";
         // var sql= "INSERT INTO users_image(image) VALUES(LOAD_FILE(?))";
            mysqlConnection.query(sql,[uploadImage] , (err, rows, fields) => {
                if (!err){
                    res.send("upload successfully");
                 
                }
                else
                    console.log(err);
            });
 

        
            // res.send("file uploaded");
        // }
        // });

   

 });




app.post('/addNewProduct', (req, res) => {
 
console.log('details::::',req.body);
const val = req.body;
// var dir = './pdtImagesUploads/'+val.productImage;
// imagesave='./src/assets/images/'+val.categoryID;
// if (!fs.existsSync(imagesave)){
//     fs.mkdirSync(imagesave);
//     }
//     else{
//         imagelink=imagesave+'/'+val.productImage;
//     console.log(imagelink);
//     if(!fs.existsSync(imagelink)){
//         console.log('path available',imagelink);
//         fs.copyFile(dir, imagelink, (err) => {
//               if (err) throw err;
//               console.log('source.txt was copied to destination.txt');
//               fs.unlinkSync(dir);
//             });

//     }
   
// }


       
    var sql= "INSERT INTO addproduct ( categoryID,subcategoryID,productName,productImage,productCount,productDescription,productRateSymbol,productRate,productOfferPercent,expiryDate) VALUES (?,?,?,?,?,?,?,?,?,?)";

    mysqlConnection.query(sql,[val.categoryID,val.subcategoryID,val.productName,val.productImage,val.productCount,val.productDescription,val.productRateSymbol,val.productRate,val.productOfferPercent,val.expiryDate] , (err, rows, fields) => {
        if (!err){
            // res.write("product added successfully");
            console.log(val.expiryDate);
            res.send('true');
            let transport = nodemailer.createTransport({
            // host: 'smtp.gmail.com',
            // port: 587,
            service:'gmail',
            auth: {
               user: 'facteuronline@gmail.com',
               pass: 'Facteur@123'
            }
        });
        const message = {
            from: 'facteuronline@gmail.com', // Sender address
            to: 'facteuronline@gmail.com',         // List of recipients
            subject: 'Goatoo Product Added '+val.productName+' Successfully', // Subject line
            text: 'Goatoo Product Added Successfully', // Plain text body
            html: '<table style="width:100%"  border = "1" cellpadding = "5" cellspacing = "5"><caption><h3>Product Details</h3></caption><tr> <th>Product Name</th><th>Product Count</th><th>Product Description</th><th>Product RateSymbol</th><th>Product Rate</th><th>Product OfferPercent</th></tr><tr><td>'+val.productName+'</td><td>'+val.productCount+'</td><td>'+val.productDescription+'</td><td>'+val.productRateSymbol+'</td><td>'+val.productRate+'</td><td>'+val.productOfferPercent+'</td></tr></table>'


        };
        transport.sendMail(message, function(err, info) {
            if (err) {
              console.log(err)
            } else {
              console.log(info);
            }
        });

        }
        else
            console.log('error',err);
    });
    


});

app.post('/editProduct',(req,res) => {
    // console.log('editProduct',req.body)
    const val = req.body;
    var query = 'UPDATE addproduct SET productName = ?, productCount =?,productImage=?,productDescription=?,productRateSymbol=?,productRate=?,productOfferPercent=? WHERE productID=?';  

mysqlConnection.query(query,[val.productName,val.productCount,val.productImage,val.productDescription,val.productRateSymbol,val.productRate,val.productOfferPercent,val.productID], (err, rows, fields) => {
        if (!err){
            res.send("product updated successfully");
           
        }
        else
            console.log(err);
    });


});   

//forget password
app.get('/forgetPassword',(req,res) => {
    // console.log('editProduct',req.body)
    //  var email = req.body.username;
    // var password = req.body.password;
    var email='fdsfthamdeva@gmail.com';
  mysqlConnection.query('select * from customer where email =?', [email], (errprod, user, fields) => {
        if(!errprod){ 
            if(user.length==0){
                console.log('Email not available',user);
            }  
            else{
                console.log('Email available',user);
             let transport = nodemailer.createTransport({
            // host: 'smtp.gmail.com',
            // port: 587,
            service:'gmail',
            auth: {
               user: 'facteuronline@gmail.com',
               pass: 'Facteur@123'
            }
        });
        passHtml='<h3>Product Details</h3>'
        passHtml+='<div>Dear '+user[0].name+',Visit the link below to reset your password. If you do not understand why you are receiving this e-mail, it may be because somebody else has entered your e-mail address into our password reminder form. If so, you may ignore this message.</div>'
        passHtml+='http://localhost:4200/login'
        const message = {
            from: 'facteuronline@gmail.com', // Sender address
            to: email,         // List of recipients
            subject: 'Password Reset', // Subject line
            html: passHtml
        };
        transport.sendMail(message, function(err, info) {
            if (err) {
              console.log(err)
            } else {
              console.log(info);
            }
        });      
                
                }
        }
        else{
            console.log('email not available',user)
        }
      
    });


});   