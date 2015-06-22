
/**SETTINGS EVENTS**/
		$(document).on('click', '.chooseCalendar-activeCalendar', function () {
			Calendar.UI.Calendar.activation(this,$(this).data('id'));
		});
		
		$(document).on('click', '.chooseCalendar-showCalDAVURL', function () {
			Calendar.UI.showCalDAVUrl($(this).data('user'), $(this).data('caldav'));
		});
		
		$(document).on('click', '.chooseCalendar-edit', function () {
			Calendar.UI.Calendar.edit($(this), $(this).data('id'));
		});

		$(document).on('click', '.chooseCalendar-delete', function () {
			Calendar.UI.Calendar.deleteCalendar($(this).data('id'));
		});
		
		$(document).on('click', '#caldav_url_close', function () {
			$('#caldav_url').hide();$('#caldav_url_close').hide();
		});

		$(document).on('mouseover', '#caldav_url', function () {
			$('#caldav_url').select();
		});
		
		$(document).on('click', '#newCalendar', function () {
			Calendar.UI.Calendar.newCalendar(this);
		});
		
/**END**/

$(document).on('click', '#editCategories', function () {
	$(this).tipsy('hide');OC.Tags.edit('event');
});

$(document).on('click', '#allday_checkbox', function () {
	Calendar.UI.lockTime();
});

/*
$(document).on('click', '#submitNewEvent', function () {
	Calendar.UI.validateEventForm($(this).data('link'));
});

$(document).on('click', '#editEvent-submit', function () {
	Calendar.UI.validateEventForm($(this).data('link'));
});*/

$(document).on('click', '#allday_checkbox', function () {
	Calendar.UI.lockTime();
});



/**NEW**/
/*
$(document).on('click', '#editEvent-delete-single', function () {
	Calendar.UI.submitDeleteEventSingleForm($(this).data('link'));
});*/

$(document).on('click', '#editEvent-export', function () {
	window.location = $(this).data('link');
});





