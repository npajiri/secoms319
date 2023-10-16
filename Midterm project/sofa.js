function createCards(data) {
  let mainContainer = document.getElementById("container");
  for (let card of data.products2) {
    let div2 = document.createElement("div");
    div2.className = "col";
    let div3 = document.createElement("div");
    div3.className = "shadow-sm cardText";
    let div4 = document.createElement("img");
    div4.className = "bd-placeholder-img card-img-top";
    div4.src = `${card.src}`;
    let div5 = document.createElement("div");
    div5.className = "cardBody";
    let div6 = document.createElement("strong");
    div6.innerHTML = `${card.productName}`;
    let div7 = document.createElement("p");
    div7.innerHTML = `${card.text}`;
    let div8 = document.createElement("div");
    div8.className = "d-flex justify-content-between align-items-center";
    let div9 = document.createElement("small");
    div9.className = "text-muted";
    div9.innerHTML = `${card.price}`;
    div8.appendChild(div9);
    div5.appendChild(div6);
    div5.appendChild(div7);
    div5.appendChild(div8);
    div3.appendChild(div4);
    div3.appendChild(div5);
    div2.appendChild(div3);
    mainContainer.appendChild(div2);
  }
}

fetch('./products.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    createCards(data);
  })
  .catch(function (err) {
    console.log("error:" + err);
  })
