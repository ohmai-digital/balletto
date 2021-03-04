function filter(){

	if($("body").hasClass("BLT-catalogo")){
		var filterBtn = `<div class="openFiltersMobile"><i></i> <span>FILTRAR</span></div>`;
		$(filterBtn).insertAfter(".sub:eq(0)");
	}

	var topFilters = `<div class="sidebarMobile">
	<span class="closeFiltersMobile">CANCELAR</span>
	<span class="filtersMobileTitle">FILTRAR</span>
	</div>`;

	$(topFilters).insertBefore(".navigation-tabs");

	$(".sidebar")

	$("body").on("click",".openFiltersMobile",function(){
		$(".sidebar").addClass("active");
		$(".barra-beneficios-topo").hide();
		$("body > main").addClass("showingFilters");
	});

	$("body").on("click",".closeFiltersMobile",function(){
		$(".sidebar").removeClass("active");
		$(".barra-beneficios-topo").show();
		$("body > main").removeClass("showingFilters");
	});

	$(".search-single-navigator h4 > a,.search-single-navigator h5 > a").attr("href","javascript:void(0)");

	$("body").on("click",".search-single-navigator h4,.search-single-navigator h5",function(){
		$(this).next("ul").slideToggle();
	});

}

$(document).ready(function(){
	if(window.location.href.indexOf("newfilter=true") > 0){
		filter();
	}
});