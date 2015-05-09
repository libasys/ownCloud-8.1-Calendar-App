<?php
/**
 * Copyright (c) 2012 Georg Ehrke <ownclouddev@georgswebsite.de>
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */
/**
 * This class does export and converts all times to UTC
 */
namespace OCA\Calendar;
  
class Export{
	/**
	 * @brief Use one of these constants as second parameter if you call Export::export()
	 */
	const CALENDAR = 'calendar';
	const EVENT = 'event';

	/**
	 * @brief export a calendar or an event
	 * @param integer $id id of calendar / event
	 * @param string $type use Export constants
	 * @return string
	 */
	public static function export($id, $type) {
		if($type == self::EVENT) {
			$return = self::event($id);
		}else{
			$return = self::calendar($id);
		}
		return self::fixLineBreaks($return);
	}

	/**
	 * @brief exports a calendar and convert all times to UTC
	 * @param integer $id id of the calendar
	 * @return string
	 */
	private static function calendar($id) {
		$events = Object::all($id);
		$calendar = Calendar::find($id);
		$return = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:ownCloud Calendar " . \OCP\App::getAppVersion('calendar') . "\nX-WR-CALNAME:" . $calendar['displayname'] . "\n";
		$return .= self::addVtimezone();
		
		foreach($events as $event) {
			$return .= self::generateEvent($event);
		}
		$return .= "END:VCALENDAR";
		return $return;
	}

    private static function addVtimezone(){
    	
		$tz=App::getTimezone();
		$ex=explode('/', $tz, 2);
		$aTzTimes = App::getTzDaylightStandard();
		
		if(isset($ex[1]) && array_key_exists($ex[0], $aTzTimes)){
			$summerTime=$aTzTimes[$ex[0]]['daylight'];
			$winterTime=$aTzTimes[$ex[0]]['standard'];
			
			$dateOffsetSummer=new \DateTime($summerTime, new \DateTimeZone('UTC'));	
			$dateOffsetSummer -> setTimezone(new \DateTimeZone($tz));	
			$offsetSummer= $dateOffsetSummer->format('O') ;
			$offsetSummerTZ= $dateOffsetSummer->format('T') ;
			$dateOffsetWinter=new \DateTime($winterTime, new \DateTimeZone('UTC'));	
			$dateOffsetWinter -> setTimezone(new \DateTimeZone($tz));	
			$offsetWinter= $dateOffsetWinter->format('O') ;
			$offsetWinterTZ= $dateOffsetWinter->format('T') ;
			
			$sTimeZone = "BEGIN:VTIMEZONE\nTZID:".$tz."\n";
			$sTimeZone .="BEGIN:DAYLIGHT\n";
			$sTimeZone .="TZOFFSETFROM:".$offsetWinter."\n";
			$sTimeZone .="RRULE:FREQ=YEARLY;BYMONTH=".$aTzTimes[$ex[0]]['daylightstart'].";BYDAY=-1SU\n";
			$sTimeZone .="DTSTART:".$summerTime."\n";
			$sTimeZone .="TZNAME:".$offsetSummerTZ."\n";
			$sTimeZone .="TZOFFSETTO:".$offsetSummer."\n";
			$sTimeZone .="END:DAYLIGHT\n";
			$sTimeZone .="BEGIN:STANDARD\n";
			$sTimeZone .="TZOFFSETFROM:".$offsetSummer."\n";
			$sTimeZone .="RRULE:FREQ=YEARLY;BYMONTH=".$aTzTimes[$ex[0]]['daylightend'].";BYDAY=-1SU\n";
			$sTimeZone .="DTSTART:".$winterTime."\n";
			$sTimeZone .="TZNAME:".$offsetWinterTZ."\n";
			$sTimeZone .="TZOFFSETTO:".$offsetWinter."\n";
			$sTimeZone .="END:STANDARD\n";
			$sTimeZone .="END:VTIMEZONE\n";
			
			return $sTimeZone;
		}
    }
	/**
	 * @brief exports an event and convert all times to UTC
	 * @param integer $id id of the event
	 * @return string
	 */
	private static function event($id) {
		$event = Object::find($id);
		$return = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:ownCloud Calendar " . \OCP\App::getAppVersion('calendar') . "\nX-WR-CALNAME:" . $event['summary'] . "\n";
		$object = VObject::parse($event['calendardata']);
		if($object->VTIMEZONE){
			$return .= self::addVtimezone();
		}
		
		$return .= self::generateEvent($event);
		$return .= "END:VCALENDAR";
		return $return;
	 }

	 /**
	  * @brief generates the VEVENT/VTODO/VJOURNAL with UTC dates
	  * @param array $event
	  * @return string
	  */
	 private static function generateEvent($event) {
	 	$object = VObject::parse($event['calendardata']);
		$serializeObjects='';
		if(!$object){
			return false;
		}

		$sharedAccessClassPermissions = Object::getAccessClassPermissions($object);
		if(Object::getowner($event['id']) !== \OCP\User::getUser()){
			if (!($sharedAccessClassPermissions & \OCP\PERMISSION_READ)) {
				return '';
			}
		}
		$object = Object::cleanByAccessClass($event['id'], $object);

		if($object->VEVENT){
			/*	
			$dtstart = $object->VEVENT->DTSTART;
			$start_dt = $dtstart->getDateTime();
			$dtend = Object::getDTEndFromVEvent($object->VEVENT);
			$end_dt = $dtend->getDateTime();
			if($dtstart->getValueType() !== 'DATE') {
				$start_dt->setTimezone(new \DateTimeZone('UTC'));
				$end_dt->setTimezone(new \DateTimeZone('UTC'));
				$object->VEVENT->setDateTime('DTSTART', $start_dt);
				$object->VEVENT->setDateTime('DTEND', $end_dt);
			}*/
			return $object->VEVENT->serialize();
			
		}
		if($object->VTODO){
			return $object->VTODO->serialize();
		}
		if($object->VJOURNAL){
			return $object->VJOURNAL->serialize();
		}
		
		
		
		return '';
	}

	/**
	 * @brief fixes new line breaks
	 * (fixes problems with Apple iCal)
	 * @param string $string to fix
	 * @return string
	 */
	private static function fixLineBreaks($string) {
		$string = str_replace("\r\n", "\n", $string);
		$string = str_replace("\r", "\n", $string);
		$string = str_replace("\n", "\r\n", $string);
		return $string;
	}
}
