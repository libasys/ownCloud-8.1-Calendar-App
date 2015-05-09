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


//$this->create('calendar_js_l10nshare', 'js/l10nshare.php') -> actionInclude('calendar/js/l10nshare.php');

//$this->create('calendar_index', '/')->actionInclude('calendar/index.php');
// /js


/*
$this->create('calendar_events', 'ajax/events.php') -> actionInclude('calendar/ajax/events.php');
$this->create('calendar_changeview', 'ajax/changeview.php') -> actionInclude('calendar/ajax/changeview.php');
$this->create('calendar_eventsdayview', 'ajax/eventsdayview.php') -> actionInclude('calendar/ajax/eventsdayview.php');
$this->create('calendar_reminder', 'ajax/reminder.php') -> actionInclude('calendar/ajax/reminder.php');
//$this->create('liveReminderCheck', '/apps/calendar/ajax/reminder/')->actionInclude('apps/calendar/ajax/reminder.php');

// /ajax/calendar
$this->create('calendar_calendar_activation', 'ajax/calendar/activation.php') -> actionInclude('calendar/ajax/calendar/activation.php');
$this->create('calendar_calendar_activecal', 'ajax/calendar/activecal.php') -> actionInclude('calendar/ajax/calendar/activecal.php');
$this->create('calendar_calendar_delete', 'ajax/calendar/delete.php') -> actionInclude('calendar/ajax/calendar/delete.php');
$this->create('calendar_calendar_edit_form', 'ajax/calendar/edit.form.php') -> actionInclude('calendar/ajax/calendar/edit.form.php');
$this->create('calendar_calendar_edit', 'ajax/calendar/edit.php') -> actionInclude('calendar/ajax/calendar/edit.php');
$this->create('calendar_calendar_new_form', 'ajax/calendar/new.form.php') -> actionInclude('calendar/ajax/calendar/new.form.php');
$this->create('calendar_calendar_new', 'ajax/calendar/new.php') -> actionInclude('calendar/ajax/calendar/new.php');
$this->create('calendar_calendar_overview', 'ajax/calendar/overview.php') -> actionInclude('calendar/ajax/calendar/overview.php');
$this->create('calendar_calendar_refresh', 'ajax/calendar/refresh.php') -> actionInclude('calendar/ajax/calendar/refresh.php');
$this->create('calendar_calendar_rebuild', 'ajax/calendar/rebuild.php') -> actionInclude('calendar/ajax/calendar/rebuild.php');
$this->create('calendar_calendar_touch', 'ajax/calendar/touch.php') -> actionInclude('calendar/ajax/calendar/touch.php');
$this->create('calendar_calendar_update', 'ajax/calendar/update.php') -> actionInclude('calendar/ajax/calendar/update.php');

// /ajax/cache
$this->create('calendar_cache_rescan', 'ajax/cache/rescan.php') -> actionInclude('calendar/ajax/cache/rescan.php');
$this->create('calendar_cache_status', 'ajax/cache/status.php') -> actionInclude('calendar/ajax/cache/status.php');

// /ajax/categories
$this->create('calendar_categories_delete', 'ajax/categories/delete.php') -> actionInclude('calendar/ajax/categories/delete.php');
$this->create('calendar_categories_rescan', 'ajax/categories/rescan.php') -> actionInclude('calendar/ajax/categories/rescan.php');

// /ajax/event
$this->create('calendar_event_addcategory', 'ajax/event/addcategory.php') -> actionInclude('calendar/ajax/event/addcategory.php');
$this->create('calendar_event_addsharedevent', 'ajax/event/addsharedevent.php') -> actionInclude('calendar/ajax/event/addsharedevent.php');
$this->create('calendar_event_addsubscriber', 'ajax/event/addsubscriber.php') -> actionInclude('calendar/ajax/event/addsubscriber.php');
$this->create('calendar_event_delete_exdate', 'ajax/event/delete-exdate.php') -> actionInclude('calendar/ajax/event/delete-exdate.php');
$this->create('calendar_event_delete_single', 'ajax/event/delete-single.php') -> actionInclude('calendar/ajax/event/delete-single.php');
$this->create('calendar_event_delete', 'ajax/event/delete.php') -> actionInclude('calendar/ajax/event/delete.php');
$this->create('calendar_event_edit_form', 'ajax/event/edit.form.php') -> actionInclude('calendar/ajax/event/edit.form.php');
$this->create('calendar_event_edit', 'ajax/event/edit.php') -> actionInclude('calendar/ajax/event/edit.php');
$this->create('calendar_event_move', 'ajax/event/move.php') -> actionInclude('calendar/ajax/event/move.php');
$this->create('calendar_event_new_form', 'ajax/event/new.form.php') -> actionInclude('calendar/ajax/event/new.form.php');
$this->create('calendar_event_new', 'ajax/event/new.php') -> actionInclude('calendar/ajax/event/new.php');
$this->create('calendar_event_resize', 'ajax/event/resize.php') -> actionInclude('calendar/ajax/event/resize.php');
$this->create('calendar_event_sendmail', 'ajax/event/sendmail.php') -> actionInclude('calendar/ajax/event/sendmail.php');
$this->create('calendar_event_show_form', 'ajax/event/show.form.php') -> actionInclude('calendar/ajax/event/show.form.php');

// /ajax/import
$this->create('calendar_import_calendarcheck', 'ajax/import/calendarcheck.php') -> actionInclude('calendar/ajax/import/calendarcheck.php');
$this->create('calendar_import_dialog', 'ajax/import/dialog.php') -> actionInclude('calendar/ajax/import/dialog.php');
$this->create('calendar_import_dropimport', 'ajax/import/dropimport.php') -> actionInclude('calendar/ajax/import/dropimport.php');
$this->create('calendar_import_import', 'ajax/import/import.php') -> actionInclude('calendar/ajax/import/import.php');

// /ajax/settings
$this->create('calendar_settings_getfirstday', 'ajax/settings/getfirstday.php') -> actionInclude('calendar/ajax/settings/getfirstday.php');
$this->create('calendar_settings_gettimezonedetection', 'ajax/settings/gettimezonedetection.php') -> actionInclude('calendar/ajax/settings/gettimezonedetection.php');
$this->create('calendar_settings_guesstimezone', 'ajax/settings/guesstimezone.php') -> actionInclude('calendar/ajax/settings/guesstimezone.php');
$this->create('calendar_settings_setcalendarnav', 'ajax/settings/setcalendarnav.php') -> actionInclude('calendar/ajax/settings/setcalendarnav.php');
$this->create('calendar_settings_setfirstday', 'ajax/settings/setfirstday.php') -> actionInclude('calendar/ajax/settings/setfirstday.php');
$this->create('calendar_settings_settasknav', 'ajax/settings/settasknav.php') -> actionInclude('calendar/ajax/settings/settasknav.php');
$this->create('calendar_settings_settimeformat', 'ajax/settings/settimeformat.php') -> actionInclude('calendar/ajax/settings/settimeformat.php');
$this->create('calendar_settings_settimezone', 'ajax/settings/settimezone.php') -> actionInclude('calendar/ajax/settings/settimezone.php');
$this->create('calendar_settings_timeformat', 'ajax/settings/timeformat.php') -> actionInclude('calendar/ajax/settings/timeformat.php');
$this->create('calendar_settings_timezonedetection', 'ajax/settings/timezonedetection.php') -> actionInclude('calendar/ajax/settings/timezonedetection.php');

// /ajax/tasks
$this->create('calendar_tasks_completed', 'ajax/tasks/completed.php') -> actionInclude('calendar/ajax/tasks/completed.php');
$this->create('calendar_tasks_rebuild', 'ajax/tasks/rebuild.php') -> actionInclude('calendar/ajax/tasks/rebuild.php');

$this->create('calendar_root_calendar', 'calendar.php') -> actionInclude('calendar/calendar.php');
$this->create('calendar_root_export', 'export.php') -> actionInclude('calendar/export.php');
$this->create('calendar_root_settingswrapper', 'settingswrapper.php') -> actionInclude('calendar/settingswrapper.php');
$this->create('calendar_root_share', 'share.php') -> actionInclude('calendar/share.php');
*/
\OCP\API::register('get',
		'/apps/calendar/api/v1/shares',
		array('\OCA\Calendar\API\Local', 'getAllShares'),
		'calendar');
\OCP\API::register('get',
		'/apps/calendar/api/v1/shares/{id}',
		array('\OCA\Calendar\API\Local', 'getShare'),
		'calendar');	

