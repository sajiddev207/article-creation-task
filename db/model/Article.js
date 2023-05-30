const mongoose = require("mongoose")
const { Schema } = mongoose;

const ArticleSchema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        ref: 'User',
    },
    title: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Number,
        default: Date.now()
    }

})
ArticleSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        return ret;
    }
};
module.exports = mongoose.model('Article', ArticleSchema, 'Article')