//Require Mongoose.
const { Schema, model } = require('mongoose');

//User Shcema.
const UserSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\w+([.-]?)*\w+@\w+\.\w{2,4}$/]
        },
        thoughts: [{
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }],
        friends: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    {
    toJSON: {
        virtuals: true,
    },
    id: false
    }
)


UserSchema.virtual('thoughtCount').get(function() {
    return this.thoughts.length;
});

UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;