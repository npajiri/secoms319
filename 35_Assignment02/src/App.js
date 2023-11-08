import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect  } from "react";
import { products } from "./products";
import "./index.css";
import "./bootstrap.min.css";
import "./headers.css";
import productsData from "./products.json";


//This section prevents an error showing up:
function throttle(f, delay) {
  let timer = 0;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => f.apply(this, args), delay);
  };
}

const myResize = new ResizeObserver(
  throttle((entries) => {
    console.log();
  }, 1000)
);

myResize.observe(document.getElementById("root"));
//end of error prevention

function App() {
  const [showComponent, setShowComponent] = useState("index");
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [formData, setFormData] = useState({});
  const [searchPhrase, setSearchPhrase] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const uniqueProducts = productsData.reduce((unique, product) => {
      if (!unique.find((item) => item.id === product.id)) {
        unique.push(product);
      }
      return unique;
    }, []);
    
    const limitedProducts = uniqueProducts.slice(0, 9);

    setProducts(limitedProducts);
  }, []);

  


  const showCheckout = () => {
    if (showComponent === "confirmation") {
      setCart([]);
      setCartTotal(0);
    }
    setShowComponent("pagesecond");
  };

  const showIndex = () => {
    if (showComponent === "confirmation") {
      setCart([]);
      setCartTotal(0);
    }

    setShowComponent("index");
  };

  const showConfirmation = () => {
    setShowComponent("confirmation");
  };

  const addProduct = (product) => {
    const existingProduct = cart.find(
      (item) => item.productName === product.productName
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
      setCart([...cart]);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    setCartTotal(cartTotal + product.price);
  };

  const removeFromCart = (product) => {
    const existingProductIndex = cart.findIndex(
      (item) => item.productName === product.productName
    );
    if (existingProductIndex === -1) return;

    const existingProduct = cart[existingProductIndex];
    if (existingProduct.quantity === 1) {
      const updatedCart = cart.filter(
        (item) => item.productName !== product.productName
      );
      setCart(updatedCart);
    } else {
      const updatedProduct = {
        ...existingProduct,
        quantity: existingProduct.quantity - 1,
      };
      const updatedCart = [...cart];
      updatedCart.splice(existingProductIndex, 1, updatedProduct);
      setCart(updatedCart);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchPhrase.toLowerCase())
  );

  const listItems = filteredProducts.map((product, index) => {
    // find the product in the cart if it exists
    const productInCart = cart.find(
      (item) => item.productName === product.productName
    );
    // get the quantity or default to 0 if the product is not in the cart
    const quantity = productInCart ? productInCart.quantity : 0;


  
  

  return (
  <div>
    <div className="col">
      <div className="card shadow-sm">
        <img src={require("./images/" + product.imageUrl)}></img>
        <div className="card-body">
          <strong>{product.productName}</strong>
          <p className="card-text">{product.description}</p>
          <div className="d-flex justify-content-between align-items-end">
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => addProduct(product)}
              >
                +
              </button>
              <span className="btn btn-sm btn-outline-secondary">
                {quantity}
              </span>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => removeFromCart(product)}
              >
                -
              </button>
            </div>
            <small className="text-body-emphasis">${product.price}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
);
});

  const Index = () => {
    return (
      <div>
        <script src="../assets/dist/js/bootstrap.bundle.min.js"></script>

        <div>
          <div id="main">
            <section className="py-5 text-center container">
              <div className="row py-lg-5">
                <div className="col-lg-6 col-md-8 mx-auto">
                  <h1 className="fw-light">35 Interior</h1>
                  <p className="lead text-body-secondary">
                    Welcome to our new and improved website!
                    <br />
                    Now including a search bar and shopping cart!
                  </p>
                </div>
              </div>
            </section>
            <div className="album py-5 bg-light cardBackground">
              <div className="container">
                <div
                  id="container"
                  className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3"
                >
                  {listItems}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Checkout = (props) => {
    const [values, setValues] = useState({
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      country: "",
      state: "",
      zip: "",
      cardNumber: "",
    });
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
      e.preventDefault();
      const newErrors = {};
      let isValid = true;

      //validate first name
      if (!values.firstName) {
        newErrors.firstName = "Please enter your first name.";
        isValid = false;
      }

      //validate last name
      if (!values.lastName) {
        newErrors.lastName = "Please enter your last name.";
        isValid = false;
      }

      // Validate email
      if (!validateEmail(values.email)) {
        newErrors.email = "Please enter a valid email address.";
        isValid = false;
      }

      //validate Address
      if (!values.address) {
        newErrors.address = "Please enter your address.";
        isValid = false;
      }

      //validate country
      if (!values.country) {
        newErrors.country = "Please choose your country.";
        isValid = false;
      }

      //validate state
      if (!values.state) {
        newErrors.state = "Please choose your state.";
        isValid = false;
      }

      //validate zip
      if (!validateZip(values.zip)) {
        newErrors.zip = "Please enter a valid zip code.";
        isValid = false;
      }

      //validate card Number
      if (!validateCardNumber(values.cardNumber)) {
        newErrors.cardNumber = "Please enter a valid credit card number.";
        isValid = false;
      }

      setErrors(newErrors);
      // Submit the form if all validations pass
      if (isValid) {
        console.log("submitForm();");
        setFormData(values);
        setShowComponent("confirmation");
      }
    };

    const validateCardNumber = (number) => {
      // const re = /^[0-9]{16}$/;
      const re = /^[0-9]{4}\-[0-9]{4}\-[0-9]{4}\-[0-9]{4}$/;
      return re.test(number);
    };

    const validateEmail = (email) => {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    };

    const validateZip = (number) => {
      const re = /^[0-9]{5}$/;
      return re.test(number);
    };

    const handleChange = (e) => {
      setValues({ ...values, [e.target.name]: e.target.value });
    };

    return (
      <div>
        <div>
          <div className="container">
            <main>
              <div className="py-5 text-center"></div>

              <div className="row g-5">
                <div className="text">
                  <button
                    type="button"
                    className="btn btn-warning"
                    id="checkOut"
                    onClick={showIndex}
                  >
                    Return
                  </button>
                </div>
                <div className="col-md-5 col-lg-4 order-md-last">
                  <h4 className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-primary">Your cart</span>
                    <span className="badge bg-primary rounded-pill">
                      {props.products.reduce((acc, cur) => {
                        return acc + cur.quantity;
                      }, 0)}
                    </span>
                  </h4>
                  <ul className="list-group mb-3">
                    {props.products.map((product, index) => (
                      <li className="list-group-item d-flex justify-content-between lh-sm">
                        <div>
                          <h6 className="my-0">{product.productName}</h6>
                          <small className="text-body-secondary">
                            {product.quantity}
                          </small>
                        </div>
                        <span className="text-body-secondary">
                          ${product.quantity * product.price}
                        </span>
                      </li>
                    ))}

                    <li className="list-group-item d-flex justify-content-between">
                      <h6 className="my-0">Tax (7%)</h6>
                      <span className="text-body-secondary">
                        ${(0.07 * cartTotal).toFixed(2)}
                      </span>
                    </li>

                    <li className="list-group-item d-flex justify-content-between">
                      <span>Total (USD)</span>
                      <strong>${(cartTotal + 0.07 * cartTotal).toFixed(2)}</strong>
                    </li>
                  </ul>
                </div>
                <div className="col-md-7 col-lg-8">
                  <h4 className="mb-3">Payment Information</h4>
                  <form
                    className="needs-validation"
                    noValidate
                    onSubmit={handleSubmit}
                  >
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <label htmlFor="firstName" className="form-label">
                          First name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          name="firstName"
                          onChange={handleChange}
                          placeholder=""
                          value={values.firstName}
                          required
                        />
                        {errors.firstName && (
                          <div className="alert alert-danger">
                            {errors.firstName}
                          </div>
                        )}
                      </div>

                      <div className="col-sm-6">
                        <label htmlFor="lastName" className="form-label">
                          Last name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          name="lastName"
                          onChange={handleChange}
                          value={values.lastName}
                          required
                        />
                        {errors.lastName && (
                          <div className="alert alert-danger">
                            {errors.lastName}
                          </div>
                        )}
                      </div>

                      <div className="col-12">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="email"
                          name="email"
                          onChange={handleChange}
                          value={values.email}
                          placeholder="you@example.com"
                          required
                        />
                        {errors.email && (
                          <div className="alert alert-danger">
                            {errors.email}
                          </div>
                        )}
                      </div>

                      <div className="col-12">
                        <label htmlFor="address" className="form-label">
                          Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="address"
                          name="address"
                          onChange={handleChange}
                          value={values.address}
                          placeholder="1234 Main St"
                          required
                        />
                        {errors.address && (
                          <div className="alert alert-danger">
                            {errors.address}
                          </div>
                        )}
                      </div>

                      <div className="col-md-5">
                        <label htmlFor="country" className="form-label">
                          Country
                        </label>
                        <select
                          className="form-select"
                          id="country"
                          required
                          name="country"
                          value={values.country}
                          onChange={handleChange}
                        >
                          <option defaultValue="">Choose...</option>
                          <option>United States</option>
                          <option>Nigeria</option>
                        </select>
                        {errors.country && (
                          <div className="alert alert-danger">
                            {errors.country}
                          </div>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label htmlFor="state" className="form-label">
                          State
                        </label>
                        <select
                          className="form-select"
                          id="state"
                          required
                          name="state"
                          value={values.state}
                          onChange={handleChange}
                        >
                          <option defaultValue="">Choose...</option>
                          <option>Minnesota</option>
                          <option>Iowa</option>
                        </select>
                        {errors.state && (
                          <div className="alert alert-danger">
                            {errors.state}
                          </div>
                        )}
                      </div>

                      <div className="col-md-3">
                        <label htmlFor="zip" className="form-label">
                          Zip
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="zip"
                          name="zip"
                          value={values.zip}
                          onChange={handleChange}
                          placeholder=""
                          required
                        />
                        {errors.zip && (
                          <div className="alert alert-danger">{errors.zip}</div>
                        )}
                      </div>

                      <div className="col-lg-12">
                        <label htmlFor="cardNumber" className="form-label">
                          Credit card number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="XXXX-XXXX-XXXX-XXXX"
                          value={values.cardNumber}
                          onChange={handleChange}

                          //cardnumber format start 

                          onInput={function cardForm() {
                            const cardNum= document.getElementById("cardNumber");
                            let currentVal =cardNum.value

                            function isNumeric (n) {
                              return !isNaN(parseFloat(n)) && isFinite(n)
                              }

                            currentVal = currentVal.replace(/-/g, '')
                            let newVal = ''
                            for (var i = 0, nums = 0; i < currentVal.length; i++) {
                            if (nums != 0 && nums % 4 == 0) {
                            newVal += '-'
                            }
                            newVal += currentVal[i]
                            if (isNumeric(currentVal[i])) {
                            nums++
                            }
                            }

                            cardNum.value = newVal                                  
                      }}

                          //cardnumber format end

                          required
                        />
                        {errors.cardNumber && (
                          <div className="alert alert-danger">
                            {errors.cardNumber}
                          </div>
                        )}
                      </div>
                    </div>
                    <hr className="my-4" />
                    <button
                      className="w-100 btn btn-warning btn-lg"
                      type="submit"
                    >
                      Place Order
                    </button>
                  </form>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  };

  const Confirmation = (props) => {
    return (
      <div className="d-flex flex-column mx-5 p-5 gap-5 justify-content-center">
        <div className="text">
          <button
            type="button"
            className="btn btn-warning"
            id="checkOut"
            onClick={showIndex}
          >
            Continue Shopping
          </button>
        </div>
        <h4 className="mb-3">Thank you for your purchase!</h4>

        <div className="list-group">
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-primary">Your cart</span>
            <span className="badge bg-primary rounded-pill">
              {props.products.reduce((acc, cur) => {
                return acc + cur.quantity;
              }, 0)}
            </span>
          </h4>
          <ul className="list-group mb-3">
            {props.products.map((product, index) => (
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">{product.productName}</h6>
                  <small className="text-body-secondary">
                    {product.quantity}
                  </small>
                </div>
                <span className="text-body-secondary">
                  ${product.quantity * product.price}
                </span>
              </li>
            ))}

            <li className="list-group-item d-flex justify-content-between">
              <h6 className="my-0">Tax (7%)</h6>
              <span className="text-body-secondary">${(0.07 * cartTotal).toFixed(2)}</span>
            </li>

            <li className="list-group-item d-flex justify-content-between">
              <span>Total (USD)</span>
              <strong>${(cartTotal + 0.07 * cartTotal).toFixed(2)}</strong>
            </li>
          </ul>
        </div>

        <h6>
          {props.formData.firstName} {props.formData.lastName}
          <br />
          {props.formData.email}
          <br />
          {props.formData.address}
          <br />
          {props.formData.country}, {props.formData.state} {props.formData.zip}
          <br />
          XXXX-XXXX-XXXX-{props.formData.cardNumber.slice(-4)}
        </h6>
      </div>
    );
  };

  return (
    <div>
      <script src="../assets/dist/js/bootstrap.bundle.min.js"></script>

      <header className="p-3 text-bg-dark">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              <li>
                <button
                  className="nav-link px-2 fw-bold text-white"
                  onClick={showIndex}
                >
                  35 Interior
                </button>
              </li>
            </ul>

            <form
              className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3"
              role="search"
            >
              <input
                type="search"
                className="form-control form-control-dark text-bg-light"
                value={searchPhrase}
                onChange={(e) => setSearchPhrase(e.target.value)}
                placeholder="Search..."
                aria-label="Search"
              />
            </form>

            <div className="text-end">
              <button
                type="button"
                className="btn btn-warning"
                id="checkOut"
                onClick={showCheckout}
              >
                Check Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {showComponent === "index" && <Index />}
      {showComponent === "pagesecond" && (
        <Checkout onShowConfirmation={showConfirmation} products={cart} />
      )}
      {showComponent === "confirmation" && (
        <Confirmation products={cart} formData={formData} />
      )}

      <footer className="text-body-secondary py-5">
        <div className="container">
          <p className="float-end mb-1">
            <a href="#">Back to top</a>
          </p>
          <p className="mb-1">
            This page is designed for com-s 319 Assignment 2!
          </p>
          <p className="mb-0">
            Created by Malayah Powlette, Ian Bussan and Nnamdi Ajiri
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;







