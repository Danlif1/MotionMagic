function display_pic(pic){
    if(pic==="https://images-na.ssl-images-amazon.com/images/I/51e6kpkyuIL._AC_SX466_.jpg" || !pic){
        return pic;
    } else {
        return `data:image/jpeg;charset=utf-8;base64,${pic}`
    }
}

export default display_pic;