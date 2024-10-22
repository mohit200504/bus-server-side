
const mongoose=require("mongoose");

let userschema=mongoose.Schema({
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

    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    mytickets:[
        {
            busid:{
                type:String,
            },
            seatid:{
                type:String
            },
            busname:{
                type:String
            },
            from:{
                type:String
            },
            to:{
                type:String
            },
            seatno:{
                type:String
            }
        }
    ]
});

module.exports=mongoose.model("User",userschema);
