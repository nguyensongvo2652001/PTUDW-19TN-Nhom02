const paginations = document.querySelectorAll(".pagination")


const addFunctionalitiesToPaginations = () => {
    console.log("hello1")
    paginations.forEach((pagination) => {
          addFunctionalitiesToPageItem(pagination);
        });
}
   
const addFunctionalitiesToPageItems = (pagination) => {
    console.log("hello2")
    const pageItems = pagination.querySelectorAll("page-item");
    pageItems.forEach((pageItem) => {
        addFunctionalitiesToPageItem(pageItem)
    })
}

const addFunctionalitiesToPageItem = (pageItem) => {
    console.log("hello3")
    pageItem.addEventListener("click", function (e)  {
        const pageLink  = e.target.querySelector("page-link")
        const pageNumber = pageLink.innerText
        updatePage(pageNumber)
    })
}

const updatePage = async (pageNumber) => {
    await sendRequest(window.location.href+"page="+String(pageNumber), {
        method: "GET",
      });
}