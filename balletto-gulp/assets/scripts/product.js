function editInfosBT(){
	var priceA = parseFloat($(".skuBestPrice:eq(0)").text().replace(".","").replace("R$ ",""));
	var priceB = parseFloat($(".pbiB.showing strong").text().replace("R$ ",""));
	var totalPrice = priceA + priceB;
	$(".productBuytogether__totalizers strong").html("R$ "+totalPrice.toFixed(2).replace(".",","));
}

function buyTogether(){

	var itemA = `
	<div class="pbiA">
		<img src="${$("#image-main").attr("src")}" />
		<p class="pbiA__name">${$(".productName:eq(0)").text()}</p>
		<span class="pbiA__skus"></span>
		<strong class="pbiA__price">${$(".skuBestPrice:eq(0)").text()}</strong>
	</div>
	`;

	$(itemA).appendTo(".productBuytogether__item1");

	for(var m = 0; m < skuJson_0.skus.length; m++){
		if(skuJson_0.skus[m].available === true){
			var aSku = `<span data-sku="${skuJson_0.skus[m].sku}">${skuJson_0.skus[m].values[1]}</span>`;
			$(aSku).appendTo(".pbiA__skus");
		}
	}

	var settings = {
	  "url": "/api/catalog_system/pub/products/crossselling/similars/"+skuJson.productId,
	  "method": "GET",
	  "timeout": 0,
	  "headers": {
	    "Content-Type": "application/json"
	  },
	};
	$.ajax(settings).done(function (similars) {

		if(similars.length > 0){
			$(".productBuytogether").removeAttr("style");
		}

		for(var i = 0; i < similars.length; i++){

			for(var j = 0; j < similars[i].items.length; j++){
				if(similars[i].items[j].sellers[0].commertialOffer.AvailableQuantity > 0){

					var itemB = `
					<div class="pbiB" data-productId="${similars[i].productId}">
						<a href="${similars[i].link}"><img src="${similars[i].items[0].images[0].imageUrl}" />
						<p class="pbiB__name">${similars[i].productName}</p></a>
						<div class="pbiB__skus"></div>
						<strong class="pbiB__price">R$ ${similars[i].items[j].sellers[0].commertialOffer.ListPrice.toFixed(2).replace(".",",")}</strong>
					</div>`;
					$(itemB).appendTo(".productBuytogether__item2");

					if($(".productBuytogether__totalizers strong").html() == ""){
						var priceA = parseFloat($(".skuBestPrice:eq(0)").text().replace(".","").replace("R$ ",""));
						var priceB = parseFloat(similars[i].items[j].sellers[0].commertialOffer.ListPrice.toFixed(2).replace(".",","));
						
						var totalPrice = priceA + priceB;
						$(".productBuytogether__totalizers strong").html("R$ "+totalPrice.toFixed(2).replace(".",","));

					}

				}

				if($(".pbiB.showing").length == 0){
					$(".pbiB:eq(0)").addClass("showing");
					var linkBt = 1;
				}

			}
		}

	});

	var setBSkus = setInterval(function(){

		for(var p = 0; p < $(".pbiB").length; p++){
			if(!$(".pbiB:eq("+p+")").hasClass("sc")){
				$(".pbiB:eq("+p+")").addClass("sc");
				var settings2 = {
				  "url": "/api/catalog_system/pub/products/search?fq=productId:"+$(".pbiB:eq("+p+")").attr("data-productId"),
				  "method": "GET",
				  "timeout": 0,
				  "headers": {
				    "Content-Type": "application/json"
				  },
				};
				$.ajax(settings2).done(function (product) {
					var bSkus = "";
					for(var n = 0; n < product[0].items.length; n++){
						if(product[0].items[n].sellers[0].commertialOffer.AvailableQuantity > 0){
							bSkus += `<span data-sku="${product[0].items[n].itemId}">${product[0].items[n].TAMANHO}</span>`;
						}
						if(n === product[0].items.length - 1){
							$(".pbiB[data-productId='"+product[0].productId+"'] .pbiB__skus").html(bSkus);
						}
					}

				});
			}	
		}

	},500);

	$(".productBuytogether__item2--toPrev").addClass("disabled");

	$("body").on("click",".productBuytogether__item2--toPrev",function(){
		var limit = $(".pbiB:eq(0)").index();
		$(".productBuytogether__item2--toNext").removeClass("disabled");	
    if(!$(this).hasClass("disabled")){
    	$(".pbiB.showing").prev(".pbiB").addClass("showing");
    	$(".pbiB.showing:last").removeClass("showing");
    	if($(".pbiB.showing").index() === limit){
    		$(".productBuytogether__item2--toPrev").addClass("disabled");	
    	}

    	editInfosBT();

    }
	});

	$("body").on("click",".productBuytogether__item2--toNext",function(){
			var limit = $(".pbiB:eq(0)").index() + $(".pbiB").length - 1;
			$(".productBuytogether__item2--toPrev").removeClass("disabled");	
	    if(!$(this).hasClass("disabled")){
      	$(".pbiB.showing").next(".pbiB").addClass("showing");
      	$(".pbiB.showing:first").removeClass("showing");
      	if($(".pbiB.showing").index() === limit){
      		$(".productBuytogether__item2--toNext").addClass("disabled");	
      	}

      	editInfosBT();

	    }
	});

	$("body").on("click",".pbiA__skus > span,.pbiB__skus > span",function(){
		$(this).parents(".pbiA__skus,.pbiB__skus").find("span").removeClass("active");
		$(this).addClass("active");
	});

	$("body").on("click",".productBuytogether__totalizers > a",function(){

	if($(".pbiA__skus span.active").length > 0 && $(".pbiB__skus span.active").length > 0){
		var itemASku = $(".pbiA__skus span.active").attr("data-sku");
		var itemBSku = $(".pbiB__skus span.active").attr("data-sku");

		var cartUrl = `/checkout/cart/add?sku=${itemASku}&sku=${itemBSku}&qty=1&qty=1&seller=1&seller=1`;
		window.location=cartUrl;

	}
	else{
		alert("Selecione os tamanhos desejados!");
	}


	});

}

$(document).ready(function(){

	buyTogether();

});