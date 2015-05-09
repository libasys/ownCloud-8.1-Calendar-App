<?php

//\OC::$CLASSPATH['OCA\Calendar\Calendar'] = 'calendar/lib/calendar.php';

//Repeating Events Hooks
\OCP\Util::connectHook('OC_Calendar', 'addEvent', '\OCA\Calendar\Repeat', 'generate');
\OCP\Util::connectHook('OC_Calendar', 'editEvent', '\OCA\Calendar\Repeat', 'update');
\OCP\Util::connectHook('OC_Calendar', 'deleteEvent', '\OCA\Calendar\Repeat', 'clean');
\OCP\Util::connectHook('OC_Calendar', 'moveEvent', '\OCA\Calendar\Repeat', 'update');
\OCP\Util::connectHook('OC_Calendar', 'deleteCalendar', '\OCA\Calendar\Repeat', 'cleanCalendar');

\OCP\Share::registerBackend('calendar', '\OCA\Calendar\Share\Backend\Calendar');
\OCP\Share::registerBackend('event', '\OCA\Calendar\Share\Backend\Event');

