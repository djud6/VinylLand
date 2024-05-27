const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vinylSchema = new Schema({
    title: { type: String, required: [true, 'Title is required'] },
    artist: { type: String, required: [true, 'Artist is required'] },
    seller: {type: Schema.Types.ObjectId, ref:'User'},
    details: {
        type: String,
        required: [true, 'Details are required'],
        minlength: [10, 'Details must have at least 10 characters']
    },
    condition: { 
        type: String, 
        required: [true, 'Condition is required'], 
        enum: ['New', 'Excellent', 'Very Good', 'Good', 'Fair']
    },
    price: { 
        type: Number, 
        required: [true, 'Price is required'], 
        min: [0.01, 'Price cannot be less than 0.01']
    }, 
    totalOffers: { type: Number, default: 0 }, 

    image: { type: String, required: [true, 'Image is required'] },

    active: { type: Boolean, default: true },

    highestOffer: { type: Number,default: 0}

});

const Vinyl = mongoose.model('Vinyl', vinylSchema);
module.exports = Vinyl;
/*const {v4: uuidv4} = require('uuid');
const vinyls = [
    {
        id: '1',
        title: 'Igor',
        artist:'Tyler, the Creator',
        seller: 'Sam Jenkins',
        condition: 'New',
        price: 23.99,
        details: '5th studio album by Tyler, the Creator. My personal favorite and his highest grossing',
        image: 'igor.png',
        totalOffers: 23,
        active: 'Yes'
    },
    {
        id: '2',
        title: 'Blonde',
        artist:'Frank Ocean',
        seller: 'Juju Jenkins',
        condition: 'New',
        price: 25.99,
        details: 'Frank ocean second studio album, limited edition.',
        image: 'blonde.jpg',
        totalOffers: 25,
        active: 'Yes'
    },
    {
        id: '3',
        title: 'Doomsday',
        artist:'MF Doom',
        seller: 'Dan James',
        condition: 'New',
        price: 19.99,
        details: 'Doomsday by MF Doom',
        image: 'doomsday.png',
        totalOffers: 15,
        active: 'Yes'
    },
    {
        id: '4',
        title: 'Graduation',
        artist:'Kanye West',
        seller: 'Abby James',
        condition: 'Good',
        price: 14.99,
        details: 'Graduation by Kanye West',
        image: 'graduation.png',
        totalOffers: 9,
        active: 'Yes'
    },
    {
        id: '5',
        title: 'HIVEMIND',
        artist:'The Internet',
        seller: 'Abby Zach',
        condition: 'Fair',
        price: 8.99,
        details: 'HIVEMIND by The Internet',
        image: 'hivemind.jpg',
        totalOffers: 12,
        active: 'Yes'
    },
    {
        id: '6',
        title: 'Awaken My Love',
        artist:'Childish Gambino',
        seller: 'Jared Zach',
        condition: 'Very good',
        price: 18.99,
        details: 'Awaken My Love by Childish Gambino',
        image: 'awaken.png',
        totalOffers: 19,
        active: 'Yes'
    }
];

exports.find = function() {
    return vinyls;
};

exports.findById = function(id) {
    return vinyls.find(vinyl => vinyl.id === id);
};

exports.save = function(vinyl){
    vinyl.id = uuidv4();
    vinyls.push(vinyl);
};

exports.updateById = function(id, newVinyl) {
    let vinyl = vinyls.find(vinyl => vinyl.id === id);;
    if (vinyl) {
        vinyl.condition = newVinyl.condition;
        vinyl.title = newVinyl.title;
        vinyl.price = newVinyl.price;
        vinyl.details = newVinyl.details;
        vinyl.image = newVinyl.image;
        return true;
    } else {
        return false;
    }
};

exports.deleteById = function(id){
    let index = vinyls.findIndex(vinyl=>vinyl.id === id);
    if(index !== -1){
        vinyls.splice(index, 1);
        return true;
    }else{
        return false;
    }
};

exports.search = function (searchTerm) {
    if (!searchTerm) {
      return vinyls;
    }
  
    const normalizedSearchTerm = searchTerm.toLowerCase();
    return vinyls.filter(vinyl => 
      vinyl.title.toLowerCase().includes(normalizedSearchTerm)||
      vinyl.details.toLowerCase().includes(normalizedSearchTerm)||
      vinyl.artist.toLowerCase().includes(normalizedSearchTerm)
    );
  };
*/