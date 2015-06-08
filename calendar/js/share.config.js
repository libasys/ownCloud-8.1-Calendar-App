/*Options  

defaultView: month, agendaDay, agendaThreeDays, agendaWorkWeek, agendaWeek, list
firstDay: 0- 6 (0 = Sunday, 1 = Monday,...)
agendatime: timeformat 24 hours HH:mm { - HH:mm} or for timeformat 12 hours  hh:mm tt { - hh:mm tt}
defaulttime:  timeformat 24 hours  HH:mm  or for timeformat 12 hours hh:mm tt
calendarViews: 'prev','agendaDay','agendaThreeDays','agendaWorkWeek','agendaWeek','month','list','next' //choosen buttons 
smallCalendarLeft: true / false //shows small calendar on the left side
showTimeZone: true / false //shows the selectbox for timezone selection, if false it shows only the text
header: false //Removes the header
footer: false //removes the footer
 * */

CalendarShare.defaultConfig={
	'defaultView' : 'agendaWeek' , 	  
	'agendatime' : 'HH:mm { - HH:mm}',
	'defaulttime' : 'HH:mm',
	'firstDay' : '1',
	'calendarViews': ['prev','agendaDay','agendaThreeDays','agendaWorkWeek','agendaWeek','month','list','next'],
	'smallCalendarLeft': true,
	'showTimeZone': true,
	'header': true,
	'footer' : true
};