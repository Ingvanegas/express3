module.exports.create = async (model, data) => {
    const nuevousuario = new model(data);
    await nuevousuario.save();
}

module.exports.update = async (model, id, data) => {
    await model.findByIdAndUpdate(id, data);
}

module.exports.delete = async (model, id) => {
    await model.findByIdAndDelete(id);
}

module.exports.get = async (model) => {
    return await model.find();
}

module.exports.getById = async (model, _id) => {
    return await model.find({_id});
}
