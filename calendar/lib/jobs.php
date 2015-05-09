<?php

 namespace OCA\Calendar;
 
class Jobs{
	
	static public function checkAlarm() {
		\OCP\Util::writeLog('calendar','Cron Done:'.time() ,\OCP\Util::DEBUG);
	}
	public static function run() {
		\OCP\Util::writeLog('calendar','Cron run Done:'.time() ,\OCP\Util::DEBUG);
	}
}