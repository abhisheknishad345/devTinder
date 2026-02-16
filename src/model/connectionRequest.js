
const { default: mongoose } = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({

    fromUserId:{
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
        
    },
    
    toUserId:{
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
        
    },
    
    status:{
        required: true,
        type: String,
        enum:{
            values:["ignored", "interested","accepted", "rejected"],
            message:`{VALUE} is incorrect status type`
        }
    }
    
},

{
    timestamps:true
}
)

connectionRequestSchema.index({fromUserId:1, toUserId:1 })

 connectionRequestSchema.pre('save', function(next) {
    const connectionReq = this;
    // check if fromuserid is same as touserid
  if (connectionReq.fromUserId.equals(connectionReq.toUserId)) {
    throw new Error("Cannot send connection request to yourself!")
    
  }
  next();
 });


module.exports =  mongoose.model (
    "ConnectionRequest",
    connectionRequestSchema
)

