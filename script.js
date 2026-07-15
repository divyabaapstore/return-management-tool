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

    const categories = [...new Set(products.map(p => p["Category"]).filter(Boolean))];
    const vendors = [...new Set(products.map(p => p["Vendor"]).filter(Boolean))];

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
        products.filter(p => Number(p["Quantity"]) > 0).length;

    document.getElementById("outstockSku").innerText =
        products.filter(p => Number(p["Quantity"]) <= 0).length;
}

function applyFilters() {

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
        document.getElementById("vendorFilter").value;

    const category =
        document.getElementById("categoryFilter").value;

    const stock =
        document.getElementById("stockFilter").value;

    filteredProducts = products.filter(function(p) {

        const skuMatch =
            !sku ||
            (p["BAAP SKU"] &&
            p["BAAP SKU"].toLowerCase().includes(sku));

        const vendorSkuMatch =
            !vendorSku ||
            (p["Vendor SKU"] &&
            p["Vendor SKU"].toLowerCase().includes(vendorSku));

        const vendorMatch =
            !vendor ||
            p["Vendor"] === vendor;

        const categoryMatch =
            !category ||
            p["Category"] === category;

        const stockMatch =
            !stock ||
            (stock === "In Stock" && Number(p["Quantity"]) > 0) ||
            (stock === "Out Of Stock" && Number(p["Quantity"]) <= 0);

        return (
            skuMatch &&
            vendorSkuMatch &&
            vendorMatch &&
            categoryMatch &&
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

    const rows =
        filteredProducts.slice(start, end);

    rows.forEach(function(p) {

        const row = `
        <tr>

            <td>${p["Date"] || ""}</td>

            <td>${p["Product ID"] || ""}</td>

            <td>
                <img
                    src="${p["Image"] || ''}"
                    width="70"
                    height="70"
                    style="object-fit:contain;"
                    onerror="this.src='https://via.placeholder.com/70?text=No+Image'"
                >
            </td>

            <td>${p["BAAP SKU"] || ""}</td>

            <td>${p["Vendor SKU"] || ""}</td>

            <td>${p["Name"] || ""}</td>

            <td>${p["Quantity"] || 0}</td>

            <td>${p["Wholesale Price"] || 0}</td>

            <td>${p["Vendor Price"] || 0}</td>

            <td>${p["MRP"] || 0}</td>

            <td>${p["Vendor"] || ""}</td>

            <td>${p["Vendor ID"] || ""}</td>

            <td>${p["Category"] || ""}</td>

        </tr>
        `;

        tableBody.innerHTML += row;
    });

    const totalPages =
        Math.ceil(filteredProducts.length / rowsPerPage);

    document.getElementById("pageInfo").innerHTML =
        `Page ${currentPage} of ${totalPages}`;
}

function nextPage() {

    const totalPages =
        Math.ceil(filteredProducts.length / rowsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        displayTable();
    }
}

function previousPage() {

    if (currentPage > 1) {
        currentPage--;
        displayTable();
    }
}