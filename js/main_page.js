function jumpClick() {
    var textvalue = $("input[class='form-control']").val();
    var model_name = $("input[name='radio_1']:checked").val();
    var summary_way = $("input[name='radio_2']:checked").val();
    $("#show_summary").html("");
    top_sentence_num=5;
    if (summary_way=="fixed_sentence" || summary_way=="sentence_first"){
        top_sentence_num=500;
    }
    if (textvalue) {
        $(".spinner").show();
        $.ajax({
            async: true,
            url: "http://10.141.221.87:8001/kgsummary/Summary/",
            type: "post",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "query": textvalue,
                "top_class_num": 100,
                "top_sentence_num": top_sentence_num,
                "return_summary_num":10,
                "model_name": model_name,
                "what_first": summary_way
            }),
            error: function (xhr, status, errorThrown) {
                console.log("Error " + errorThrown);
                console.log("Status: " + status);
                console.log(xhr)
            },
            success: function (d) {
                $(".spinner").css('display', 'none');
                console.log("data", d);
                if (d == "exception") {
                    alert("search failed")
                } else {
                    if (d.length == 0) {
                        alert("warning", "Can't find result!")
                    } else {
                        d.forEach(function (line, index, d) {

                            s = "<d1><ul><strong>" + line.api_class.entity_retrieval_result.doc_name + ":</strong></ul>";
                            if (line.class_summary_text.length > 0) {
                                s += "<li><dt><span>class_summary:</span></dt><dd>" + line.class_summary_text + "</dd></li>";
                            }
                            if (line.all_methods_summary_text.length > 0) {
                                s += "<li><dt><span>methods_summary:</span></dt>";
                                api_method = line.api_method;
                                api_method_sentence = line.api_method_sentences;
                                api_method_sentence.forEach(function (method_sentence, index_method_sentence, api_method_sentence) {
                                    if (index_method_sentence < 5) {
                                        api_method.forEach(function (method, index_method, api_method) {
                                            if (method.entity_retrieval_result.doc_id == line.sentence_id_2_parent_node_id_map[method_sentence.entity_retrieval_result.doc_id]) {
                                                sentence_type="directive";
                                                if (method_sentence.entity_retrieval_result.sentence_type_code == 1) {
                                                    sentence_type="function";
                                                }
                                                s += "<dd><span><strong>" + get_simple_method_name(method.entity_retrieval_result.doc_name) + ":</strong></span>" +"("+sentence_type+")"+ method_sentence.entity_retrieval_result.doc_name + "</dd>";
                                            }
                                        })
                                    }
                                })
                                s += "</li>";
                            }
                            s += "</d1><hr>";
                            $("#show_summary").append(s);
                        })
                    }
                }
            }
        });
    } else {
        alert("empty input");
    }
}

//从长名字中截取method
function get_simple_method_name(long_name) {
    if (long_name.indexOf("(") != -1) {
        var spilt_result = long_name.split('(');
        var method_pa = spilt_result[1];
        method_pa = "(" + method_pa;
        var method_pre = spilt_result[0].split('.');
        var method = method_pre[method_pre.length - 1] + method_pa;
        return method;
    }
}


function keyup_submit(e) {
    var evt = window.event || e;
    if (evt.keyCode == 13) {
        jumpClick();
    }
}
