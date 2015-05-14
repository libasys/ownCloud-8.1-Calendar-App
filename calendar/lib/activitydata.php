<?php
/**
 * Copyright (c) 2012 Georg Ehrke <ownclouddev@georgswebsite.de>
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */
/*
 * This class manages Attendees for calendars
 */
 

namespace OCA\Calendar;

class ActivityData{


/*
	 * Emit Hook add_event_activity  on lib/object.php add()
	 * 
	 *  @params array link, trans_type, summary, cal_user, cal_displayname
	 * **/
	 
     public static function logEventActivity($params,$syncedWithDav=false,$bCal=false){
   			
			$sncDescr='';	
   			if($syncedWithDav){
   				$sncDescr='Syncing per CalDav -> ';
   			}
			$prefixMode='event_';
			$prefixMode1='';
			if($bCal==true){
				$prefixMode='calendar_';
				$prefixMode1='_calendar';
			}
			 if ($params['cal_user'] != \OCP\User::getUser()) {
		 	    
				    $subjParam=array($sncDescr.$params['trans_type'].' '.$params['summary'],\OCP\User::getUser(),$params['cal_displayname']); 
				   \OC::$server->getActivityManager()->publishActivity('calendar', $params['mode'].'_by_other', $subjParam, '', '','', $params['link'],$params['cal_user'], 'shared_event_'.$params['mode'], '');
			}
		 	
		
			$subjParam=array($sncDescr.$params['trans_type'].' '.$params['summary'],$params['cal_displayname']); 	
		 	\OC::$server->getActivityManager()->publishActivity('calendar',  $params['mode'].$prefixMode1.'_self', $subjParam, '', '','', $params['link'], \OCP\User::getUser(), $prefixMode.$params['mode'], '');
			
	
     }
   
    

}