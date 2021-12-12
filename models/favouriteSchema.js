const mongoose =  require('mongoose');


const favouriteSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    game: {
        type: mongoose.Schema.ObjectId,
        ref: 'Game',
        required: true
    }
}, 
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

favouriteSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'game',
        // select: 'name'
    })
    next();
})

favouriteSchema.index({game:1,user:1},{unique:true});

const Favourite = mongoose.model('Favourite', favouriteSchema);

module.exports = Favourite;