<?php
/**
 * Copyright (c) 2012 Georg Ehrke <ownclouddev@georgswebsite.de>
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */
/*
 * This class manages reminders for calendars
 */
namespace OCA\Calendar;
Alarm::$tz = App::getTimezone();
class Alarm {
	private $nowTime = 0;
	private $activeAlarms = array();
	private $aCalendars = array();
	private $aEventSource = array();
	/**
	 * @brief timezone of the user
	 */
	public static $tz;
	
	public function __construct() {
        
		$timeNow=time();
		
		
        //test
        $checkOffset= new \DateTime(date('d.m.Y', $timeNow), new \DateTimeZone(self::$tz));
        $calcSumWin=$checkOffset->getOffset();
		
		$this -> nowTime = strtotime(date('d.m.Y H:i', $timeNow)) + ($calcSumWin);
		
 		
		if (\OC::$server->getSession() -> get('public_link_token')) {
			$linkItem = \OCP\Share::getShareByToken(\OC::$server->getSession() -> get('public_link_token', false));
			if (is_array($linkItem) && isset($linkItem['uid_owner'])) {
				$itemSource = App::validateItemSource($linkItem['item_source'],$linkItem['item_type'].'-');
				$rootLinkItem = Calendar::find($itemSource);
				$this -> aCalendars[] = $rootLinkItem;
			}
		} else {
			$this -> aCalendars = Calendar::allCalendars(\OCP\User::getUser());
			$this -> checkAlarm();
		}

	}

	public function setEventSources($EVENTSRC) {
		$this -> aEventSource = $EVENTSRC;
		//$this->checkAutoRefresh();
	}

	public function checkAutoRefresh() {
		if (is_array($this -> aEventSource)) {
			$calInfoCheck = array();
			foreach ($this->aCalendars as $calInfo) {
				$calInfoCheck[$calInfo['id']] = $calInfo['ctag'];
				//\OCP\Util::writeLog('calendar','Guest Refresh Check Pre :'.$calInfo['id'].':'.$calInfo['ctag'] ,\OCP\Util::DEBUG);
			}
			if (is_array($this -> aEventSource)) {
				foreach ($this->aEventSource as $key => $value) {
					//	 \OCP\Util::writeLog('calendar','Guest Refresh Check :'.$calInfoCheck[$key].':'.$value ,\OCP\Util::DEBUG);

					if (isset($calInfoCheck[$key]) && $calInfoCheck[$key] != $value) {
						return array('id' => $key, 'ctag' => $calInfoCheck[$key]);
					}

				}
			}
			return false;
		} else
			return false;
	}
	
	public function getStartofTheWeek(){
		   $iTagAkt=date("w",$this->nowTime);
   	       $firstday=1;
     	   $iBackCalc=(($iTagAkt-$firstday)*24*3600);
	     
	       $getStartdate=$this->nowTime-$iBackCalc;
		   
		   return date('d.m.Y',$getStartdate);
	}
	
	public function getEndofTheWeek(){
		    	
		    $iForCalc=(6*24*3600);
		    $getEnddate=strtotime($this->getStartofTheWeek())+$iForCalc;
		   
		   return date('d.m.Y',$getEnddate);
	}
	
	public function getStartDayDB($iTime){
   	   
	   return date('Y-m-d 00:00:00',$iTime);
   }
   
   public function getEndDayDB($iTime){
   	   
	   return date('Y-m-d 23:59:59',$iTime);
   }
   
	public function checkAlarm() {

		 $getStartdate=strtotime($this->getStartofTheWeek());
		 $getEnddate=strtotime($this->getEndofTheWeek());
		 $start=$this->getStartDayDB($getStartdate);
		 $end=$this->getEndDayDB($getEnddate);
		
		$addWhereSql = '';

		$aExec = array('1', 'VJOURNAL');

		foreach ($this->aCalendars as $calInfo) {
			if ($addWhereSql == '') {
				$addWhereSql = "`calendarid` = ? ";
				array_push($aExec, $calInfo['id']);
			} else {
				$addWhereSql .= "OR `calendarid` = ? ";
				array_push($aExec, $calInfo['id']);
			}
			//\OCP\Util::writeLog('calendar','AlarmDB ID :'.$calInfo['id'] ,\OCP\Util::DEBUG);
		}
		if($addWhereSql!=''){
			$addWhereSql="AND (". $addWhereSql . ") ";
		}

		$stmt = \OCP\DB::prepare( 'SELECT * FROM `*PREFIX*clndr_objects` WHERE `isalarm` = ? AND `objecttype`!= ? '.$addWhereSql.' ' 
		.' AND ((`startdate` >= ? AND `enddate` <= ? AND `repeating` = 0)'
		.' OR (`enddate` >= ? AND `startdate` <= ? AND `repeating` = 0)'
		.' OR (`startdate` <= ? AND `repeating` = 1) )' );
		array_push($aExec, $start, $end, $start, $end,$start);
		$result = $stmt -> execute($aExec);
		$calendarobjects = array();
		while ($row = $result -> fetchRow()) {

			
			
			if($row['repeating']){
				$cachedinperiod = Repeat::get_inperiod_Alarm($row['id'], $start, $end);
				$rowRepeat=array();
				foreach ($cachedinperiod as $cachedevent) {
					$rowRepeat['startdate'] =$cachedevent['startdate'];
					$rowRepeat['enddate'] =$cachedevent['enddate'];
					$rowRepeat['calendardata']=$row['calendardata'];
					$rowRepeat['id'] =$row['id'];
					$rowRepeat['summary'] =$row['summary'];
					$calendarobjects[]=$rowRepeat;
				}
			}
			
			$calendarobjects[] = $row;
		}

		if (is_array($calendarobjects)){
			$this -> parseAlarm($calendarobjects);
		}
		else
			return false;

	}

	public function parseAlarm($aEvents) {

		$factor = 60;

		foreach ($aEvents as $event) {
			$startalarmtime = 0;
			$vMode = '';
			$object = VObject::parse($event['calendardata']);
			
			
			if (isset($object -> VEVENT)) {
				$vevent = $object -> VEVENT;
				$dtstart = $vevent -> DTSTART;
				$vMode = 'event';
			}
			if (isset($object -> VTODO)) {
				$vevent = $object -> VTODO;
				$dtstart = $vevent -> DUE;
				$vMode = 'todo';
			}

			
			 if($event['startdate']!='' && $vMode == 'event'){
			 	$starttimeTmp= new \DateTime($event['startdate'], new \DateTimeZone('UTC'));
				$starttimeTmp -> setTimezone(new \DateTimeZone(self::$tz));
			 	$starttime = $starttimeTmp-> format('d.m.Y H:i');
				
			 }else{
			 	$starttime = $dtstart -> getDateTime() -> format('d.m.Y H:i');
			 }
			
			$startTimeShow=$starttime;
			$starttime = strtotime($starttime);

			if ($vevent -> VALARM) {
				$valarm = $vevent -> VALARM;
				$triggerTime = $valarm -> getAsString('TRIGGER');
				if (stristr($triggerTime, 'PT')) {
					$triggerAlarm = self::parseTrigger($triggerTime);
					$startalarmtime = $starttime + $triggerAlarm;
				} else {
					$triggerDate = $valarm -> TRIGGER;
					if($triggerDate->getValueType()!='DURATION' && $valarm->getAsString('ACTION')=='DISPLAY') {
					
					 $triggerAlarm = $triggerDate -> getDateTime() -> format('d.m.Y H:i');
					 $startalarmtime = strtotime($triggerAlarm);
					}
				}

				$triggerAction = $valarm -> getAsString('ACTION');

			}

			// $checktime=$startalarmtime-$this->nowTime;
			if ($this -> nowTime == $startalarmtime) {
				$userid = Object::getowner($event['id']);
				$link = '';
				$icon='';
				if ($vMode == 'event'){
					$link = \OC::$server->getURLGenerator()->linkToRoute('calendar.page.index') . '#' . urlencode($event['id']);
					$icon='calendar';
				}
				if ($vMode == 'todo'){
					$link = \OC::$server->getURLGenerator()->linkToRoute('aufgaben.page.index') . '#' . urlencode($event['id']);
					$icon='tasks';
				}
				
				$this -> activeAlarms[$event['id']] = array('id' => $event['id'], 'userid' => $userid, 'icon' => $icon, 'link' => $link, 'action' => $triggerAction, 'summary' => $event['summary'], 'startdate' => $startTimeShow );
			}
			//\OCP\Util::writeLog('calendar', 'AlarmCheck Active:' . $event['summary'] . ' -> ' . date('d.m.Y H:i', $startalarmtime) . ' : ' . date('d.m.Y H:i', $this -> nowTime), \OCP\Util::DEBUG);
		}

	}

	public function getAlarms() {
		return $this -> activeAlarms;
	}

	public static function parseTrigger($sTrigger) {
       if(stristr($sTrigger,'TRIGGER')){
	    	$sTrigger=explode('TRIGGER:',$sTrigger);
			$sTrigger=$sTrigger[1];
	   }
		
		$iTriggerTime = 0;

		$minutesCalc = 60;
		$hourCalc = ($minutesCalc * 60);
		$dayCalc = ($hourCalc * 24);

		$TimeCheck = substr($sTrigger, 3, strlen($sTrigger));
		//integer Val
		$alarmTime = substr($TimeCheck, 0, (strlen($TimeCheck) - 1));
		//Minutes, Hour, Days
		$alarmTimeUnit = substr($sTrigger, -1, 1);

		if ($alarmTimeUnit == 'M') {
			$iTriggerTime = ($alarmTime * $minutesCalc);
		}
		if ($alarmTimeUnit == 'H') {
			$iTriggerTime = ($alarmTime * $hourCalc);
		}
		if ($alarmTimeUnit == 'D') {
			$iTriggerTime = ($alarmTime * $dayCalc);
		}

		if (stristr($sTrigger, '-PT')) {
			$iTriggerTime = -$iTriggerTime;
		}

		if (stristr($sTrigger, '+PT')) {
			$iTriggerTime = $iTriggerTime;
		}

		// \OCP\Util::writeLog('calendar','AlarmCheck: -> '.date('H:i',$iTriggerTime).':'.$iTriggerTime ,\OCP\Util::DEBUG);

		return $iTriggerTime;

	}

}
