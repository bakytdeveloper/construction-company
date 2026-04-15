// import mongoose from 'mongoose';
//
// const projectSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: [true, 'Название проекта обязательно'],
//         trim: true
//     },
//     titleKz: {
//         type: String,
//         trim: true
//     },
//     category: {
//         type: String,
//         required: true,
//         enum: ['houses', 'apartments', 'commercial']
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     descriptionKz: {
//         type: String
//     },
//     location: {
//         type: String,
//         required: true
//     },
//     area: {
//         type: Number,
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     images: [{
//         type: String,
//         required: true
//     }],
//     mainImage: {
//         type: String,
//         required: true
//     },
//     features: [{
//         type: String
//     }],
//     completedDate: {
//         type: Date,
//         default: Date.now
//     },
//     isActive: {
//         type: Boolean,
//         default: true
//     },
//     seoTitle: String,
//     seoDescription: String,
//     seoKeywords: String
// }, {
//     timestamps: true
// });
//
// export default mongoose.model('Project', projectSchema);