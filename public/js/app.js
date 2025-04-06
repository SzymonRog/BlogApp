
let onClickForm = false;
let onClickEdit = false;
let onClickDel = false;
let editable = false;

function isEditable(){
    if(window.location.pathname == "/blog"){
        $('#edit-btn').fadeIn(200);
        $('#del-btn').fadeIn(200);
    } else{
        $('.btn#edit-btn').fadeOut(200);
        $('.btn#del-btn').fadeOut(200);
    }
}
function isFormVis(){
    onClickForm = !onClickForm
    if(!onClickForm){
        $("#myForm").fadeOut(200);
        $(".overlay").fadeOut(200);
    } else {
        $("#myForm").fadeIn(200);
        $(".overlay").fadeIn(200);
    }
}
function isEditFormVis(){
    onClickEdit = !onClickEdit
    if(!onClickEdit){
        $("#edit-popup").fadeOut(200);
        $(".overlay").fadeOut(200);
    } else {
        $("#edit-popup").fadeIn(200);
        $(".overlay").fadeIn(200);
    }
}
function isDelVis(){
    onClickDel = !onClickDel
    if(!onClickDel){
        $("#del-popup").fadeOut(200);
        $(".overlay").fadeOut(200);
    } else {
        $("#del-popup").fadeIn(200);
        $(".overlay").fadeIn(200);
    }
}
$("#add-btn").click(isFormVis);
$("#edit-btn").click(isEditFormVis);
$('.btn').on('submit',isFormVis);
$('.blog-container').on('click',function(){
    let divId = this.id;
    console.log(divId)
    window.location.href = `http://localhost:3000/blog?id=${divId}`;
    $('.btn#edit-btn').css("display","block");
    $('.btn#del-btn').css("display","block");
});

$('.btn').on("click", isEditable());
$('#del-btn').on("click",isDelVis);

    

    
 
