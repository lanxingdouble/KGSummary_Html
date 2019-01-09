function jumpClick(){
    var textvalue = $("input[class='form-control']").val();
    $("#answer").html("");  

    // s = "<tr><th width=15%>" + "class_name" + "</th><th width=25%>"+"method"+"</th><th width=30%>"+"first_sentence"+"</th><th width=30%>"+"api_sentence"+"</th</tr>";
    //                      $("#answer").append(s); 
    //                         s = "<tr><td rowspan="+2+">"+"line.class_name"+"</td><td>"+"line.sentences[0].method"+"</td><td>"+"line.sentences[0].first"+"</td><td>"+"line.sentences[0].text"+"</td></tr>";        
    //                         $("#answer").append(s);
                            

    if(textvalue.length!=''){
        $(".spinner").show();
       $.ajax({
            async: true,                                              
            url: "http://bigcode.fudan.edu.cn/kg/sentenceSemanticSearchTableFinal/",    
            type: "post",                                             
            contentType: "application/json; charset=utf-8",           
            data: JSON.stringify({"query_text":textvalue}),              
            error: function (xhr, status, errorThrown) {              
                console.log("Error " + errorThrown);
                console.log("Status: " + status);
                console.log(xhr)
            },
            success: function(d){
                $(".spinner").css('display','none'); 
                console.log("data",d)
                if(d=="fail"){
                    alert("search failed") 
                }else{
                    if(d.length == 0){
                        alert("warning","Can't find related sentence!")
                    }else{ 
                        s = "<tr><th width=10%>" + "class_name" + "</th><th width=20%>"+"method"+"</th><th width=30%>"+"first_sentence"+"</th><th width=30%>"+"api_sentence"+"</th</tr>";
                         $("#answer").append(s); 
                         console.log(d)
                        d.forEach(function(line,index,d){
                            s = "<tr><td rowspan="+line.sentences.length+">"+line.class_name+"</td><td>"+line.sentences[0].method+"</td><td>"+line.sentences[0].first+"</td><td>"+line.sentences[0].text+"</td></tr>";        
                            $("#answer").append(s);
                            console.log("###  ",line.sentence[0].first);
                            if (line.sentences.length>1){
                                for (var i=1;i<line.sentences.length;i++)
                                {
                                   s="<tr><td>"+line.sentences[i].method+"</td><td>"+line.sentences[i].first+"</td><td>"+line.sentences[i].text+"</td></tr>";
                                $("#answer").append(s);   
                                } 
                            }  
                        })  
                    }
                }
            }                          
        });
    }else{
        alert("empty input");
    }   
}


  
function keyup_submit(e){ 
  var evt = window.event || e; 
    if (evt.keyCode == 13){
     jumpClick();
   }
}
