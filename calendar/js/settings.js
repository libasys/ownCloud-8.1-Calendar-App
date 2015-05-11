$(document).ready(function(){
	    
		
		$('#timeformat').chosen();
		$('#firstday').chosen();
		$('#timezone').chosen();
		
		$('#timezone').change( function(){
			var post = $( '#timezone' ).serialize();
			$.post( OC.generateUrl('apps/calendar/calendarsettingssettimezone'), post, function(jsondata){
				$('#fullcalendar').fullCalendar('destroy');
				Calendar.init();
				OC.msg.finishedSaving('.msgTz', jsondata);
				});
			return false;
		});
		
		$('#timeformat').change( function(){
			var data = $('#timeformat').serialize();
			$.post( OC.generateUrl('apps/calendar/calendarsettingssettimeformat'), data, function(jsondata){
				OC.msg.finishedSaving('.msgTf', jsondata);
				Calendar.calendarConfig['agendatime'] = jsondata.data.agendaTime;
				Calendar.calendarConfig['defaulttime'] = jsondata.data.defaultTime;
				$('#fullcalendar').fullCalendar('destroy');
				Calendar.init();
				});
			return false;
		});
		
		$('#firstday').change( function(){
			var data = $('#firstday').serialize();
			$.post( OC.generateUrl('apps/calendar/calendarsettingssetfirstday'), data, function(jsondata){
				OC.msg.finishedSaving('.msgFd', jsondata);
				Calendar.calendarConfig['firstDay'] = jsondata.firstday;
				$("#datepickerNav").datepicker('option', 'firstDay', jsondata.firstday);
				$('#fullcalendar').fullCalendar('destroy');
				Calendar.init();
				
			});
			return false;
		});
		
		$('#timezonedetection').change( function(){
			var data = $('#timezonedetection').serialize();
			$.post( OC.generateUrl('apps/calendar/calendarsettingstimezonedetection'), data, function(jsondata){
				OC.msg.finishedSaving('.msgTzd', jsondata);
			});
			return false;
		});
		
		$('#cleancalendarcache').click(function(){
			$.getJSON(OC.generateUrl('apps/calendar/calendarsettingsrescancal'), function(jsondata){
				OC.msg.finishedSaving('.msgCcc', jsondata);
			});
	});

	

});

OC.Share.loadIcons('calendar');

