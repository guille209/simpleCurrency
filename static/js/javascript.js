//Para que no mande  a convertir cuando me muevo por el textbox ni haga cosas raras
var anteriorValorBox2;
var anteriorValorBox1;

var monedaBox1="";
var monedaBox2="";

var numeroConversiones = 0;


var language="english";




//Al iniciar el documento cargar el año actual para el copyright
$(document).ready(function (){
	document.getElementById("copyright").innerHTML = obtenerAnyo();
	
	 $('#btnLanguage').popover({
        title: '',
        content: '<img src="flag_spain.png" onClick="cargarIdioma(\'spanish\');" WIDTH=30 HEIGHT=20 />    <img src="english.png" onClick="cargarIdioma(\'english\');" WIDTH=30 HEIGHT=20 />',
		html : true,
        placement: 'bottom'
    });
	
	procesateDropdowns();
	fijarBotonesShare();
	$.fn.snow({ minSize: 5, maxSize: 25, newOn: 2500, flakeColor: '#050505' });
	setInterval(function(){
		pedirNumeroConversiones();
		pedirListaConversiones();
	},2500);
	
	

});




function procesateDropdowns(){
	$('.dropdown-toggle').dropdown();
	
	$("ul[class*=currencyOption] li").click(function(){
		if($(this).attr("class")=="box1"){
			document.getElementById("cur1").innerHTML = $(this).text();
			monedaBox1 = $(this).attr("title");
			anteriorValorBox2="";
			anteriorValorBox1="";
			$("#inputBox1").val("");
			$("#inputBox2").val("");
		}else{
			document.getElementById("cur2").innerHTML = $(this).text();
			monedaBox2 = $(this).attr("title");
			anteriorValorBox2="";
			anteriorValorBox1="";
			$("#inputBox1").val("");
			$("#inputBox2").val("");
		
		}
		$("#euro_box").val("");
		$("#dollar_box").val("");
	
	});
	
	}

function fijarBotonesShare(){

$('#myshare').share({
        networks: ['facebook','twitter'],
        orientation: 'horizontal',
        urlToShare: 'http://www.in1.com',
		//theme: 'square'
    });



}
function cargarIdioma(idioma){

language = idioma;
idioma();

}

function isPositiveInteger(str) {
	var pattern = "0123456789.";
	var i = 0;
	do {
		var pos = 0;
		for (var j=0; j<pattern.length; j++)
			if (str.charAt(i)==pattern.charAt(j)) {
				pos = 1;
				break;
			}
	i++
	} while (pos==1 && i<str.length);
	if (pos==0)
		return false;
	return true;
}
 
 
 
function convertBox1Box2(){		
//alert("monedabox1="+monedaBox1+" monedabox2="+monedaBox2);
	var idField = $("#inputBox1")[0];
	if(idField.value=="")
		$("#inputBox2").val("");
	if (isPositiveInteger(idField.value)&&monedaBox1!=""&&monedaBox2!="") {
		var url = "http://vast-temple-6588.herokuapp.com/convertQuantity?num=" + escape(idField.value) +"&src="+monedaBox1 +"&dest="+ monedaBox2;
		if(anteriorValorBox1 != idField.value){
		$.get(url, { }, function(data){
			//parseMessage("euro_box", data);
			anteriorValorBox1=idField.value;
			anteriorValorBox2=data;
			setMessage("inputBox2",data);
		});
			return true;
		}
		
	} else {
		idField.value = "";
		return false;
			}
 }
 
 function convertBox2Box1(){
 
 var idField = $("#inputBox2")[0];
	if(idField.value=="")
		$("#inputBox1").val("");
	if (isPositiveInteger(idField.value)&&monedaBox1!=""&&monedaBox2!="") {
		var url = "http://vast-temple-6588.herokuapp.com/convertQuantity?num=" + escape(idField.value) +"&src="+monedaBox2 +"&dest="+ monedaBox1;
		if(anteriorValorBox2 != idField.value){
		$.get(url, { }, function(data){
			//parseMessage("euro_box", data);
			anteriorValorBox2=idField.value;
			anteriorValorBox1=data;
			setMessage("inputBox1",data);
		});
			return true;
		}
		
	} else {
		idField.value = "";
		return false;
			}
 
 
 }


function parseMessage(fieldID, data) {
			//alert("$(data).find('message'): " + $(data).find("message"));
	var message = data.getElementsByTagName("message")[0];
	alert("Hola");
			//var message = data("message")[0];
	messageStr = message.childNodes[0].nodeValue;
	if (messageStr.substr(0,5).trim() === "ERROR") {
		setMessage(fieldID, "");
	} else {
		setMessage(fieldID, data);
			}
}
function setMessage(fieldID, message) {
			var responseElement = $("#"+fieldID)[0];
			responseElement.value = message;
		}

		
function pedirListaConversiones(){

var url = "http://vast-temple-6588.herokuapp.com/pedirListaConversiones";
		$.get(url, { }, function(data){
				mostrarUltimasConversiones(data);
		});
			return true;

}	

function mostrarUltimasConversiones(conversiones){
if(conversiones != ""){
	var conversion="";
	$("#conversionList").empty();
	for (var indice=0; indice<conversiones.length; indice++)
	{
		var caracter = conversiones[indice];
		if(caracter != '?'){
			conversion+=caracter;
		}else{
		$("#conversionList").append('<li class="list-group-item">'+conversion+'</li>');
		conversion="";
		}
	}

}else{
	
	$("#conversionList").empty();
	$("#conversionList").append('<li class="list-group-item" id="noConv"></li>');
	idioma();
	}
	

}

function pedirNumeroConversiones(){

	var url = "http://vast-temple-6588.herokuapp.com/pedirNumeroConversiones";
		$.get(url, { }, function(data){
				if(data == 1){
				$('#counterLoad').attr('id','counterOne');
				$('#counterNone').attr('id','counterOne');
				$('#counterTwo').attr('id','counterOne');
				}else
				if(data == 0){
				$('#counterLoad').attr('id','counterNone');
				$('#counterOne').attr('id','counterNone');
				$('#counterTwo').attr('id','counterNone');
				}else{
				if(data>=2){
				$('#counterLoad').attr('id','counterTwo');
				$('#counterNone').attr('id','counterTwo');
				$('#counterOne').attr('id','counterTwo');
				}
				}
		
		idioma(data);
		});
		
			return true;

}	
	
function sendEmail(){

var mailBody=$('textarea').val();
$("textarea").val("");
if(mailBody != ""){
var url = "http://vast-temple-6588.herokuapp.com/sendEmail?mail=" + escape(mailBody);
		$.get(url, { }, function(data){
			//parseMessage("euro_box", data);
			if(data=="ok"){
			$("#successAlert").show(350).delay(2000).fadeOut();
			}else {
			$("#failAlert").show(350).delay(2000).fadeOut();
			}
		});
			return true;
			
  } 

}

function obtenerAnyo(){
var result = new Date().getFullYear();
if(result==2013)
	return "&copy; "+result;
else
	return "&copy;"+result;
}














//MULTILENGUAJE
function idioma(nConversiones){

 
    // Here we set the language
    // we want to display:
 
 
    // In order to get the translations,
    // we must use Ajax to load the XML
    // file and replace the contents
    // of the DIVs that need translating
 
    $.ajax({
 
        // Here, we specify the file that
        // contains our translations
 
        url: 'languages.xml',
 
        // The following code is run when
        // the file is successfully read
 
        success: function(xml) {
            // jQuery will find all <translation>
            // tags and loop through each of them
  
            $(xml).find('translation').each(function(){
 
                // We fetch the id we set in the XML
                // file and set a var 'id'
 
                var id = $(this).attr('id');
 
                // This is the most important step.
                // Based on the language we can set,
                // jQuery will search for a matching
                // tag and return the text inside it
 
                var text = $(this).find(language).text();
 
                // Last, but not least, we set the
                // contents of the DIV with a
                // class name matching the id in the
                // XML file to the text we just
                // fetched
				if(id=="counterTwo")
                $("#" + id).html(nConversiones+text);
				else
				$("#" + id).html(text);
				

				
			});
        }
    });


}