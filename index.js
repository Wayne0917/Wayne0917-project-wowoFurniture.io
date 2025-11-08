//------Model層------
let productData = [];

const apiPath = "wayne0917";
const api = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}`;


//Model層-取得商品列表
async function getBackendData() {
    try {
        const apiData = await axios.get(`${api}/products`);
        productData = apiData.data.products;  

        clearScreen();
        renderProductCard(productData);
    } 
    catch (error) {
        console.error(`apiError: ${error.message} from getBackendData`);
    }
}
getBackendData();
//Model層-加入購物車
async function api_addToCart(productId) {
    try {
        const res = await axios.post(`${api}/carts`, 
            {
                "data": {
                    "productId": productId,
                    "quantity": 1
                }
            }
        );

        Swal.fire({
            title: "🛒加入購物車成功🛒",
            icon: "success",
            draggable: true,
        });

        clearScreen();
        renderProductCard(productData);
        renderShoppingCart(res.data.carts);
    }
    catch (error) {
        alert('加入購物車失敗,請聯絡客服人員');
        console.error(`api_addToCart API error: ${error.message}`);
    }
}
//Model層-更新購物車產品數量
async function api_updateToCart(productId, quantity) {
    try {
        let res = await axios.patch(`${api}/carts/`, {
            "data": {
                "id": productId,
                "quantity": quantity,
            },
        });
        renderShoppingCart(res.data.carts);

        if (res.status === 200) {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 900,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                },
            });
            Toast.fire({
                icon: "success",
                title: "修改數量成功",
            });
        }
    }
    catch (error) {
        alert('修改數量失敗,請聯絡客服人員');
        console.error(`api_updateToCart API error: ${error.message}`);
    }
}
//Model層-刪除所有購物車品項
async function api_delAllToCart() {
    try {
        const result = await Swal.fire({
            title: "確定刪除所有購物車品項?",
            text: "刪除後將無法復原",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "確定",
        });
        if (result.isConfirmed) {
            let res = await axios.delete(`${api}/carts`);
            Swal.fire({
                title: "已刪除所有購物車品項",
                icon: "success",
                timer: 1000,
            });

            clearScreen();
            renderProductCard(productData);
            renderShoppingCart(res.data.carts);
        };
    }
    catch (error) {
        alert('刪除所有購物車品項失敗,請聯絡客服人員');
        console.error(`api_delAllToCart API error: ${error.message}`);
    }
}
//Model層-刪除單一購物車品項
async function api_delSingleItemToCart(cartId) {
    try {
        let res = await axios.delete(`${api}/carts/${cartId}`);
        clearScreen();
        renderProductCard(productData);
        renderShoppingCart(res.data.carts);
        console.log(res);
    } 
    catch (error) {
        alert('刪除購物車失敗,請聯絡客服人員');
        console.error(`api_delToCart API error: ${error.message}`);
    }
}
//Model層-送出訂單
async function api_submitOrder() {
    try {
        // 先取 input 值
        const name = String(document.querySelector("#customerName").value.trim());
        const tel = String(document.querySelector("#customerPhone").value.trim());
        const email = String(document.querySelector("#customerEmail").value.trim());
        const address = String(document.querySelector("#customerAddress").value.trim());
        const payment = document.querySelector("#tradeWay").value;

    // 檢查購物車是否為空
        const cartRes = await axios.get(`${api}/carts`);
        if (cartRes.data.carts.length === 0) {
            await Swal.fire({
                title: "購物車是空的！",
                text: "請先加入商品再提交訂單 😅",
                icon: "warning",
                confirmButtonText: "確定",
            });
            return;
        }
    // 彈出確認對話框
    const result = await Swal.fire({
        title: "確定送出訂單？",
        text: "送出後將無法修改訂單內容",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "確定送出",
        cancelButtonText: "再檢查一下",
    });

    if (!result.isConfirmed) return;

    // 顯示載入中
    Swal.fire({
        title: "訂單送出中...🚛",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
    });

    // 發送 API
    const orderRes = await axios.post(`${api}/orders`, {
        data: { 
            user: { 
                name, 
                tel, 
                email, 
                address, 
                payment,
            } 
        },
    });

    Swal.close();
    await Swal.fire({
        icon: "success",
        title: "🛒訂單提交成功🛒",
        text: "我們已收到您的訂單😉",
    });
    // 清空畫面
    orderInfoForm.reset();
    renderShoppingCart([]);

    } 
    catch (error) {
        alert("送出訂單失敗,請聯絡客服人員");
        console.error(`api_submitOrder API error: ${error}`);
    }
}
//Model層-篩選商品列表
let filterData = [];
function getFilterProduct(productSelectValue) {
    filterData = productData.filter( product => productSelectValue === product.category);
}


//------View層------
//View-渲染 商品列表
const productWrap = document.querySelector('.productWrap');
function renderProductCard(productData) {
    //假如再篩選 狀態 典籍加入購物車就 不要重渲染了
    if (filterData.length > 0) {
        productData = filterData;
    }
    const fragment  = document.createDocumentFragment();
    
    productData.forEach( item => {
        const li = document.createElement('li');
        li.classList.add("productCard");
    
        const h4 = document.createElement('h4');
        h4.classList.add("productType");
        h4.textContent = "新品";
    
        const img = document.createElement('img');
        img.src = item.images;
        img.alt = item.title;
    
        const button = document.createElement("button");
        button.type = 'submit';
        button.classList.add("addCardBtn");
        button.textContent = "加入購物車";
        button.dataset.id = item.id;
    
        const h3 = document.createElement('h3');
        h3.textContent = item.title;
    
        const del = document.createElement('del');
        del.classList.add("originPrice");
        del.textContent = `NT$${item.origin_price}`;
    
        const p = document.createElement('p');
        p.classList.add("nowPrice");
        p.textContent = `NT$${item.price}`;
    
        li.append(h4, img, button, h3, del, p);
        fragment.appendChild(li);
    })
    productWrap.appendChild(fragment);
}
//View-渲染 購物車
function renderShoppingCart(cartData) {
const fragment = document.createDocumentFragment();
const shoppingCartTable = document.querySelector(".shoppingCart-table");

//購物車頂層 tr
    shoppingCartTable.innerHTML = `
        <tr>
            <th width="40%">品項</th>
            <th width="15%">單價</th>
            <th width="15%">數量</th>
            <th width="15%">金額</th>
            <th width="15%"></th>
        </tr>
    `;

cartData.forEach((item) => {
    console.log(item);

    const tr = document.createElement("tr");
    //第一個td
    const firsTd = document.createElement("td");

    const div = document.createElement("div");
    div.classList.add("cardItem-title");

    const img = document.createElement("img");
    img.src = item.product.images;
    img.alt = item.product.title;

    const p = document.createElement("p");
    p.textContent = item.product.title;

    div.append(img, p);
    firsTd.append(div);

    //第二個td
    const secondTd = document.createElement("td");
    secondTd.textContent = `NT$${item.product.price}`;

    //第三個td
    const thirdTd = document.createElement("td");

    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.classList.add("quantityInput");
    quantityInput.value = item.quantity;
    quantityInput.dataset.id = item.id;

    thirdTd.append(quantityInput);

    //第四個td
    const fourthTd = document.createElement("td");
    fourthTd.textContent = `NT$${item.product.price * item.quantity}`;

    //第五個td
    const fifthTd = document.createElement("td");
    fifthTd.classList.add("discardBtn");

    const button = document.createElement("button");
    button.type = "button";
    button.classList = "material-icons";
    button.textContent = "clear";
    button.dataset.id = item.id;

    fifthTd.append(button);

    tr.append(firsTd, secondTd, thirdTd, fourthTd, fifthTd);
    fragment.appendChild(tr);
});
    shoppingCartTable.append(fragment);

    //購物車底層 tr
    const bottomTr = document.createElement('tr');
    bottomTr.classList.add('bottomTr');
    
    const totalPriceTd = document.createElement('td');
    totalPriceTd.textContent = `
    NT$${cartData.reduce((total, item) => total + item.product.price * item.quantity, 0)}
    `;

    bottomTr.innerHTML = `
        <td>
            <button type="button" class="discardAllBtn">刪除所有品項</button>
        </td>
        <td></td>
        <td></td>
        <td>
            <p>總金額</p>
        </td>
    `;

    bottomTr.append(totalPriceTd);
    shoppingCartTable.appendChild(bottomTr);

    if (cartData.length === 0) {
        shoppingCartTable.innerHTML = "";
        bottomTr.innerHTML = "";
    }
}
//View-重新渲染
function clearScreen() {
    productWrap.innerHTML = '';
}


//------Controller層------
//Controller層-篩選商品
const productSelect = document.querySelector(".productSelect");
productSelect.addEventListener('change', (e) => {
    let productSelectValue = e.target.value;

    getFilterProduct(productSelectValue);

    clearScreen();
    if (productSelectValue === "全部") {
        renderProductCard(productData);
    }
    renderProductCard(filterData);
})
//Controller層-事件代理-加入購物車
productWrap.addEventListener('click', (e) => {
    const productId = e.target.dataset.id;

    if (e.target.matches('.addCardBtn')) {
        api_addToCart(productId);
    };
});
//Controller層-事件代理-更新購物車
const shoppingCart = document.querySelector('.shoppingCart');
shoppingCart.addEventListener('change', (e) => {
    const productId = e.target.dataset.id;
    const quantity = Number(e.target.value);

    if (e.target.matches('.quantityInput')) {
        api_updateToCart(productId, quantity);        
    };
});
//Controller層-事件代理-刪除購物車
shoppingCart.addEventListener('click', (e) => {
    if (e.target.matches(".discardAllBtn")) {
        api_delAllToCart();
    }
});
//Controller層-事件代理-刪除單一品項
shoppingCart.addEventListener('click', (e) => {
    cartId = e.target.dataset.id;
    
    if (e.target.matches(".material-icons")) {
        api_delSingleItemToCart(e.target.dataset.id);
    }
});
//Controller層-送出預定資料
const allInput  = document.querySelectorAll('input');
const orderInfoForm = document.querySelector('.orderInfo-form');
const orderInfoMessage = document.querySelectorAll(".orderInfo-message");
const orderInfoBtn = document.querySelector('.orderInfo-btn');
//提交預定資料
orderInfoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    let isWrite = true;     //檢查 全部 輸入欄 是否有填寫資料
    //檢查 全部 輸入欄 是否有填寫資料
    allInput.forEach((input, index) => {
        if (input.value.trim() === "") {
            isWrite = false;
            orderInfoMessage[index].style.display = "block";
        } else {
            orderInfoMessage[index].style.display = "none";
        }
    });

    if (!isWrite) return alert('請填寫正確資料');
    api_submitOrder();
    allInput.forEach( input => input.value = "");
})
//當使用者修改任一欄位，就檢查那個欄位
allInput.forEach((input, index) => {
    input.addEventListener('change', () => {
        if (input.value.trim() === "") {
            isWrite = false;
            orderInfoMessage[index].style.display = "block";
        } else {
            isWrite = true;
            orderInfoMessage[index].style.display = "none";
        }
    });
});
