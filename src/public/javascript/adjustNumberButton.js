//Number items handle
const plusIcons = document.querySelectorAll(".basic-info__counter-plus")
const minusIcons = document.querySelectorAll(".basic-info__counter-minus")

plusIcons.forEach(function (plusIcon) {
    plusIcon.addEventListener("click", (e) => {
        let numberItem = Number(e.target.parentElement.children[1].value)
        numberItem = numberItem + 1
        e.target.parentElement.children[1].value=String(numberItem)
    })
})

minusIcons.forEach(function (minusIcon) {
    minusIcon.addEventListener("click", (e) => {
        let numberItem = Number(e.target.parentElement.children[1].value)
        if (numberItem > 1)
        {
            numberItem=numberItem-1
        }
        e.target.parentElement.children[1].value=String(numberItem)
    })
})



