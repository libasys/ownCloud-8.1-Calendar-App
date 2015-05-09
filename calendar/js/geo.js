/**
 * Copyright (c) 2011 Georg Ehrke <ownclouddev at georgswebsite dot de>
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */
$(document).ready(function(){
	var timezone = jstz.determine();
	var timezoneName = timezone.name();

	$.post(OC.generateUrl('apps/calendar/calendarsettingsgetguesstimezoneuser'), {timezone: timezoneName},
		function(data){
			
			if (data.status == 'success' && typeof(data.message) != 'undefined'){
				$('#notification').html(data.message);
				$('#notification').slideDown();
				window.setTimeout(function(){$('#notification').slideUp();}, 5000);
				$('#fullcalendar').fullCalendar('refetchEvents');
			}
		});
});