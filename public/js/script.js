$(document).ready(() => {

function getDisciplinesNotTeacher(){

    var teacher_id = $("#teacher_id").val();
    var param = {
        teacher_id: teacher_id
    };

    $('#discipline_id option').remove();

    // второй способ очистки списка
    // $('#discipline_id').empty();

    $.ajax({
        type: "POST",
        url: "/getDisciplinesNotTeacher",
        data: param,
        dataType: "json"
    }).done((data) => {
        for (var i in data) {
            $('#discipline_id').append('<option value='+data[i].id+'>' + data[i].name + '</option>');
            // второй способ добавления элемента 
            // $('#discipline_id').append(`<option value=${data[i].id}>${data[i].name}</option>`);
        }
    });
}

$("#teacher_id").change(() => {
    getDisciplinesNotTeacher();
});
getDisciplinesNotTeacher();
});