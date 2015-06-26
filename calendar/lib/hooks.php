<?php
/**
 * Copyright (c) 2014 Sebastian Doell <sebastian.doell@libasys.de>
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */

/**
 * This class contains all hooks.
 */
 namespace OCA\Calendar;
 
class Hooks{
	
	
	   public static function register() {
	   			
			
			\OCP\Share::registerBackend('calendar', '\OCA\Calendar\Share\Backend\Calendar');
			\OCP\Share::registerBackend('event', '\OCA\Calendar\Share\Backend\Event');

		  	\OCP\Util::connectHook('OC_User', 'post_createUser', 'OCA\Calendar\Hooks', 'createUser');
			\OCP\Util::connectHook('OC_User', 'post_deleteUser', 'OCA\Calendar\Hooks', 'deleteUser');
		
			\OCP\Util::connectHook('OCP\Share', 'post_shared', 'OCA\Calendar\Hooks', 'share');
			\OCP\Util::connectHook('OCP\Share', 'post_unshare', 'OCA\Calendar\Hooks', 'unshare');
	//		\OCP\Util::connectHook('OCP\Share', 'share_internal_mail', 'OCA\Calendar\Hooks', 'shareInternalMail');
			\OCP\Util::connectHook('OC_Calendar', 'addEvent', '\OCA\Calendar\Repeat', 'generate');
			\OCP\Util::connectHook('OC_Calendar', 'editEvent', '\OCA\Calendar\Repeat', 'update');
			\OCP\Util::connectHook('OC_Calendar', 'deleteEvent', '\OCA\Calendar\Repeat', 'clean');
			\OCP\Util::connectHook('OC_Calendar', 'moveEvent', '\OCA\Calendar\Repeat', 'update');
			\OCP\Util::connectHook('OC_Calendar', 'deleteCalendar', '\OCA\Calendar\Repeat', 'cleanCalendar');
			
			
	   }
	
	
	
	
   
     public static function shareInternalMail($params){
     	 
		  $aTypeArray=array('calendar'=>'Kalender','event'=>'Termin','todo'=>'Aufgabe');
		
		if(array_key_exists($params['itemType'],$aTypeArray)){
			$itemname = $aTypeArray[$params['itemType']].' '.trim($params['itemTarget'], '/');	
			$params['subject'] = (string) $params['language']->t('%s shared »%s« with you', array($params['senderDisplayName'], $itemname));
		
		
		  $params['filename'] = trim($params['itemTarget'], '/');	
		
		   if($params['itemType']=='calendar'){
				$params['itemLink'] = '';
			}
			
			if($params['itemType']=='event'){
				$params['itemLink'] = \OCP\Util::linkToAbsolute('index.php/apps/calendar', '#'.$params['itemSource']);
			}
			
			if($params['itemType']=='todo'){
				$params['itemLink'] = \OCP\Util::linkToAbsolute('index.php/apps/aufgaben', '#'.$params['itemSource']);
			}
		
		}
		
		return true;
     }

 
	public static function createUser($parameters) {
		Calendar::addDefaultCalendars($parameters['uid']);

		return true;
	}

	/**
	 * @brief Deletes all calendars of a certain user
	 * @param paramters parameters from postDeleteUser-Hook
	 * @return array
	 */
	public static function deleteUser($parameters) {
		$calendars = Calendar::allCalendars($parameters['uid']);

		foreach($calendars as $calendar) {
			if($parameters['uid'] === $calendar['userid']) {
				Calendar::deleteCalendar($calendar['id']);
			}
		}

		return true;
	}
	
	/**
	 * @brief Manage sharing events
	 * @param array $params The hook params
	 */
	public static function share($params) {
		
			if(($params['itemType'] === 'calendar' || $params['itemType'] === 'event' || $params['itemType'] === 'todo') && $params['shareType']!==2){
				self::prepareActivityLog($params);
			}	
			
		
	}


     /**
	 * @brief Manage sharing events
	 * @param array $params The hook params
	 */
	public static function unshare($params) {
		
			if($params['itemType'] === 'calendar' || $params['itemType'] === 'event' || $params['itemType'] === 'todo'){
				self::prepareUnshareActivity($params);
			}	
			
		
	}    
	
    public static function prepareUnshareActivity($unshareData){
    	  
		    $l =  \OC::$server->getL10N('calendar');
			$type='unshared_calendar';
			
			if($unshareData['shareType'] === \OCP\Share::SHARE_TYPE_LINK){
				
			$description='';	
			 $unshareData['itemSource'] = App::validateItemSource($unshareData['itemSource'],$unshareData['itemType'].'-'); 			    
			 
			 if($unshareData['itemType'] === 'calendar'){
				$aCalendar = Calendar::find($unshareData['itemSource']);	
				 $description = $l->t('calendar').' '.$aCalendar['displayname'];
		     }else{
		     	$aObject = Object::find($unshareData['itemSource']);
				$aCalendar = Calendar::find($aObject['calendarid']);
				$description = $l->t($unshareData['itemType']).' '.$aObject['summary'].' ('.$l->t('calendar').' '.$aCalendar['displayname'].')';
		     }
	
					
				\OC::$server->getActivityManager()->publishActivity('calendar','unshared_link_self_calendar', array($description), '', '','', '', \OCP\User::getUser(), $type, '');	
			
			}
			
			if($unshareData['shareType'] === \OCP\Share::SHARE_TYPE_USER){
					
				$unshareData['itemSource'] = App::validateItemSource($unshareData['itemSource'],$unshareData['itemType'].'-');
           		$description='';	
				
			   if($unshareData['itemType'] === 'event' || $unshareData['itemType'] === 'todo'){
					$aObject=Object::find($unshareData['itemSource']);
					$aCalendar=Calendar::find($aObject['calendarid']);	
					$description=$aObject['summary'].' ('.$l->t('calendar').' '.$aCalendar['displayname'].')';
				}
				if($unshareData['itemType'] === 'calendar'){
					$aCalendar=Calendar::find($unshareData['itemSource']);
					$description=$aCalendar['displayname'];
				}
				
				\OC::$server->getActivityManager()->publishActivity('calendar','unshared_user_self_calendar', array($l->t($unshareData['itemType']).' '.$description,$unshareData['shareWith']), '', '','', '', \OCP\User::getUser(), $type, '');	
					
				\OC::$server->getActivityManager()->publishActivity('calendar','unshared_with_by_calendar', array($l->t($unshareData['itemType']).' '.$description,\OCP\User::getUser()), '', '','', '', $unshareData['shareWith'], $type, '');	
					
			}

           if($unshareData['shareType'] === \OCP\Share::SHARE_TYPE_GROUP){
           	
				$description='';	
			   $unshareData['itemSource'] = App::validateItemSource($unshareData['itemSource'],$unshareData['itemType'].'-');
			   
		   	   if($unshareData['itemType'] === 'event' || $unshareData['itemType'] === 'todo'){
					$aObject=Object::find($unshareData['itemSource']);
					$aCalendar=Calendar::find($aObject['calendarid']);	
					$description=$aObject['summary'].' ('.$l->t('calendar').' '.$aCalendar['displayname'].')';
				}
				if($unshareData['itemType'] === 'calendar'){
					$aCalendar=Calendar::find($unshareData['itemSource']);
					$description=$aCalendar['displayname'];
				}
					
				\OC::$server->getActivityManager()->publishActivity('calendar','unshared_group_self_calendar', array($l->t($unshareData['itemType']).' '.$description,$unshareData['shareWith']), '', '','', '', \OCP\User::getUser(), $type, '');	
					
				$usersInGroup = \OC_Group::usersInGroup($unshareData['shareWith']);
					
				foreach ($usersInGroup as $user) {
						\OC::$server->getActivityManager()->publishActivity('calendar','unshared_with_by_calendar', array($l->t($unshareData['itemType']).' '.$description,\OCP\User::getUser()), '', '','', '', $user, $type, '');
				}
					
           }
    }
	
	
	
	public static function prepareActivityLog($shareData){
   		
         $aApp=array('calendar'=>'calendar','event'=>'calendar','todo'=>'calendar');
   		//shared_with_by, shared_user_self,shared_group_self,shared_link_self
  	   		
			if(array_key_exists($shareData['itemType'], $aApp)){
				
				$sApp=$aApp[$shareData['itemType']];
				
				$l =  \OC::$server->getL10N($sApp);
				
				$type='shared_'.$sApp;
				
				if($shareData['token'] !=='' && $shareData['shareType'] === \OCP\Share::SHARE_TYPE_LINK){
						
					$shareData['itemSource'] = App::validateItemSource($shareData['itemSource'],$shareData['itemType'].'-'); 
						
					if($shareData['itemType'] === 'event' || $shareData['itemType'] === 'calendar'){	
						$link = \OC::$server->getURLGenerator()->linkToRoute('calendar.public.index',['token' => $shareData['token']]);	
					}

					if($shareData['itemType'] === 'todo'){	
						$link = \OC::$server->getURLGenerator()->linkToRoute('aufgaben.public.index',['token' => $shareData['token']]);	
					}
					if($shareData['itemType'] === 'event' || $shareData['itemType'] === 'todo'){
						$aObject=Object::find($shareData['itemSource']);
						$aCalendar=Calendar::find($aObject['calendarid']);	
						$description = $l->t($shareData['itemType']).' '.$aObject['summary'].' ('.$l->t('calendar').' '.$aCalendar['displayname'].')';
					}else{
						$description = $l->t($shareData['itemType']).' '.$shareData['itemTarget'];
					}
					\OC::$server->getActivityManager()->publishActivity($sApp,'shared_link_self_'.$sApp, array($description), '', '','', $link, \OCP\User::getUser(), $type, '');	
				}
				
				if($shareData['shareType'] === \OCP\Share::SHARE_TYPE_USER){
					$link='';
					$shareData['itemSource'] = App::validateItemSource($shareData['itemSource'],$shareData['itemType'].'-'); 	
					if($shareData['itemType'] === 'todo'){
						$link = \OC::$server->getURLGenerator()->linkToRoute('aufgaben.page.index').'#'.urlencode($shareData['itemSource']);
					}
					if($shareData['itemType'] === 'event'){
						$link = \OC::$server->getURLGenerator()->linkToRoute('calendar.page.index').'#'.urlencode($shareData['itemSource']);
					}
					$description=$shareData['itemTarget'];
					if($shareData['itemType']=== 'todo' || $shareData['itemType'] === 'event'){
						 $aObject=Object::find($shareData['itemSource']);
						 $aCalendar=Calendar::find($aObject['calendarid']);	
						 $description=$aObject['summary'].' ('.$l->t('calendar').' '.$aCalendar['displayname'].')';
					}
						
					 	\OC::$server->getActivityManager()->publishActivity($sApp,'shared_user_self_'.$sApp, array($l->t($shareData['itemType']).' '.$description,$shareData['shareWith']), '', '','', $link, \OCP\User::getUser(), $type, '');
				
						\OC::$server->getActivityManager()->publishActivity($sApp,'shared_with_by_'.$sApp, array($l->t($shareData['itemType']).' '.$description,\OCP\User::getUser()), '', '','', $link, $shareData['shareWith'], $type, '');
					
				}
				
				if($shareData['shareType'] === \OCP\Share::SHARE_TYPE_GROUP){
					
					$link='';
					$shareData['itemSource'] = App::validateItemSource($shareData['itemSource'],$shareData['itemType'].'-'); 	
		
					if($shareData['itemType'] === 'todo'){
						$link = \OC::$server->getURLGenerator()->linkToRoute('aufgaben.page.index').'#'.urlencode($shareData['itemSource']);
					}
					if($shareData['itemType'] === 'event'){
						$link = \OC::$server->getURLGenerator()->linkToRoute('calendar.page.index').'#'.urlencode($shareData['itemSource']);

					}
					
					$description=$shareData['itemTarget'];
					if($shareData['itemType']==='todo' || $shareData['itemType']==='event'){
						 $aObject=Object::find($shareData['itemSource']);
						 $aCalendar=Calendar::find($aObject['calendarid']);	
						 $description=$aObject['summary'].' ('.$l->t('calendar').' '.$aCalendar['displayname'].')';
					}
				
					\OC::$server->getActivityManager()->publishActivity($sApp,'shared_group_self_'.$sApp, array($l->t($shareData['itemType']).' '.$description,$shareData['shareWith']), '', '','', $link, \OCP\User::getUser(), $type, '');
				
					$usersInGroup = \OC_Group::usersInGroup($shareData['shareWith']);
						
					foreach ($usersInGroup as $user) {
							\OC::$server->getActivityManager()->publishActivity($sApp,'shared_with_by_'.$sApp, array($l->t($shareData['itemType']).' '.$description,\OCP\User::getUser()), '', '','', $link, $user, 'shared_'.$sApp, '');
					}
				}
			}
		
		
    }
  

   public static function prepareUserDisplayOutput($sUser){
   	      $displayName = \OCP\User::getDisplayName($sUser);
		  $sUser = \OCP\Util::sanitizeHTML($sUser);
		  $displayName = \OCP\Util::sanitizeHTML($displayName);
		  return '<div class="avatar" data-user="' . $sUser . '"></div><strong>' . $displayName . '</strong>';

   }
	
}
