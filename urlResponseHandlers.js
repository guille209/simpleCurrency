
var url = require("url");
var http = require("http");
var cradle = require('cradle');
var sendgrid  = require('sendgrid')("app20647913@heroku.com", "desarrollo", {api: 'smtp'});


var connection = new(cradle.Connection)('https://simplecurrency.iriscouch.com', 443, {
      auth: { username: 'admin', password: 'enpresadigitala' }
  });
var db = connection.database('simplecurrency_conversions');
var res;


var srcQuantity="";
var destQuantity="";
var srcCurrency="";
var destCurrency="";

db.exists(function (err, exists) {
	if (err) {
		console.log('error', err);
	} else if (exists) {
		console.log('DB exists..');
	} else {
		console.log('database does not exists..');
		db.create();
		/* populate design documents */
	}
});

function iniciar(request,response) {
  console.log("Manipulador de petición 'iniciar' ha sido llamado.");
}


function pedirListaConversiones(request,response){

	db.view('latestConversions/bydate', {descending: true, limit: 3 }, function (err, res) {
			var respuesta="";
		if (res) {
			res.forEach(function (row) {
				respuesta += row +"?";
			});
			response.write(respuesta);
			response.end();
			
		}
	});


}

function pedirNumeroConversiones(request,response){
var numeroConversiones = 0;
db.view('latestConversions/all', {descending: true}, function (err, res) {
		if (res) {
			res.forEach(function (row) {
				numeroConversiones++; 
			});
			numeroConversiones = numeroConversiones +"";
			response.write(numeroConversiones);
			response.end();
			
		}
	});


}

function sendEmail(request,response){
console.log("Handler email");
res = response;
var _url = url.parse(request.url, true);
var bodyContent = _url.query.mail;




sendgrid.send({
  to:       'Guillermo <gguillemiranda@gmail.com>',
  from:     'Simple Currency Server <SimpleCurrencyConverterMail@gmail.com>',
  subject:  'SimpleCurrency App new Rate!!',
  text:     bodyContent
}, function(err, json) {
  if (err) { 
	res.write("error");
	   res.end();
  
  }else{
  
   res.write("ok");
	   res.end();
  }
  console.log(json);
});
}


/*function convertEuroToDollar(request,response){
console.log("Handler euro2dollar");
res = response;
//Obtengo la url del objeto request y de la url coge el valor del atributo num como he indicado en el cliente
var _url = url.parse(request.url, true);
srcQuantity = _url.query.num;

var result="";

solicitarWebServiceCambio("EUR","USD");
}
*/
function convertQuantity(request,response){
//request.session.srcQuantity = _url.query.num;
//request.session.response = response;


console.log("handler convertQuantity");
res = response;
var _url = url.parse(request.url, true);
srcQuantity = _url.query.num;
srcCurrency = _url.query.src;
destCurrency = _url.query.dest;
console.log("Solicito cambio para "+srcQuantity+" "+srcCurrency+" a "+destCurrency); 
solicitarWebServiceCambio();
}


 
/*
function convertDollarToEuro(request,response){
console.log("handler dollar2euro");
res = response;
//Obtengo la url del objeto request y de la url coge el valor del atributo num como he indicado en el cliente
var _url = url.parse(request.url, true);
srcQuantity = _url.query.num;

solicitarWebServiceCambio("USD","EUR");
}
*/

function solicitarWebServiceCambio(){

if(srcQuantity!="."){
var options = {
  hostname: 'www.webservicex.net',
  port: 80,
  path: '/currencyconvertor.asmx/ConversionRate?FromCurrency='+srcCurrency+'&ToCurrency='+destCurrency+'',
  method: 'GET'
};
var cambio;
var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  //console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
 
  res.on('data', function (chunk) {
   //console.log('BODY: ' + chunk);
	devolverCambio(chunk);
  });

});
//Si tarda mucho la conversion mediante el service web se realiza local
 /*req.setTimeout(1000, function(){
		conversionLocal(monedaOrig,monedaDest);
});*/

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
req.end();
}
}

function conversionLocal(monedaOrig,monedaDest){
var resultado;
if(monedaOrig=="EUR"){
resultado = srcQuantity * 1.346;
}else{

resultado = srcQuantity * 0.742;

}
resultado= resultado+"";
resultadoFinal = resultado.substring(0,5);
resultadoFinal = resultadoFinal +"";

res.write(resultadoFinal);
res.end();
console.log("Conversion local de "+srcQuantity+" a "+resultadoFinal);

}

function devolverCambio(chunk){
var cambio="";
var contador = 0;
for (var i = 0; i< chunk.length; i++) {
         var caracter = chunk.charAt(i);
         if( !isNaN(caracter)||caracter==".") {
		 contador++;
			if(contador >=12){
			cambio= cambio+caracter;
			}
            
          }  else {
            
          }
    }
destQuantity = srcQuantity * cambio;
	//Escribo el resultado final
//res.writeHead(200, {"Content-Type": "text/html"});
console.log("Respuesta recibida para "+srcQuantity+" "+srcCurrency+" a "+destQuantity+" "+destCurrency);

destQuantity = destQuantity+"";
//Recorremos el resultado, si tiene mas de 3 decimales acortamos
for (var i=0; i<destQuantity.length; i++)
{
	if(destQuantity[i] == "."){
		destQuantity = destQuantity.substring(0,i+4);
	break;
	}


}
console.log("Guardamos en la BD"+srcQuantity+" "+srcCurrency+" a "+destQuantity+" "+destCurrency);

save2DB();
res.write(destQuantity);
res.end();
console.log("***Response sent: "+srcQuantity+" TO "+ destQuantity);

}

function save2DB() {
	var date = new Date();
	var ts = Math.round(date.getTime() / 1000) + date.getTimezoneOffset() * 60;
	var idConversion = "conversion" + String(ts);
	db.save(idConversion, {
		'srcCurrency': srcCurrency,
		'srcQuantity': srcQuantity,
		'destCurrency': destCurrency,
		'destQuantity': destQuantity,
		'timestamp': ts
		}, function (err, res) {
		if (err) {
		  // Handle error
		  console.log("Not saved in db");
		} else {
		  // Handle success
		  console.log("Saved in db");
		}
	});
}

exports.iniciar = iniciar;
exports.convertQuantity = convertQuantity;
exports.pedirListaConversiones = pedirListaConversiones;
exports.pedirNumeroConversiones = pedirNumeroConversiones;
exports.sendEmail = sendEmail;