var happies = 0;
var msgsCount = 0;
var morning = 0;
var night = 0;

$(function(){
	setTimeout(function(){
		$('#main').css("display", "initial");
		$('#load').html("Still Processing...");
	}, 6000);

	main();
});

function main(){
	fileDist();
}

function fileDist() {
	var files = 0;

	$.get('fileinfo.txt', function(data) {
		var fname = data.indexOf("FILENUM") + "FILENUM:".length;
		var ftype = data.indexOf("FILETYPE");

		files = parseInt(data.substr(fname, ftype - fname - 1));

		data = data.substr(ftype+"FILETYPE".length);

		$('#file-dist-res').text(files);

		var dists = data.split("\n").map(String);

		var endings = [];
		var ending_vals = [];
		var colors = [];

		dists.forEach(function(item, index) {
			var sub = item.substr(item.indexOf("."));
			var num = parseInt(item.match(/\d+/));

			if(sub != "" && num != NaN){
				endings.push(sub);
				ending_vals.push(num);
				colors.push(getRandomColor());
			}
		});

		var ctx1 = document.getElementById('file-dist-pie').getContext('2d');
		var chart = new Chart(ctx1, {
		    type: 'pie',

		    data: {
		        labels: endings,
		        datasets: [{
		            label: "Distribution of file extensions",
		            backgroundColor: colors,
		            data: ending_vals,
		        }]
		    },

		    // Configuration options go here
		    options: {
		    }
		});

		if(data.match( /(.java|.php|.py|.h|.c|.go|.html|.css|.js|.cpp|.sh|.cs|.json)/ )){
			$('#file-dist-main').html($('#file-dist-main').html() + "You seem to be a programmer based on the files you have sent.");
		}

		msgFreq(files);
	}, 'text');
}

function msgFreq(f) {
	for(var x = 0; x < f; x++){
		$.get('messages/' + x + '.html', function(data) {
			$('#hidden-div').html(data);

			$('.message').each(function(index){

				var msg = $(this).next().text();

				msgsCount ++;

				if(msg.match( /(rofl|lmao|haha|ha|aha|lol|:)/ )) {
					happies ++;
				}

				var time = $(this).find(".meta").text();

				var hour = parseInt(time.substr(time.indexOf(":") - 2, 2));

				if((hour < 8  && hour > 0)|| (hour > 20 && hour < 24)){
					night++;
				} else if (hour < 20 && hour > 8) {
					morning++;
				}
			});

				
		}, "html");
	}

	$(document).ajaxStop(function () {
		other_stuff();
	});
}

function sent_type(happies, msgsCount){
	var frac = happies/msgsCount;

	if(frac > .05){
		return "very happy";
	} else if (frac > .03) {
		return "pretty happy"
	} else if (frac > .01) {
		return "happy";
	} else {
		return "ambivalent";
	}
}

function other_stuff(){
	$('#load').css("display", "none");
	$('#sent-type').html(sent_type(happies, msgsCount));
	$('#sent-count').html(happies);

	var ctx2 = document.getElementById('msg-time-dough').getContext('2d');
	var chart = new Chart(ctx2, {
	    type: 'bar',

	    data: {
	        labels: ["Morning", "Night"],
	        datasets: [{
	            label: "Day Messages vs. Night Messages",
	            backgroundColor: [getRandomColor(), getRandomColor()],
	            data: [morning, night],
	        }]
	    },

	    // Configuration options go here
	    options: {
	    }
	});

	if(morning > night) {
		$('#msg-time').html($('#msg-time').html() + "You are a morning person. You send the majority of your messages in the day time.");
	} else {
		$('#msg-time').html($('#msg-time').html() + "You are a night person. You send the majority of your messages in the night time.")
	}
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}