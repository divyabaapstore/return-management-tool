/* ================= LOGIN ================= */

const USERNAME = "admin";
const PASSWORD = "Divya@2026";

function login() {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();

    if (
        username === USERNAME &&
        password === PASSWORD
    ) {

        document.getElementById("loginPage")
            .style.display = "none";

        document.getElementById("dashboard")
            .style.display = "block";

        loadCSV();
    }
    else {

        document.getElementById("loginError")
            .innerHTML =
            "Invalid Username or Password";
    }
}

/* ================= VARIABLES ================= */

let products = [];
let filteredProducts = [];

let currentPage = 1;

const rowsPerPage = 10;

/* ================= LOAD CSV ================= */

function loadCSV() {

    Papa.parse("products.csv", {

        download: true,

        header: true,

        skipEmptyLines: true,

        complete: function(results) {

            products = results.data;

            filteredProducts = [...products];

            populateFilters();

            updateSummary();

            displayTable();
        }
    });
}

/* ================= FILTER DROPDOWNS ================= */

function populateFilters() {

    const categoryFilter =
        document.getElementById("categoryFilter");

    const vendorFilter =
        document.getElementById("vendorFilter");

    const categories =
        [...new Set(
            products.map(
                p => p["Category"]
            ).filter(Boolean)
        )];

    const vendors =
        [...new Set(
            products.map(
                p => p["Vendor"]
            ).filter(Boolean)
        )];

    categories.sort();

    vendors.sort();

    categories.forEach(category => {

        categoryFilter.innerHTML +=
            `<option value="${category}">
                ${category}
            </option>`;
    });

    vendors.forEach(vendor => {

        vendorFilter.innerHTML +=
            `<option value="${vendor}">
                ${vendor}
            </option>`;
    });
}

/* ================= FILTERS ================= */

function applyFilters() {

    const category =
        document.getElementById("categoryFilter")
        .value
        .trim();

    const sku =
        document.getElementById("skuSearch")
        .value
        .toLowerCase()
        .trim();

    const vendorSku =
        document.getElementById("vendorSkuSearch")
        .value
        .toLowerCase()
        .trim();

    const vendor =
        document.getElementById("vendorFilter")
        .value
        .trim();

    const stock =
        document.getElementById("stockFilter")
        .value
        .trim();

    filteredProducts = products.filter(product => {

        const categoryMatch =
            category === "" ||
            product["Category"] === category;

        const skuMatch =
            sku === "" ||
            (product["BAAP SKU"] || "")
            .toLowerCase()
            .includes(sku);

        const vendorSkuMatch =
            vendorSku === "" ||
            (product["Vendor SKU"] || "")
            .toLowerCase()
            .includes(vendorSku);

        const vendorMatch =
            vendor === "" ||
            product["Vendor"] === vendor;

        let stockMatch = true;

        if(stock === "In Stock"){
            stockMatch =
                Number(product["Quantity"]) > 0;
        }

        if(stock === "Out Of Stock"){
            stockMatch =
                Number(product["Quantity"]) <= 0;
        }

        return (
            categoryMatch &&
            skuMatch &&
            vendorSkuMatch &&
            vendorMatch &&
            stockMatch
        );

    });

    currentPage = 1;

    updateSummary();

    displayTable();
}

/* ================= SUMMARY ================= */

function updateSummary() {

    document.getElementById("totalSku").innerText =
        filteredProducts.length;

    document.getElementById("instockSku").innerText =
        filteredProducts.filter(
            product =>
                Number(product["Quantity"]) > 0
        ).length;

    document.getElementById("outstockSku").innerText =
        filteredProducts.filter(
            product =>
                Number(product["Quantity"]) <= 0
        ).length;
}

/* ================= TABLE ================= */

function displayTable() {

    const tableBody =
        document.getElementById("tableBody");

    tableBody.innerHTML = "";

    const start =
        (currentPage - 1) *
        rowsPerPage;

    const end =
        start +
        rowsPerPage;

    const rows =
        filteredProducts.slice(
            start,
            end
        );

    rows.forEach(product => {

        tableBody.innerHTML += `
        <tr>

            <td>${product["Date"] || ""}</td>

            <td>${product["Product ID"] || ""}</td>

            <td>
                <img
                    src="${product["Image"] || ""}"
                    onerror="this.src='https://via.placeholder.com/70?text=No+Image'"
                >
            </td>
            <td>${product["Category"] || ""}</td>
 <td>${product["Quantity"] || 0}</td>
            <td>${product["BAAP SKU"] || ""}</td>

            <td>${product["Vendor SKU"] || ""}</td>

           
  <td>${product["Vendor"] || ""}</td>

            <td>${product["Vendor ID"] || ""}</td>
              <td>${product["Vendor Price"] || 0}</td>

            <td>${product["Wholesale Price"] || 0}</td>

         

            <td>${product["MRP"] || 0}</td>

          

            
 <td>${product["Name"] || ""}</td>
        </tr>
        `;
    });

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredProducts.length /
                rowsPerPage
            )
        );

    document.getElementById("pageInfo")
        .innerHTML =
        `Page ${currentPage} of ${totalPages}`;
}

/* ================= PAGINATION ================= */

function nextPage() {

    const totalPages =
        Math.ceil(
            filteredProducts.length /
            rowsPerPage
        );

    if(currentPage < totalPages){

        currentPage++;

        displayTable();
    }
}

function previousPage() {

    if(currentPage > 1){

        currentPage--;

        displayTable();
    }
}

/* ================= EXPORT CSV ================= */

function exportCSV() {

    if(filteredProducts.length === 0){

        alert(
            "No records found."
        );

        return;
    }

    const headers =
        Object.keys(
            filteredProducts[0]
        );

    let csvContent =
        headers.join(",") +
        "\n";

    filteredProducts.forEach(row => {

        const values =
            headers.map(
                header =>
                    `"${row[header] || ""}"`
            );

        csvContent +=
            values.join(",") +
            "\n";
    });

    const blob =
        new Blob(
            [csvContent],
            {
                type:
                "text/csv;charset=utf-8;"
            }
        );

    const link =
        document.createElement("a");

    const url =
        URL.createObjectURL(blob);

    link.href = url;

    link.download =
        "filtered_products.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}

/* ================= AUTO FILTER ================= */

document
.getElementById("categoryFilter")
.addEventListener(
    "change",
    applyFilters
);

document
.getElementById("vendorFilter")
.addEventListener(
    "change",
    applyFilters
);

document
.getElementById("stockFilter")
.addEventListener(
    "change",
    applyFilters
);

document
.getElementById("skuSearch")
.addEventListener(
    "keyup",
    applyFilters
);

document
.getElementById("vendorSkuSearch")
.addEventListener(
    "keyup",
    applyFilters
);
