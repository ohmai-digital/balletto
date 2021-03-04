function minicart(){
	$("header .mycart > a").click(function(ev){
		ev.preventDefault();
		$(".vtexsc-cart").toggleClass("active");
		$(".cartCheckout").click(function(){
			window.location="/checkout";
		});
	});
}

function wishlist(){

  if($("body").hasClass("product")){
    $(".productContainer__left .wl-add").attr("data-id",skuJson_0.productId);
  }

  var userWlId = "empty";
  var userWishlist = "empty";
  var userMail;

  var settings = {
    "url": "/no-cache/profileSystem/getProfile",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
  };

  $.ajax(settings).done(function (user) {
    if(user.IsUserDefined){
    userMail = user.Email;
    var settings = {
      "url": "/api/dataentities/WL/search?email="+user.Email+"&_fields=id,email,wishlist",
      "method": "GET",
      "timeout": 0,
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
    };

    $.ajax(settings).done(function (userWl) {
      if(userWl.length > 0){
        userWlId = userWl[0].id;
      }
      else{
        if(localStorage.getItem("wlid")){
          userWlId = localStorage.getItem("wlid");
        }
        // else{
        //   console.log("Nada encontrado nem no MD nem no localstorage");
        // }
      }

      $.ajax({
        accept: "application/vnd.vtex.ds.v10+json",
        contentType: "application/json; charset=utf-8",
        crossDomain: !0,
        type: "GET",
        url: "/api/dataentities/WL/documents/"+userWlId+"?_fields=wishlist",
        success: function(b) {
          userWishlist = b.wishlist;
          var wishlistIds = b.wishlist.split("-");

          var sfp = setInterval(function(){
            $(".wl-add:not(.checked)").each(function(){
              $(this).addClass("checked");
              
              var wladdid = $(this).attr("data-id");

              for(var i = 0; i < wishlistIds.length; i++){
                if(wladdid === wishlistIds[i]){
                  $(this).addClass("wl-added");
                }
              }

            });
          },500);

        }
      });

    });
  }
  else{
    userWlId = 'noUser';
  }

  });



  // NA HORA DE ADICIONAR

  $("body").on("click",".wl-add",function(ev){
    if(userWlId === 'empty'){
        var w = {};
        w.email = userMail;
        w.wishlist = "-"+$(this).attr("data-id");

       $.ajax({
        accept: "application/vnd.vtex.ds.v10+json",
        contentType: "application/json; charset=utf-8",
        crossDomain: !0,
        data: JSON.stringify(w),
        type: "PATCH",
        url: "/api/dataentities/WL/documents",
        success: function(b) {
          userWlId = b.DocumentId;
          userWishlist = w.wishlist;
          localStorage.setItem("wlid",b.DocumentId);
        }
      });
    }
    else if(userWlId === 'noUser'){
      alert("Você precisa estar logado para adicionar um produto a sua wishlist.");
    }
    else{
      if($(this).hasClass("wl-added")){

        var idremove = "-"+$(this).attr("data-id");
        var newwl = userWishlist.replace(idremove,"");
        $(this).removeClass("wl-added");

        var w = {};
        w.email = userMail;
        w.wishlist = newwl;

         $.ajax({
          accept: "application/vnd.vtex.ds.v10+json",
          contentType: "application/json; charset=utf-8",
          crossDomain: !0,
          data: JSON.stringify(w),
          type: "PATCH",
          url: "/api/dataentities/WL/documents/"+userWlId,
          success: function(a) {
            userWishlist = w.wishlist;
          }
        });

      }
      else{
        $(this).addClass("wl-added");

        var w = {};
        w.email = userMail;
        w.wishlist = userWishlist + "-"+$(this).attr("data-id");

         $.ajax({
          accept: "application/vnd.vtex.ds.v10+json",
          contentType: "application/json; charset=utf-8",
          crossDomain: !0,
          data: JSON.stringify(w),
          type: "PATCH",
          url: "/api/dataentities/WL/documents/"+userWlId,
          success: function(a) {
            userWishlist = w.wishlist;
          }
        });
      }

    }
  });

}

function shelfWishlist(){
	$(".shelf .addWishlist").click(function(ev){
		ev.preventDefault();
		$(this).addClass("added");
	});
}

function wishlistPage(){
	if($("body").hasClass("wishlist")){
		var userWlId = "empty";
		var userWishlist = "empty";
		var userMail;

		var settings = {
		  "url": "/no-cache/profileSystem/getProfile",
		  "method": "GET",
		  "timeout": 0,
		  "headers": {
		    "Accept": "application/json",
		    "Content-Type": "application/json"
		  },
		};

		$.ajax(settings).done(function (user) {
			console.log("user",user);
			if(user.IsUserDefined === false && localStorage.getItem("wlid").length < 2){
				$(".content > h2").text("Faça login para visualizar a sua wishlist.");
				$("<a href='/login' style='display:block;border: 1px solid #000;float: left;padding: 6px 16px;margin-top: 12px;border-radius: 2px;'>Fazer login</a>").insertAfter(".content > h2");
			}
		  userMail = user.Email;
		  var settings = {
		    "url": "/api/dataentities/WL/search?email="+user.Email+"&_fields=id,email,wishlist",
		    "method": "GET",
		    "timeout": 0,
		    "headers": {
		      "Accept": "application/json",
		      "Content-Type": "application/json"
		    },
		  };

		  $.ajax(settings).done(function (userWl) {
		    if(userWl.length > 0){
		      userWlId = userWl[0].id;
		    }
		    else{
		      if(localStorage.getItem("wlid")){
		        userWlId = localStorage.getItem("wlid");
		      }
		      else{
		        console.log("Nada encontrado nem no MD nem no localstorage");
		      }
		    }

		    $.ajax({
		      accept: "application/vnd.vtex.ds.v10+json",
		      contentType: "application/json; charset=utf-8",
		      crossDomain: !0,
		      type: "GET",
		      url: "/api/dataentities/WL/documents/"+userWlId+"?_fields=wishlist",
		      success: function(b) {
		        userWishlist = b.wishlist;
		        var wishlistIds = b.wishlist.split("-");
		        console.log("wishlist",wishlistIds);
		        for(var i = 0; i < wishlistIds.length; i++){
		        	$.ajax({
		        	  accept: "application/vnd.vtex.ds.v10+json",
		        	  contentType: "application/json; charset=utf-8",
		        	  crossDomain: !0,
		        	  type: "GET",
		        	  url: "/api/catalog_system/pub/products/search/?fq=productId:"+wishlistIds[i],
		        	  success: function(p) {
		        	  	console.log("product",p[0]);

		        	  	let productId = p[0].productId;
		        	  	let productUrl = p[0].link;
		        	  	let productName = p[0].productName;
		        	  	let productImgUrl = p[0].items[0].images[0].imageUrl;
		        	  	let productBestPrice = "";
		        	  	let productInstallmentN = "";
		        	  	let productInstallmentV = "";

		        	  	for(var i = 0; i < p[0].items.length; i++){
		        	  		if(p[0].items[i].sellers[0].commertialOffer.Price !== 0 && p[0].items[i].sellers[0].commertialOffer.AvailableQuantity > 0){
		        	  			//$(a+" .bikiniInfos__item-price").html("R$: "+p[0].items[i].sellers[0].commertialOffer.Price.toFixed(2).replace(".",","));
		        	  			productBestPrice = p[0].items[i].sellers[0].commertialOffer.Price;
		        	  			//productBestPrice = productBestPrice.replace(".",",");
		        	  		
		        	  			var li = (p[0].items[i].sellers[0].commertialOffer.PaymentOptions.installmentOptions[0].installments);

		        	  			productInstallmentN = li[li.length-1].count;
		        	  			productInstallmentV = li[li.length-1].value;

		        	  		}
		        	  	}

		        	  	productBestPrice = productBestPrice.toString().replace(".",",");
		        	  	productInstallmentV = (productInstallmentV/100).toFixed(2).replace(".",",");

		        	  	var idreplace = productImgUrl.split("/ids/")[1].split("/")[0];

		        	  	productImgUrl = productImgUrl.replace(idreplace,idreplace+"-450-450");

		        	  	let product = `<div class="wishlistProduct">
		        	  	<a href="javascript:void(0)" class="wl-remove" data-id="${productId}"></a>
		        	  	<a href="${productUrl}" class="wishlistProduct__link">
		        	  	<img src="${productImgUrl}" />
		        	  	<p class="wishlistProduct__name">${productName}</p>
		        	  	<p class="wishlistProduct__price">R$ ${productBestPrice}</p>
		        	  	<p class="wishlistProduct__instPrice">${productInstallmentN}x de R$ ${productInstallmentV} sem juros</p></a>
		        	  	</div>`;

		        	  	$(product).appendTo(".shelfWishlist");

		        	  }
		        	});
		        }
		      }
		    });

		  });

		});
	}

	$("body").on("click",".wl-remove",function(){

		var userWlId = "empty";
		var userWishlist = "empty";
		var userMail;

		$(this).parents(".wishlistProduct").remove();

		var idremove = "-"+$(this).attr("data-id");

		var settings = {
		  "url": "/no-cache/profileSystem/getProfile",
		  "method": "GET",
		  "timeout": 0,
		  "headers": {
		    "Accept": "application/json",
		    "Content-Type": "application/json"
		  },
		};

		$.ajax(settings).done(function (user) {
		  userMail = user.Email;
		  var settings = {
		    "url": "/api/dataentities/WL/search?email="+user.Email+"&_fields=id,email,wishlist",
		    "method": "GET",
		    "timeout": 0,
		    "headers": {
		      "Accept": "application/json",
		      "Content-Type": "application/json"
		    },
		  };

		  $.ajax(settings).done(function (userWl) {
		    if(userWl.length > 0){
		      userWlId = userWl[0].id;
		    }
		    else{
		      if(localStorage.getItem("wlid")){
		        userWlId = localStorage.getItem("wlid");
		      }
		      else{
		        console.log("Nada encontrado nem no MD nem no localstorage");
		      }
		    }

		    $.ajax({
		      accept: "application/vnd.vtex.ds.v10+json",
		      contentType: "application/json; charset=utf-8",
		      crossDomain: !0,
		      type: "GET",
		      url: "/api/dataentities/WL/documents/"+userWlId+"?_fields=wishlist",
		      success: function(b) {
		        userWishlist = b.wishlist;
		        var newwl = userWishlist.replace(idremove,"");
		        $(this).removeClass("wl-added");

		        var w = {};
		        w.email = userMail;
		        w.wishlist = newwl;

		         $.ajax({
		          accept: "application/vnd.vtex.ds.v10+json",
		          contentType: "application/json; charset=utf-8",
		          crossDomain: !0,
		          data: JSON.stringify(w),
		          type: "PATCH",
		          url: "/api/dataentities/WL/documents/"+userWlId,
		          success: function(a) {
		            userWishlist = newwl;
		          }
		        });

		      }
		    });
		  });
		});


		

		//  $.ajax({
		//   accept: "application/vnd.vtex.ds.v10+json",
		//   contentType: "application/json; charset=utf-8",
		//   crossDomain: !0,
		//   data: JSON.stringify(w),
		//   type: "PATCH",
		//   url: "/api/dataentities/WL/documents/"+userWlId,
		//   success: function(a) {
		//     userWishlist = w.wishlist;
		//   }
		// });

	});
	
}

$(document).ready(function(){
	minicart();
	wishlist();
	shelfWishlist();
	wishlistPage();
});