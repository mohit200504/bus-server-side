const mongoose=require("mongoose");

const busschema=mongoose.Schema({
    sellerid:{
        type:String,
        required:true
    },
    busname:{
        type:String,
        required:true
    },
    busno:{
        type:Number,
        required:true
    },
    from:{
        type:String,
        required:true
    },
    to:{
        type:String,
        required:true
    },

    login:{
        type:String,
        required:true
    },

    logout:{
        type:String,
        required:true
    },

    seat:[
        {
            seatno:{
                type:String
            },

            passengername:{
                type:String,
                
            },
            passengeraddress:{
                type:String,
            },
            passengerphone:{
                type:String,
            },

            booked:{
                type:Boolean,
                default:false
            }

        }
    ]
});


module.exports=mongoose.model("Buses",busschema);
