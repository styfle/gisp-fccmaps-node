var m, interaction, mm = com.modestmaps;
var baselayer = 'mapbox.world-blank-bright';
var borders = 'djohnson.usa_borders';
var activelayer = 'xmgeo.pirate';
var layers = [
        //baselayer,
       //borders,
        activelayer
    ];


wax.tilejson('http://api.tiles.mapbox.com/v2/' + layers + '.jsonp', function(tilejson) {
        tilejson.minzoom = 3;
        tilejson.maxzoom = 5;
        b = new mm.Map('map', new wax.mm.connector(tilejson), null, null);
        m = new mm.Map('map', new wax.mm.connector(tilejson), null, [
            new mm.MouseHandler(),
            new mm.TouchHandler()
            ]
    );
        m.setCenterZoom(new mm.Location(38,-76), 4);
        tilejson.attribution = 'Maps made with open source <a href="http://tilemill.com" target="_blank"> TileMill</a>.  ' +
        					' Data from <a href="http://www.fcc.gov">FCC</a>.';

        myTooltip = new wax.tooltip;
        myTooltip.getTooltip = function(feature, context) {
        		
            return $('#tooltips').html('<div class="inner">' + showTableContent(feature) + '</div>').get(2);
        }
        myTooltip.hideTooltip = function(feature, context) {
            $('#tooltips').html('');
        }

        interaction = wax.mm.interaction(m, tilejson, {callbacks: myTooltip,clickAction: ['full', 'teaser', 'location']});
           tilejson.minzoom = 3;
           tilejson.maxzoom = 5;
           m.addCallback("drawn", function (m) {
             b.setCenterZoom(m.getCenter(), m.getZoom());
           });
           m.setProvider(new wax.mm.connector(tilejson));
        wax.mm.attribution(m, tilejson).appendTo(m.parent);
        wax.mm.zoomer(m, tilejson).appendTo($('#controls')[0]);
        wax.mm.bwdetect(m, {
            auto: true,
            png:'.png64?'
        });
    });
   



function refreshMap(layers) {
    
       wax.tilejson('http://api.tiles.mapbox.com/v2/' + layers + '.jsonp', function(tilejson) {
               tilejson.minzoom = 3;
               tilejson.maxzoom = 5;
               m.setProvider(new wax.mm.connector(tilejson));
               window.setTimeout(function() {
                 b.setProvider(new wax.mm.connector(tilejson));
               }, 500);
               $('#tooltips').empty();
               interaction.remove();
               legend = wax.mm.legend(m, tilejson).appendTo(document.getElementById('tooltips'));
               interaction = wax.mm.interaction(m, tilejson,{callbacks: myTooltip,clickAction: ['full', 'teaser', 'location']});
          });
    }

function showTableContent(feature){
	var features = feature.split(' ');
	var state = features[0];
	var num = features[1];
	var type=features[features.length-1].split("-")[0];
	var action=features[features.length-1].split("-")[1];
	var statename="";
	for (i=0;i<features.length;i++){
		if (i!=0 && i!=1 && i!=features.length-1){
			statename+=features[i]+ " ";
		}
	}
	
	var content = " ";
	var typeByState=getTypeByState(state);

	var numPercent = (num*100)/data.features.length;
	if (type == "alltype"){
		content +="<h2>Pirate action details in " + statename + ":</h2>";
		content += "<h4>Total pirate action cases: <span class='red'>" + num + "</span></h4>";
		content += "<h4>Percent of total cases: <span class='red'>" + parseFloat(numPercent).toFixed(1) + "%</span></h4>";
		content +="<table><tr><th>Type</th><th>Cases</th><th>Amount</th></tr>"; 
		content +="<tr><td>NAL</td>";
		content +="<td>" + typeByState[0] + "</td>";
		content +="<td>$" +typeByState[1] +"</td></tr>";
		
		content +="<tr><td>NOUO</td>";
		content +="<td>" + typeByState[2] + "</td>";
		content +="<td>" +typeByState[3] +"</td></tr>";
		
		content +="<tr><td>FORFEITURE ORDER</td>";
		content +="<td>" + typeByState[4] + "</td>";
		content +="<td>$" +typeByState[5] +"</td></tr>"
		
		content +="<tr><td>M.O.&O.</td>";
		content +="<td>" + typeByState[6] + "</td>";
		content +="<td>$" +typeByState[7] +"</td></tr>"
	
		content +="<tr><td>ORDER & CONSENT DECREE</td>";
		content +="<td>" + typeByState[8] + "</td>";
		content +="<td>$" +typeByState[9] +"</td></tr>"
		content += "</table>";
	}
	else if (type == "nal"){
		content +="<h2>Pirate NAL action details in " + statename + ":</h2>";
		content += "<h4>Total pirate NAL action cases: <span class='red'>" + num + "</span></h4>";
		content += "<h4>Total amount of NAL: <span class='red'>$" +typeByState[1]  + "</span></h4>"
		content += "<em>Click for a breakdown of all NAL actions.</em>";
		if (action == "click"){
			content+=getActionDetails(state,type);
		}
	}
	else if (type == "nouo"){
			content +="<h2>Pirate NOUO action details in " + statename + ":</h2>";
			content += "<h4>Total pirate NOUO action cases: <span class='red'>" + num + "</span></h4>";
			content += "<em>Click for a breakdown of all NAL actions.</em>";
			if (action == "click"){
				content+=getActionDetails(state,type);
			}
	}
	else if (type == "forf_order"){
		content +="<h2>Pirate Forfeiture Order action details in " + statename + ":</h2>";
		content += "<h4>Total pirate Forfeiture Order action cases: <span class='red'>" + num + "</span></h4>";
		content += "<h4>Total amount of Forfeiture Order: <span class='red'>$" +typeByState[5]  + "</span></h4>"
		content += "<em>Click for a breakdown of all Forfeiture Order actions.</em>";
		if (action == "click"){
			content+=getActionDetails(state,type);
		}
	}
	else if (type == "other"){
		var totalAmount = typeByState[7]+typeByState[9];
		content +="<h2>Pirate Other type action details in " + statename + ":</h2>";
		content += "<h4>Total pirate Other type action cases: <span class='red'>" + num + "</span></h4>";
		content += "<h4>Total amount of Other type: <span class='red'>$" + totalAmount  + "</span></h4>"
		content += "<em>Click for a breakdown of all Other type actions.</em>";
		if (action == "click"){
			content += getActionDetails(state,type);
		}
	}


	
	return content;	
}

function getTypeByState(state){
	var typeByState=[];
    var nalNum=0,nalAmount=0,nouoNum=0,nouoAmount="",forfNum=0;forfAmount=0,mooNum=0,mooAmount=0,ocdNum=0,ocdAmount=0;
    var features=data.features;
    for (i=0;i<features.length;i++){
    	if (features[i].properties.state==state){
	    	if (features[i].properties.actiontype=="NAL"){
	    		nalNum++;
	    		nalAmount+=parseAmount(features[i].properties.fortamt);
	    	}
	    	else if (features[i].properties.actiontype=="NOUO"){
	    		nouoNum++;
	    	}
	    	else if (features[i].properties.actiontype=="FORFEITURE ORDER"){
	    		forfNum++;
	    		forfAmount+=parseAmount(features[i].properties.fortamt);
	    	}
	    	else if (features[i].properties.actiontype=="M.O.&O."){
	    		mooNum++;
	    		mooAmount+=parseAmount(features[i].properties.fortamt);
	    	}
	    	else if (features[i].properties.actiontype=="ORDER & CONSENT DECREE"){
	    		ocdNum++;
	    		ocdAmount+=parseAmount(features[i].properties.fortamt);
	    	}
	
    	}
    }
    typeByState.push(nalNum);
    typeByState.push(nalAmount);
    typeByState.push(nouoNum);
    typeByState.push(nouoAmount);
    typeByState.push(forfNum);
    typeByState.push(forfAmount);
    typeByState.push(mooNum);
    typeByState.push(mooAmount);
    typeByState.push(ocdNum);
    typeByState.push(ocdAmount);
    return typeByState;
}

function getActionDetails(state, type){
	var content="";
    var features=data.features;
    if (type=="nal"){
    	content +="<table><tr><th>File</th><th>Date</th><th>Address</th><th>Amount</th><th>URL</th></tr>";
    	for (i=0;i<features.length;i++){
        	if (features[i].properties.state==state && features[i].properties.actiontype=="NAL"){
        		content +="<tr><td>" + features[i].properties.file + "</td>";
        		content +="<td>" + features[i].properties.date + "</td>";
        		content +="<td>" +features[i].properties.addressee +"</td>";
        		content +="<td>$" + parseAmount(features[i].properties.fortamt) + "</td>";
        		content +="<td><a href='" + features[i].properties.url + "' target='_blank'>link</a></td></tr>";
        	}
    	}
    }
    else if (type=="nouo"){
    	content +="<table><tr><th>File</th><th>Date</th><th>Address</th><th>URL</th></tr>";
    	for (i=0;i<features.length;i++){
        	if (features[i].properties.state==state && features[i].properties.actiontype=="NOUO"){
        		content +="<tr><td>" + features[i].properties.file + "</td>";
        		content +="<td>" + features[i].properties.date + "</td>";
        		content +="<td>" +features[i].properties.addressee +"</td>";
        		content +="<td><a href='" + features[i].properties.url + "' target='_blank'>link</a></td></tr>";
        	}
    	}
    }
    else if (type=="forf_order"){
    	content +="<table><tr><th>File</th><th>Date</th><th>Address</th><th>Amount</th><th>URL</th></tr>";
    	for (i=0;i<features.length;i++){
        	if (features[i].properties.state==state && features[i].properties.actiontype=="FORFEITURE ORDER"){
        		content +="<tr><td>" + features[i].properties.file + "</td>";
        		content +="<td>" + features[i].properties.date + "</td>";
        		content +="<td>" +features[i].properties.addressee +"</td>";
        		content +="<td>$" + parseAmount(features[i].properties.fortamt) + "</td>";
        		content +="<td><a href='" + features[i].properties.url + "' target='_blank'>link</a></td></tr>";
        	}
    	}
    }
    else if (type=="other"){
    	content +="<table><tr><th>Type</th><th>File</th><th>Date</th><th>Address</th><th>Amount</th><th>URL</th></tr>";
    	for (i=0;i<features.length;i++){
        	if (features[i].properties.state==state && features[i].properties.actiontype!="NAL" &&
        			features[i].properties.actiontype!="NOUO" && features[i].properties.actiontype!="FORFEITURE ORDER"){
        		content +="<tr><td>" + features[i].properties.actiontype + "</td>";
        		content +="<td>" + features[i].properties.file + "</td>";
        		content +="<td>" + features[i].properties.date + "</td>";
        		content +="<td>" +features[i].properties.addressee +"</td>";
        		content +="<td>$" + parseAmount(features[i].properties.fortamt) + "</td>";
        		content +="<td><a href='" + features[i].properties.url + "' target='_blank'>link</a></td></tr>";
        	}
    	}
    }
    content += "</table>";
    return content;
}

function parseAmount(amt){
	if (!isNaN(amt)){
		return 0;
	}
	else{
	    amt = amt.replace("$","");
	    amt = amt.replace(",","");
	    return parseFloat(amt);
	}
}

$(document).ready(function () {
   $('.description').hide();
   $('#description-all').show();

    // Layer Selection
    $('a.candidate-tab').click(function(e) {
        $('a.candidate-tab').removeClass('active');
        $(e.currentTarget).addClass('active');
        var actiontype = $(e.currentTarget).attr('id');
        $('.description').hide();
        $('#description-' + actiontype).show();
          
    });
});

$('ul li a').click(function (e) {
      if (!$(this).hasClass('active')) {
      $('ul li a').removeClass('active');
     
       $(this).addClass('active');
   
            var activeLayer = $(this).attr('data-layer');
            layers = [
                //baselayer,
                //borders,
                activeLayer
            ];
                refreshMap(layers);
        }
    });

// Embed Code
$('a.share').click(function(e){
     e.preventDefault();
     $('#share, #overlay').addClass('active');
     
     var twitter = 'http://twitter.com/intent/tweet?status=' +
     'Funding the Hate Campaigns with SuperPAC Spending ' + encodeURIComponent(window.location);
     var facebook = 'https://www.facebook.com/sharer.php?t=1000%20Days%20Interactive%20Map&u=' +
     encodeURIComponent(window.location);
     
     document.getElementById('twitter').href = twitter;
     document.getElementById('facebook').href = facebook;
     
     var center = m.pointLocation(new mm.Point(m.dimensions.x/2,m.dimensions.y/2));
     var embedUrl = 'http://api.tiles.mapbox.com/v2/' + layers + '/mm/zoompan,tooltips,legend,bwdetect.html#' + m.coordinate.zoom +
                      '/' + center.lat + '/' + center.lon;
     $('#embed-code-field textarea').attr('value', '<iframe src="' + embedUrl +
         '" frameborder="0" width="650" height="500"></iframe>');
     
     $('#embed-code')[0].tabindex = 0;
     $('#embed-code')[0].select();
  });

    // Trigger close buttons with the escape key
    $(document.documentElement).keydown(function (e) {
        if (e.keyCode === 27) { $('a.close').trigger('click'); }
    });

    $('a.close').click(function (e) {
        e.preventDefault();
        $('#share, #overlay').removeClass('active');
    });
