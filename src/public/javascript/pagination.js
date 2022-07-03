const paginations = document.querySelectorAll(".pagination")
const curPageUserProduct = localStorage.getItem("curPageUserProduct") || "1"
const curPageAllProduct = localStorage.getItem("curPageAllProduct") || "1"
const addFunctionalitiesToPaginations = () => {
    paginations.forEach((pagination) => {
          addFunctionalitiesToPageItems(pagination);
        });
}
   
const addFunctionalitiesToPageItems = (pagination) => {
    const pageItems = pagination.querySelectorAll(".page-link");
    if (window.location.href.indexOf("page") === -1)
    {
        pageItems[0].classList.add("active")
    }
    else if (window.location.href.includes("users")) {
        pageItems[Number(curPageUserProduct)-1].classList.add("active")
    } else {
        pageItems[Number(curPageAllProduct)-1].classList.add("active")
    }
    pageItems.forEach((pageItem) => {
        addFunctionalitiesToPageItem(pageItem)
    })
}

const addFunctionalitiesToPageItem = (pageItem, curPage) => {
    pageItem.addEventListener("click", function (e) {
        let pageNumber = e.target.innerText
        if (window.location.href.includes("users")) {
            localStorage.setItem("curPageUserProduct", pageNumber)
        } else {
            localStorage.setItem("curPageAllProduct", pageNumber)
        }
        updatePage(pageNumber)
    })
}

const updatePage = async (pageNumber) => {
    const query = new URL(window.location.href);
    query.searchParams.set('page', pageNumber);
    try {
            await sendRequest(query, {
            method: "GET",
        });
    
        redirect(query);
      } catch {
        console.log("error")
      }
};


addFunctionalitiesToPaginations()