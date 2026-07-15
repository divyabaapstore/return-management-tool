let products=[];
let filteredProducts=[];
let currentPage=1;
const rowsPerPage=10;

Papa.parse("products.csv",{
    download:true,
    header:true,
    complete:function(results){
        products=results.data;
        filteredProducts=products;

        updateSummary();
        populateFilters();
        displayTable();
    }
});

function updateSummary(){

    document.getElementById("totalSku").innerText=products.length;

    document.getElementById("instockSku").innerText=
        products.filter(p=>Number(p.Quantity)>0).length;

    document.getElementById("outstockSku").innerText=
        products.filter(p=>Number(p.Quantity)<=0).length;
}

function populateFilters(){

    const categories=[...new Set(products.map(p=>p.Category))];
    const vendors=[...new Set(products.map(p=>p.Vendor))];

    categories.forEach(c=>{
        if(c){
            categoryFilter.innerHTML+=`<option>${c}</option>`;
        }
    });

    vendors.forEach(v=>{
        if(v){
            vendorFilter.innerHTML+=`<option>${v}</option>`;
        }
    });
}

function applyFilters(){

    const sku=document.getElementById("skuSearch").value.toLowerCase();
    const vendorSku=document.getElementById("vendorSkuSearch").value.toLowerCase();
    const vendor=document.getElementById("vendorFilter").value;
    const category=document.getElementById("categoryFilter").value;
    const stock=document.getElementById("stockFilter").value;

    filteredProducts=products.filter(p=>{

        return (!sku || p["BAAP SKU"].toLowerCase().includes(sku))
        && (!vendorSku || p["Vendor SKU"].toLowerCase().includes(vendorSku))
        && (!vendor || p.Vendor===vendor)
        && (!category || p.Category===category)
        && (!stock ||
            (stock==="In Stock" && Number(p.Quantity)>0) ||
            (stock==="Out Of Stock" && Number(p.Quantity)<=0));
    });

    currentPage=1;
    displayTable();
}

function displayTable(){

    const start=(currentPage-1)*rowsPerPage;
    const end=start+rowsPerPage;

    const rows=filteredProducts.slice(start,end);

    let html="";

    rows.forEach(p=>{

        html+=`
        <tr>
            <td>${p.Date}</td>
            <td>${p["Product ID"]}</td>
            <td><img src="${p.Image}"></td>
            <td>${p["BAAP SKU"]}</td>
            <td>${p["Vendor SKU"]}</td>
            <td>${p.Name}</td>
            <td>${p.Quantity}</td>
            <td>${p["Wholesale Price"]}</td>
            <td>${p["Vendor Price"]}</td>
            <td>${p.MRP}</td>
            <td>${p.Vendor}</td>
            <td>${p["Vendor ID"]}</td>
            <td>${p.Category}</td>
        </tr>`;
    });

    document.getElementById("tableBody").innerHTML=html;

    document.getElementById("pageInfo").innerText=
        `Page ${currentPage} of ${Math.ceil(filteredProducts.length/rowsPerPage)}`;
}

function nextPage(){

    if(currentPage<Math.ceil(filteredProducts.length/rowsPerPage)){
        currentPage++;
        displayTable();
    }
}

function previousPage(){

    if(currentPage>1){
        currentPage--;
        displayTable();
    }
}