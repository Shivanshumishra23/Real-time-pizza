const order = require("../../../models/order")


 function orderController(){
    return {
        index(req, res) {
            order.find({ status: { $ne: 'completed' } })
            .sort('-createdAt')
            .populate('customerId', '-password')
            .then(orders => {
                if(req.xhr) {
                    return res.json(orders)
                }
                else {
                    return res.render('admin/orders',{orders:orders})
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    }
}

module.exports = orderController
