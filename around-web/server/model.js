const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DB_URL = 'mongodb://localhost:27017/around-web';
mongoose.connect(DB_URL, { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
    console.log('mongodb connected');
});
// 集合的schema
const model = {
    user: {
        username: {
            type: String,
            required: true // 必须有
        },
        password: {
            type: String,
            required: true
        }
    },
    post: {
        lat: {
            type: String,
            required: true
        },
        lon: {
            type: String,
            required: true
        },
        message: {
            type: String
        },
        type: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true // 必须有
        },
        url: {
            type: String,
            required: true
        },
    }

};
// 注册所有的集合
for (let k in model) {
    mongoose.model(k, new Schema(model[k]));
}
module.exports = {
    getModel: function (name) { // 获取对应名称的集合
        return mongoose.model(name);
    }
};