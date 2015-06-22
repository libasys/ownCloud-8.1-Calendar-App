$(document).ready(function(){
	    
		$('.viewsettings').change( function(){
			$.post( OC.generateUrl('apps/calendar/calendarsettingssaveuserview'), {
				'checked' : $(this).is(':checked'),
				'name' : $(this).attr('name')
			}, function(jsondata){
				if(jsondata.status == 'success'){
					Calendar.calendarConfig['userconfig'][jsondata.data.name]= jsondata.data.checked;
					if(jsondata.data.checked === 'true'){
						$('.view button[data-action="'+jsondata.data.name+'"]').show();
					}else{
						$('.view button[data-action="'+jsondata.data.name+'"]').hide();
					}
				}
				//OC.msg.finishedSaving('.msgTzd', jsondata);
			});
			return false;
		});
		
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



