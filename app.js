const bannerTitle = document.querySelector('.banner-title');


class UI{

    titleTextFormat(){
        let text = bannerTitle.innerText;
        let index = 5;
        setInterval(() => {
            bannerTitle.innerHTML = text.slice(0, index);
        index++;
        if(index > text.length){
            index = 12;
        }
        }, 300);
    }
    

}

document.addEventListener('DOMContentLoaded', ()=>{
    const ui = new UI();
    // ui.titleTextFormat();
})