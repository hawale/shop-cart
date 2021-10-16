{
  /* <script
  src="https://code.jquery.com/jquery-3.6.0.slim.min.js"
  integrity="sha256-u7e5khyithlIdTpu22PHhENmPcRdFiHRjhAuHcs05RI="
  crossorigin="anonymous"
></script>; */
}

// main function
$(function () {
  function getCat() {
    fetch("http://fakestoreapi.com/products/categories")
      .then((response) => response.json())
      .then((data) => {
        data.unshift("All");
        $.each(data, function (key, value) {
          $(`<option>${value.toUpperCase()}</option>`).appendTo("#selectId");
        });
      });
  }
  // Array
  var cartItems = [];
  var price = [];

  // Cart item Data
  function loadTable(cartItems) {
    $("#tbody").html("");
    $.each(cartItems, function (key, value) {
      totalCal(cartItems.price);
      $(`
                  <tr class="table-primary">
                    <th>${value.title}</th>
                    <th>&#8377;${value.price}</th>
                    <th><img src="${value.image}" width="200px" height="200px"></th>
                    <th><button class="btn btn-danger rounded-circle" id="removeBtn" value=${key}><i class="bi bi-x-circle"></i></button></th>
                    </tr>
                    `).appendTo("#tbody");
      console.log(key);
    });
  }

  // Calculation Formula
  function totalCal(price) {
    $("#tfoot").html("");
    let total = 0;
    if (cartItems == "") {
      $("#tpc").html(`&#8377; 00`);
    } else {
      $.each(price, function (key, value) {
        total += parseFloat(value);
        final = total.toFixed(2);
        $("#tpc").html(`&#8377;${final}`);
      });
    }
  }

  // Add to Cart
  $(document).on("click", "#btnAdd", function (event) {
    var id = event.target.value;

    fetch(`http://fakestoreapi.com/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        cartItems.push(data);
        price.push(data.price);
        totalCal(price);

        alert(`${data.title} is Added to cart`);
        $("#cartCount").html(cartItems.length);
        loadTable(cartItems);
      });
  });

  // Remove Item From Cart

  $(document).on("click", "#removeBtn", function (event) {
    let index;
    index = parseInt(event.target.value);
    console.log(index);
    cartItems.splice(index, 1);
    price.splice(index, 1);
    totalCal(price);
    loadTable(cartItems);
  });

  // Load products
  function loadproducts(data) {
    $.each(data, function (key, value) {
      $(`
                <div class ="card m-4 mb-3 p-2 w-25">
                    <img src=${value.image} height="200" class="card-img-top">
                    <div class ="card-header" style="height:150px">
                    <h5>${value.title}</h5>
                    </div>
                    <div class="card-body text-success">
                    <h6 text->&#8377;${value.price}</h6>
                    </div>
                    <div class="card-footer">
                        <button class ='btn btn-danger w-100' id="btnAdd" value=${value.id}> <span class="bi bi-cart4"> </span> Add to Cart</button>
                     </div>
                     </div>
             `).appendTo("#cards");
    });
  }

  // Get products Data
  function getProducts() {
    fetch("http://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        loadproducts(data);
      });
  }
  getCat();
  getProducts();

  // Search Products

  // Change Categories
  $("#selectId").change(function (event) {
    var catname = event.target.value.toLowerCase();
    if (catname == "all") {
      $("#cards").html("");
      getProducts();
    } else {
      fetch(`http://fakestoreapi.com/products/category/${catname}`)
        .then((response) => response.json())
        .then((data) => {
          $("#cards").html("");
          loadproducts(data);
        });
    }
  });

  // Search Option
  $(document).on("submit", "#searchForm", function (event) {
    console.log("event.keyCode", event);
    event.preventDefault();
    var searchstring = $("#search").val().toLowerCase();
    $(".card").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(searchstring) > -1);
    });
  });
});
