const container = document.getElementById('container')
const modal = document.getElementById('modal')
const cartBtn = document.getElementById('cart-btn')
const menu = document.getElementById('menu')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkout = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')
const spanItem = document.getElementById('date-span')

let cart = []

// Abrir modal carrinho
cartBtn.addEventListener('click', () => {
    updateCartModal()
    modal.style.display = 'flex'
})

// Fechar modal
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none'
    }
})
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none'
})
//-------

// Adicionar item no carrinho
function addToCart(name, price) {
    //  Verificando se o produto já existe no carrinho
    const existingItem = cart.find(item => item.name === name)
    if (existingItem) {
        existingItem.quantity++
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}
//-------

// Pegar atributos 'data' do elemento
container.addEventListener('click', (e) => {
    let parentButton = e.target.closest('.add-to-cart-btn')

    if (parentButton) {
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))

        addToCart(name, price)
        Toastify({
            text: "Item adicionado ao carrinho",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "green",
            },
        }).showToast();
    }
})
//-------

// Adicionar item ao carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = ''
    let total = 0

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')

        cartItemElement.innerHTML = `
        
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2 pb-1">R$ ${item.price.toFixed(2)}</p>
            </div>

            <button class="font-bold remove-from-cart-btn" data-name="${item.name}"> Remover </button>
        </div>
        
        `

        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemElement)


    })

    cartTotal.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })

    cartCounter.innerHTML = `( ${cart.length} )`
}
//-------

//Remover item do carrinho
cartItemsContainer.addEventListener('click', e => {
    if (e.target.classList.contains("remove-from-cart-btn")) {
        const name = e.target.getAttribute('data-name')

        removeCartItem(name)
    }

})

function removeCartItem(name) {
    const index = cart.findIndex(item => item.name === name)

    if (index !== -1) {
        const item = cart[index]
        console.log(item);

        if (item.quantity > 1) {
            item.quantity--
            updateCartModal()
            return
        }

        cart.splice(index, 1)
        updateCartModal()

    }
}
//-------

// Verificação se o endereço está vazio e finalização do pedido
addressInput.addEventListener("input", (e) => {
    let inputValue = e.target.value

    if (inputValue !== '') {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add('hidden')

    }
})

checkout.addEventListener('click', () => {

    // Verificar o horário
    const isOpen = restaurantIsOpen()
    if (!isOpen) {
        Toastify({
            text: "Desculpe, o restaurante está fechado no momento",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return; // Adicionando a chave de fechamento aqui
    }

    if (cart.length === 0) return

    if (addressInput.value === '') {
        addressWarn.classList.remove('hidden')
        addressInput.classList.add("border-red-500")
        return
    }
      // Enviar pedido para api do WhatsApp
    const cartItems = cart.map(item => {
        return (
            `${item.name} - Quantidade: (${item.quantity}) - Preço: R$ ${item.price.toFixed(2)} | `
        )
    }).join('')

    const message = encodeURIComponent(cartItems)
    const phone = '61986626251'

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = []
    updateCartModal()
})

//-------

// Verificar e manipular o card de horário
function restaurantIsOpen() {
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 22 // true -> Restaurante aberto
}

const isOpen = restaurantIsOpen()
if (isOpen) {
    spanItem.classList.remove('bg-red-500')
    spanItem.classList.add('bg-green-600')
} else {
    spanItem.classList.remove('bg-green-600')
    spanItem.classList.add('bg-red-500')
}
