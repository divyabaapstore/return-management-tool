let products = [];
let filteredProducts = [];
let currentPage = 1;
const rowsPerPage = 10;

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

function populateFilters() {

    const categoryFilter = document.getElementById("categoryFilter");
    const vendorFilter = document.getElementById("vendorFilter");

    const categories = [...new Set(
        products.map(p => p["Category"]).filter(Boolean)
    )];

    const vendors = [...new Set(
        products.map(p => p["Vendor"]).filter(Boolean)
    )];

    categories.sort();
    vendors.sort();

    categories.forEach(category => {
        categoryFilter.innerHTML +=
            `<option value="${category}">${category}</option>`;
    });

    vendors.forEach(vendor => {
        vendorFilter.innerHTML +=
            `<option value="${vendor}">${vendor}</option>`;
    });
}

function updateSummary() {

    document.getElementById("totalSku").innerText =
        products.length;

    document.getElementById("instockSku").innerText =
        products.filter(
            p => Number(p["Quantity"]) > 0
        ).length;

    document.getElementById("outstockSku").innerText =
        products.filter(
            p => Number(p["Quantity"]) <= 0
        ).length;
}

function applyFilters() {

    const category =
        document.getElementById("categoryFilter")
        .value
        .trim();

    const sku =
        document.getElementById("skuSearch")
        .value
        .trim()
        .toLowerCase();

    const vendorSku =
        document.getElementById("vendorSkuSearch")
        .value
        .trim()
        .toLowerCase();

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

    displayTable();
}

function displayTable() {

    const tableBody =
        document.getElementById("tableBody");

    tableBody.innerHTML = "";

    const start =
        (currentPage - 1) * rowsPerPage;

    const end =
        start + rowsPerPage;

    const pageData =
        filteredProducts.slice(start, end);

    pageData.forEach(product => {

        tableBody.innerHTML += `
        <tr>
            <td>${product["Date"] || ""}</td>

            <td>${product["Product ID"] || ""}</td>

            <td>
                <img
                    src="${product["Image"] || ''}"
                    width="70"
                    height="70"
                    style="object-fit:contain"
                    onerror="this.src='https://via.placeholder.com/70?text=No+Image';"
                >
            </td>

            <td>${product["BAAP SKU"] || ""}</td>

            <td>${product["Vendor SKU"] || ""}</td>

            <td>${product["Name"] || ""}</td>

            <td>${product["Quantity"] || 0}</td>

            <td>${product["Wholesale Price"] || 0}</td>

            <td>${product["Vendor Price"] || 0}</td>

            <td>${product["MRP"] || 0}</td>

            <td>${product["Vendor"] || ""}</td>

            <td>${product["Vendor ID"] || ""}</td>

            <td>${product["Category"] || ""}</td>
        </tr>
        `;
    });

    const totalPages =
        Math.ceil(filteredProducts.length / rowsPerPage);

    document.getElementById("pageInfo").innerHTML =
        `Page ${currentPage} of ${totalPages}`;
}

function nextPage() {

    const totalPages =
        Math.ceil(filteredProducts.length / rowsPerPage);

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

document.getElementById("categoryFilter")
.addEventListener("change", applyFilters);

document.getElementById("vendorFilter")
.addEventListener("change", applyFilters);

document.getElementById("stockFilter")
.addEventListener("change", applyFilters);

document.getElementById("skuSearch")
.addEventListener("keyup", applyFilters);

document.getElementById("vendorSkuSearch")
.addEventListener("keyup", applyFilters);