const express=require("express");

const app=express();

const jwt=require("jsonwebtoken");


const mongoose=require("mongoose");

const sellerSchema = require("./sellerSchema.js");
const sellermiddleware = require("./sellermiddleware.js");
const busSchema = require("./busSchema.js");
const userschema = require("./userschema.js");
const usermiddleware=require("./usermiddleware.js");
const cors=require("cors")

app.use(express.json());

app.use(cors({origin:"*"}));

let password="hGIJEXIcmLQs2psX"

mongoose.connect("mongodb+srv://2203031240839:mohithdb@cluster0.ta3ge.mongodb.net/busPass").then(()=>{
    console.log("db connected");

})


app.post("/sellerRegisteration",async(req,res)=>{
    try{

        let {email,name,password,confirmpassword,travelsname}=req.body;


       let sellerexicst=await sellerSchema.findOne({email});

       if(sellerexicst){
          return res.send("user already exicst");
       };

       if(password !==confirmpassword){
        return res.send("confirmpassword is not matching ");
       }

       let newseller=await new sellerSchema({email,name,password,confirmpassword,travelsname});

       await newseller.save();

       res.send("registred succesfull");



    }catch(errr){

        res.status(400)

    }
});


app.post("/sellerLogin",async(req,res)=>{

    try{

        let {email,password}=req.body;

        let seller=await sellerSchema.findOne({email});

        if(!seller){
            return res.send("user not found");
        }

        if(seller.password!==password){
            return res.send("incorrect password");

        }

        let payload={
            user:{
                id:seller.id
            }
        }

        jwt.sign(payload,"sellersecurity",{expiresIn:360000},(err,token)=>{
            res.json({token});
        })

    }
    catch(err){
        console.log(err)
    }
})

app.get("/sellerDashboard", sellermiddleware,async(req,res)=>{

    try{

        let user=await sellerSchema.findById(req.user.id);

        res.json(user);


    }
    catch(err){
        console.log(err);
    }
});






app.post("/addbus",sellermiddleware,async(req,res)=>{

    try{
        let {sellerid,selleremail,busname,busno,from,to,login,logout,seatcount}=req.body;

    let seats=[];

    for(let i=1;i<=seatcount;i++){
        seats.push({
            seatno:i,
           
        });

    }

    let newbus=await new busSchema({sellerid,busname,busno,from,to,login,logout,seat:seats})

    await newbus.save();
    
    res.send(`bus added ${selleremail}`);
    

    }
    catch(err){

       res.status(500);

    }


})


app.post("/bookseat",usermiddleware, async (req, res) => {
    try {
      let { busid, seatid, passengername ,passengeraddress,passengerphone} = req.body;
  
     
      const updatedBus = await busSchema.findOneAndUpdate(
        { _id: busid, "seat._id": seatid }, 
        { 
          $set: { 
            "seat.$.passengername": passengername, 
            "seat.$.passengeraddress":passengeraddress,
            "seat.$.passengerphone":passengerphone,
            "seat.$.booked": true 
          }
        }, 
        { new: true } 
      );
  
      if (updatedBus) {
        res.status(200).send(`Seat booked successfully for ${passengername}`);
      } else {
        res.status(404).send("Bus or seat not found");
      }
    } catch (err) {
      
      res.status(500)
    }
  });



  app.post("/deleteticket",usermiddleware,async(req,res)=>{

    let {busid,seatid,passengername}=req.body;

    try{

         await busSchema.findOneAndUpdate(
            {_id:busid , "seat._id":seatid},
            { $set :{

                
                "seat.$.passengername": null, 
                 "seat.$.passengeraddress":null,
                 "seat.$.passengerphone":null,
                 "seat.$.booked": false


            }},


        );

        

         res.send(`ticket canclled ${passengername}`)
        

    }
    catch(err){
        res.status(500)
    }

  })


//use api's:

app.post("/userRegister",async(req,res)=>{
    try{

        let {name,password,email,confirmpassword,address,phone}=req.body;

        let useexicst=await userschema.findOne({email});

        if(useexicst){
            return res.send("user exicst");
        }

        if(password!==confirmpassword){
            return res.send("confifrmpassword is not matching");
        }

        let newuser=await userschema({
            name,
            email,
            password,
            confirmpassword,
            address,
            phone
        });

        await newuser.save()

        res.send("registraton successful");



    }
    catch(err){
           res.status(500);
    }
})
  
app.post("/userlogin",async(req,res)=>{

    try{

        let {email,password}=req.body;

        let userex=await userschema.findOne({email});

        if(!userex){
            return res.send("user notfound")
        }

        if(password!==userex.password){
            return res.send("incorrect passsword");
        }


        let payload={
            user:{
                id:userex.id
            }
        }

        jwt.sign(payload,"usersecurity",{expiresIn:350000},(err,token)=>{
            res.json({token});

        })

    }
    catch(err){
        res.status(err);

    }
});


app.get("/userdashboard",usermiddleware,async(req,res)=>{
    try{

        let user=await userschema.findById(req.user.id);

        res.json(user);

        

    }
    catch(err){
       res.status(500);
    }
});



app.get("/buses",usermiddleware,async(req,res)=>{

    try{

        let buses=await busSchema.find({});

        res.json({buses});


    }
    catch(err){
        res.status(500)
    }
});


app.post("/busbyid",usermiddleware,async(req,res)=>{

    try{


        let {id}=req.body;

        let bus=await busSchema.findById(id);

        res.json({bus});
        
    }
    catch(err){
        res.status(500)
    }
})


app.post("/addticket",usermiddleware,async(req,res)=>{
    try{

        let {userid,busid,seatid,busname,from,to,seatno}=req.body;

       let ticket= await userschema.findByIdAndUpdate(userid,{
            $push : {mytickets:{busid,seatid,busname,from,to,seatno}}
        });

        if(ticket){
            res.send("ticket added")
        }

        else{
            res.send("not added");
        }



    }
    catch(err){
        res.status(500)
    }
})


app.post("/deleteticketfromuser",usermiddleware,async(req,res)=>{

    try{

        let {userid,_id}=req.body;

        await userschema.findByIdAndUpdate(userid,{
            $pull:{mytickets:{_id}}
        })

        
            res.send("ticket cancelled succesfully");
        

    }
    catch(err){
        res.status(500)
    }
});



app.post("/getbusbyid",sellermiddleware,async(req,res)=>{
    try{

        let {sellerid}=req.body;

        let data=await busSchema.find({sellerid});

        if(data){
            res.json(data);
        }

    }
    catch(err){
      res.status(400)
    }
});


app.post("/sellerbusbyid",sellermiddleware,async(req,res)=>{

    try{

        let {busid}=req.body;

        let bus=await busSchema.findById(busid);

        if(bus){
            return res.json(bus);
            
        }

    }
    catch(err){
        res.status(400)
      }
});


app.post("/deletebus",sellermiddleware,async(req,res)=>{
    try{

        let {id}=req.body;

       let d= busSchema.findOneAndDelete({id});

       if(d){
         return  res.send("raid canclled");
       }
       else{
           res.send("error")
       }

    }
    catch(err){
        res.status(500)
    }
})



app.listen(4000,()=>{
    console.log("server runnin on port 4000")
})