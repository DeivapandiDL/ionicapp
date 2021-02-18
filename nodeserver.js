const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
var app = express();
var nodemailer = require('nodemailer');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(bodyparser.raw());
// app.use(bodyparser.json());

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
        if (!err)
        // console.log(rows); displays in terminal
        //to display in browser
            res.send(rows);



        else
            console.log(err);
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
app.post('/addCart', (req, res) => {
    //insert an cart
obj=Object.assign({}, req.body);
var date = new Date();
for(i=0;i<req.body.length;i++){

val=obj[i];
console.log('cart details',val);
 
    var sql= "INSERT INTO addtocart (productName,productID,productImage,categoryID,customerID,createdDate,productQuantity,productPrice,totalPrice) VALUES (?,?,?,?,?,?,?,?,?)";
    mysqlConnection.query(sql,[val.productName,val.productID,val.productImage,val.categoryID,val.customerID,date,val.productQuantity,val.productPrice,val.totalPrice] , (err, rows, fields) => {
        if (!err){
            // res.write("product added successfully");
            // res.send(rows);
            temp=temp+1;

        }
        else
            console.log(err);
    });
}
console.log('temp value',temp,req.body.length);
res.send(true);
if(temp==req.body.length){
    res.send(true);
       let transport = nodemailer.createTransport({
            // host: 'smtp.gmail.com',
            // port: 587,
            service:'gmail',
            auth: {
               user: 'thamdeva@gmail.com',
               pass: 'dlsguru20'
            }
        });
        const message = {
            from: 'thamdeva@gmail.com', // Sender address
            to: 'facteuronline@gmail.com',         // List of recipients
            subject: 'Goatoo Product Added '+val.productName+' Successfully', // Subject line
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
});



//get particular customer using id ex:/customer/1
app.get('/getCustomerProduct/:id', (req, res) => {
    mysqlConnection.query('select * from addtocart where customerID=?', [req.params.id], (err, rows, fields) => {
        if (!err)
        // console.log(rows); displays in terminal
        //to display in browser
            res.send(rows);
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
app.get('/api/imageupload', (req, res) => {
    // console.log('image get',req);
    res.json({
        'message': 'hello'
    });
});
app.post('/api/imageupload', multipartMiddleware, (req, res) => {
     var tmp_path = req.files.uploads[0].path;
    var target_path = './pdtImagesUploads/' + req.files.uploads[0].name;
    console.log(target_path);
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




app.post('/addNewProduct', (req, res) => {
console.log('details',req.body);
const val = req.body;

var dir = './pdtImagesUploads/'+val.productImage;
// var dir1 = './pdtImagesUploads/blog01.jpg';
// console.log(dir);
// if (fs.existsSync(dir)){
//     // fs.mkdirSync(dir);
//       // fs.unlinkSync(dir1);
//     console.log('image available',dir1)
// }

imagesave='./src/assets/images/'+val.categoryID;
if (!fs.existsSync(imagesave)){
    fs.mkdirSync(imagesave);
    }
    else{
        imagelink=imagesave+'/'+val.productImage;
    console.log(imagelink);
    if(!fs.existsSync(imagelink)){
        console.log('path available',imagelink);
        fs.copyFile(dir, imagelink, (err) => {
              if (err) throw err;
              console.log('source.txt was copied to destination.txt');
              fs.unlinkSync(dir);
            });

    }
   
}
       
    var sql= "INSERT INTO addproduct ( categoryID,subcategoryID,productName,productCount,productImage,productDescription,productRateSymbol,productRate,productOfferPercent) VALUES (?,?,?,?,?,?,?,?,?)";

    mysqlConnection.query(sql,[val.categoryID,val.subcategoryID,val.productName,val.productCount,val.productImage,val.productDescription,val.productRateSymbol,val.productRate,val.productOfferPercent] , (err, rows, fields) => {
        if (!err){
            // res.write("product added successfully");
            res.send('true');
            let transport = nodemailer.createTransport({
            // host: 'smtp.gmail.com',
            // port: 587,
            service:'gmail',
            auth: {
               user: 'thamdeva@gmail.com',
               pass: 'dlsguru20'
            }
        });
        const message = {
            from: 'thamdeva@gmail.com', // Sender address
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


app.get('/mailCheck', (req, res) => {
let transport = nodemailer.createTransport({
    // host: 'smtp.gmail.com',
    // port: 587,
    service:'gmail',
    auth: {
       user: 'thamdeva@gmail.com',
       pass: 'dlsguru20'
    }
});
const message = {
    from: 'thamdeva@gmail.com', // Sender address
    to: 'facteuronline@gmail.com',         // List of recipients
    subject: 'Design Your Model S | Tesla', // Subject line
    text: 'Have the most fun you can in a car. Get your Tesla today!', // Plain text body
        html: '<h1>Have the most fun you can in a car!</h1><p>Get your <b>Tesla</b> today!</p>'

};
transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
});
});