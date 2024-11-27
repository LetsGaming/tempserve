const addTemp = (req, res) => {
    const userId = req.user.id
    const {temperature} = req.body;

    if(temperature) {
        res.status(404)
    }
}

module.exports = {
    addTemp
}