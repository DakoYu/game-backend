const mongoose = require('mongoose');
const slugify = require('slugify');

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    year: {
        type: Number,
    },
    image: {
        type: String,
        default: 'game.jpg'
    },
    reviews: {
        type: Number,
        required: true,
        default: 5
    },
    slug: {
        type: String,
    },
    price: {
        type: Number
    }
});

gameSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;