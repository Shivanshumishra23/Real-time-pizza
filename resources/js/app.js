import axios from 'axios'
import expressEjsLayouts from 'express-ejs-layouts'
import Noty from 'noty'


let addToCart =document.querySelectorAll('.add-to-cart')
let cartCounter= document.querySelector('#cartCounter')

function upadateCart(pizza){
    axios.post('/update-cart',pizza).then(res=>{
        console.log("hello")
        cartCounter.innerText =res.data.totalQty
       new Noty({
        type:'success',
        timeout: 1000,
        text: 'Item added to cart',
        
       }).show();
    }).catch(err=>{
        new Noty({
            type:'error',
            timeout: 1000,
            text: 'Something went wrong',
            
           }).show();
    })
}
  


addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        let pizza = JSON.parse(btn.dataset.pizza)
        upadateCart(pizza)
       
    })
})


//remove alert 
const alertMsg =document.querySelector('#success-alert')
if (alertMsg){
    setTimeout(()=>{
        alertMsg.remove()
    },2000)
}


function initAdmin(){
    const orderTableBody = document.querySelector('#orderTableBody')
    let orders = []
    let markup

    
    axios.get('/admin/orders', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        orders = res.data
     console.log(orders)
        markup = generateMarkup(orders)
        orderTableBody.innerHTML = markup
    }).catch(err => {
        console.log(err)
    })

    function renderItems(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((menuItem) => {
            return `
                <p>${ menuItem.item.name } - ${ menuItem.qty } pcs </p>
            `
        }).join('')
      }

    function generateMarkup(orders) {
        return orders.map(order => {
            return `
                <tr>
                <td class="border px-4 py-2 text-green-900">
                    <p>${ order._id }</p>
                    <div>${ renderItems(order.items) }</div>
                </td>
                <td class="border px-4 py-2">${ order.customerId.name }</td>
                <td class="border px-4 py-2">${ order.address }</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${ order._id }">
                            <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="order_placed"
                                    ${ order.status === 'order_placed' ? 'selected' : '' }>
                                    Placed</option>
                                <option value="confirmed" ${ order.status === 'confirmed' ? 'selected' : '' }>
                                    Confirmed</option>
                                <option value="prepared" ${ order.status === 'prepared' ? 'selected' : '' }>
                                    Prepared</option>
                                <option value="delivered" ${ order.status === 'delivered' ? 'selected' : '' }>
                                    Delivered
                                </option>
                                <option value="completed" ${ order.status === 'completed' ? 'selected' : '' }>
                                    Completed
                                </option>
                            </select>
                        </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">
                    ${ moment(order.createdAt).format('hh:mm A') }
                </td>
                <td class="border px-4 py-2">
                    ${ order.paymentStatus ? 'paid' : 'Not paid' }
                </td>
            </tr>
        `
        }).join('')
    }

};