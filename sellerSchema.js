const mongoose=require("mongoose");

const sellerschema=mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    travelsname:{
        type:String,
        required:true
    }
});

module.exports=mongoose.model("Seller",sellerschema);
