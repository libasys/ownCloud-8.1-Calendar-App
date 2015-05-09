<?php

namespace OCA\Calendar;


use \OCA\Calendar\AppInfo\Application;

$application = new Application();
$application->registerRoutes($this, ['routes' => [
		['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
		['name' => 'public#index', 'url' => '/s/{token}', 'verb' => 'GET'],
		['name' => 'public#index','url'  => '/s/{token}', 'verb' => 'POST', 'postfix' => 'auth'],
		['name' => 'public#getGuestSettingsCalendar', 'url' => '/publicgetguestsettingscalendar', 'verb' => 'GET'],
		['name' => 'public#getGuessTimeZone', 'url' => '/publicgetguesstimezone', 'verb' => 'POST'],
		['name' => 'public#getEventsPublic', 'url' => '/geteventspublic', 'verb' => 'GET'],
		['name' => 'event#getEvents', 'url' => '/getevents', 'verb' => 'GET'],
		['name' => 'public#changeViewCalendarPublic', 'url' => '/changeviewcalendarpublic', 'verb' => 'POST'],
		['name' => 'calendar#changeViewCalendar', 'url' => '/changeviewcalendar', 'verb' => 'POST'],
		['name' => 'event#getReminderEvents', 'url' => '/getreminderevents', 'verb' => 'POST'],
		['name' => 'event#getEventsDayView', 'url' => '/geteventsdayview', 'verb' => 'POST'],
		['name' => 'event#addCategorieToEvent', 'url' => '/addcategorietoevent', 'verb' => 'POST'],
		['name' => 'event#addSharedEvent', 'url' => '/addsharedevent', 'verb' => 'POST'],
		['name' => 'event#addSubscriberEvent', 'url' => '/addsubscriberevent', 'verb' => 'POST'],
		['name' => 'event#deleteExdateEvent', 'url' => '/deleteexdateevent', 'verb' => 'POST'],
		['name' => 'event#deleteSingleRepeatingEvent', 'url' => '/deletesinglerepeatingevent', 'verb' => 'POST'],
		['name' => 'event#deleteEvent', 'url' => '/deleteevent', 'verb' => 'POST'],
		['name' => 'event#moveEvent', 'url' => '/moveevent', 'verb' => 'POST'],
		['name' => 'event#resizeEvent', 'url' => '/resizeevent', 'verb' => 'POST'],
		['name' => 'event#getShowEvent', 'url' => '/getshowevent', 'verb' => 'POST'],
		['name' => 'event#getEditFormEvent', 'url' => '/geteditformevent', 'verb' => 'POST'],
		['name' => 'event#editEvent', 'url' => '/editevent', 'verb' => 'POST'],
		['name' => 'event#getNewFormEvent', 'url' => '/getnewformevent', 'verb' => 'POST'],
		['name' => 'event#newEvent', 'url' => '/newevent', 'verb' => 'POST'],
		['name' => 'event#sendEmailEventIcs', 'url' => '/sendemaileventics', 'verb' => 'POST'],
		['name' => 'calendarSettings#index', 'url' => '/calendarsettingsindex', 'verb' => 'GET'],
		['name' => 'calendarSettings#setTimeZone', 'url' => '/calendarsettingssettimezone', 'verb' => 'POST'],
		['name' => 'calendarSettings#setTimeFormat', 'url' => '/calendarsettingssettimeformat', 'verb' => 'POST'],
		['name' => 'calendarSettings#setFirstDay', 'url' => '/calendarsettingssetfirstday', 'verb' => 'POST'],
		['name' => 'calendarSettings#timeZoneDectection', 'url' => '/calendarsettingstimezonedetection', 'verb' => 'POST'],
		['name' => 'calendarSettings#reScanCal', 'url' => '/calendarsettingsrescancal', 'verb' => 'GET'],
		['name' => 'calendarSettings#setTaskNavActive', 'url' => '/calendarsettingssettasknavactive', 'verb' => 'POST'],
		['name' => 'calendarSettings#setCalendarNavActive', 'url' => '/calendarsettingssetcalendarnavactive', 'verb' => 'POST'],
		['name' => 'calendarSettings#getUserSettingsCalendar', 'url' => '/calendarsettingsgetusersettingscalendar', 'verb' => 'GET'],
		['name' => 'calendarSettings#getGuessTimeZoneUser', 'url' => '/calendarsettingsgetguesstimezoneuser', 'verb' => 'POST'],
		['name' => 'calendar#getNewFormCalendar', 'url' => '/getnewformcalendar', 'verb' => 'GET'],
		['name' => 'calendar#getEditFormCalendar', 'url' => '/geteditformcalendar', 'verb' => 'POST'],
		['name' => 'calendar#newCalendar', 'url' => '/newcalendar', 'verb' => 'POST'],
		['name' => 'calendar#editCalendar', 'url' => '/editcalendar', 'verb' => 'POST'],
		['name' => 'calendar#deleteCalendar', 'url' => '/deletecalendar', 'verb' => 'POST'],
		['name' => 'calendar#setActiveCalendar', 'url' => '/setactivecalendar', 'verb' => 'POST'],
		['name' => 'calendar#setMyActiveCalendar', 'url' => '/setmyactivecalendar', 'verb' => 'POST'],
		['name' => 'calendar#touchCalendar', 'url' => '/touchcalendar', 'verb' => 'POST'],
		['name' => 'calendar#rebuildLeftNavigation', 'url' => '/rebuildleftnavigationcalendar', 'verb' => 'POST'],
		['name' => 'calendar#refreshSubscribedCalendar', 'url' => '/refreshsubscribedcalendar', 'verb' => 'POST'],
		['name' => 'tasks#rebuildTaskViewRight', 'url' => '/rebuildtaskviewrightcalendar', 'verb' => 'POST'],
		['name' => 'tasks#setCompletedTask', 'url' => '/setcompletedtaskcalendar', 'verb' => 'POST'],
		['name' => 'import#getImportDialogTpl', 'url' => '/getimportdialogtplcalendar', 'verb' => 'POST'],
		['name' => 'import#checkCalendarExists', 'url' => '/checkcalendarexistsimport', 'verb' => 'POST'],
		['name' => 'import#importEvents', 'url' => '/importeventscalendar', 'verb' => 'POST'],
		['name' => 'import#importEventsPerDrop', 'url' => '/importeventsperdropcalendar', 'verb' => 'POST'],
		['name' => 'export#exportEvents', 'url' => '/exporteventscalendar', 'verb' => 'GET'],
		]
		]);


\OCP\API::register('get',
		'/apps/calendar/api/v1/shares',
		array('\OCA\Calendar\API\Local', 'getAllShares'),
		'calendar');
\OCP\API::register('get',
		'/apps/calendar/api/v1/shares/{id}',
		array('\OCA\Calendar\API\Local', 'getShare'),
		'calendar');	

