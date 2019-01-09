function jumpClick() {
    var textvalue = $("input[class='form-control']").val();
    var model_name = $("input[name='hot']:checked").val();
    $("#show_summary").html("");
    if (textvalue) {
        $(".spinner").show();
        $.ajax({
            async: true,
            url: "http://10.141.221.87:8001/kgsummary/Summary/",
            type: "post",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "query": textvalue,
                "top_class_num": 20,
                "top_sentence_num": 40,
                "model_name": model_name
            }),
            error: function (xhr, status, errorThrown) {
                console.log("Error " + errorThrown);
                console.log("Status: " + status);
                console.log(xhr)
            },
            success: function (d) {
                $(".spinner").css('display', 'none');
                console.log("data", d)
                if (d == "exception") {
                    alert("search failed")
                } else {
                    if (d.length == 0) {
                        alert("warning", "Can't find related sentence!")
                    } else {
                        $("#show_summary_script").tmpl(d).appendTo("#show_summary");
                    }
                }
            }
        });
    } else {
        alert("empty input");
    }
}


function keyup_submit(e) {
    var evt = window.event || e;
    if (evt.keyCode == 13) {
        jumpClick();
    }
}
