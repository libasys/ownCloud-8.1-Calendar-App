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
			\OCP\Util::connectHook('OCP\Share', 'share_internal_mail', 'OCA\Calendar\Hooks', 'shareInternalMail');
			\OCP\Util::connectHook('OC_Calendar', 'addEvent', '\OCA\Calendar\Repeat', 'generate');
			\OCP\Util::connectHook('OC_Calendar', 'editEvent', '\OCA\Calendar\Repeat', 'update');
			\OCP\Util::connectHook('OC_Calendar', 'deleteEvent', '\OCA\Calendar\Repeat', 'clean');
			\OCP\Util::connectHook('OC_Calendar', 'moveEvent', '\OCA\Calendar\Repeat', 'update');
			\OCP\Util::connectHook('OC_Calendar', 'deleteCalendar', '\OCA\Calendar\Repeat', 'cleanCalendar');
			
			
	   }
	
	
	
	 public static function addTranslation($parameters) {
	 	    	
			$preparedParams = \OCA\Activity\ParameterHelper::prepareParameters(
				$parameters['language'], $parameters['text'],
				$parameters['parameters'], \OCA\Activity\ParameterHelper::getSpecialParameterList('calendar', $parameters['text']),
				false, $parameters['highlight']
			);	
				
	 	    switch ($parameters['text']) {
				case 'created_self':
					$parameters['translation']=$parameters['language']->t('You created a %1$s on calendar %2$s',$preparedParams);
				break;
				case 'edited_self':
					$parameters['translation']=$parameters['language']->t('You edited a %1$s on calendar %2$s',$preparedParams);
				break;
				case 'deleted_self':
					$parameters['translation']=$parameters['language']->t('You deleted a %1$s on calendar %2$s',$preparedParams);
				break;
				case 'shared_link_self_calendar':
					$parameters['translation']=$parameters['language']->t('You shared %1$s via Link',$preparedParams);
				break;
				case 'unshared_link_self_calendar':
					$parameters['translation']=$parameters['language']->t('You unshared %1$s via Link',$preparedParams);
				break;
				case 'shared_user_self_calendar':
					$parameters['translation']=$parameters['language']->t('You shared %1$s with %2$s',$preparedParams);
				break;
				case 'unshared_user_self_calendar':
					$parameters['translation']=$parameters['language']->t('You unshared %1$s with %2$s',$preparedParams);
				break;
				case 'shared_group_self_calendar':
					$parameters['translation']=$parameters['language']->t('You shared %1$s with group %2$s',$preparedParams);
				break;
				case 'unshared_group_self_calendar':
					$parameters['translation']=$parameters['language']->t('You unshared %1$s with group %2$s',$preparedParams);
				break;
				case 'shared_with_by_calendar':
					$parameters['translation']=$parameters['language']->t('%2$s shared %1$s with you',$preparedParams);
				break;
				case 'unshared_with_by_calendar':
					$parameters['translation']=$parameters['language']->t('%2$s unshared %1$s with you',$preparedParams);
				break;
				case 'created_by_other':
					$parameters['translation']=$parameters['language']->t('A new %1$s from %2$s in shared calendar %3$s created',$preparedParams);
				break;
				case 'edited_by_other':
					$parameters['translation']=$parameters['language']->t('A %1$s from %2$s in shared calendar %3$s edited',$preparedParams);
				break;
				case 'deleted_by_other':
					$parameters['translation']=$parameters['language']->t('A %1$s from %2$s in shared calendar %3$s deleted',$preparedParams);
				break;
				}
		return true;
	 }

      /*
	   * $hookParams = array(
				'language'      => $this->l,
	             'senderDisplayName'      => $this->senderDisplayName,
				'itemSource'      => $itemSource,
				'itemType'      => $itemType,
				'itemTarget'      => $items[0]['item_target'],
				'itemExpDate'      => $items[0]['expiration'],
				'itemLink'    => &$link,
				'filename'    => &$filename,
				'subject'    => &$subject,
				'expiration' => &$expiration,
		     );*/
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

	  /**Get the new Notify Types additional lang must defined inactivity/l10n **/
	 
	 public static function addNotifyType($parameters) {
		
		$aNewNotifyTyp=array(
		
		'shared_event_created'=>$parameters['language']->t('A event or todo has been <strong>created</strong> on a shared Calendar'),
		'shared_event_edited'=>$parameters['language']->t('A event or todo has been <strong>edited</strong> on a shared Calendar'),
		'shared_event_deleted'=>$parameters['language']->t('A event or todo has been <strong>deleted</strong> on a shared Calendar'),
		'shared_calendar'=>$parameters['language']->t('A event, todo or calendar has been <strong>shared</strong>'),
		'unshared_calendar'=>$parameters['language']->t('A event, todo or calendar has been <strong>unshared</strong>'),
		'event_created'=>$parameters['language']->t('A event or todo has been <strong>created</strong>'),
		'event_edited'=>$parameters['language']->t('A event or todo has been <strong>edited</strong>'),
		'event_deleted'=>$parameters['language']->t('A event or todo has been <strong>deleted</strong>'),
		);
		
		$parameters['types']=array_merge($aNewNotifyTyp,$parameters['types']);
		
		return true;
		
	}
	 
	 public static function groupParameter($parameters) {
	 	
		//\OCP\Util::writeLog('calendar','HOOKS groupParameter->'.$parameters['activity']['subject'], \OCP\Util::DEBUG);	
		
		switch ($parameters['activity']['subject']) {
				case 'shared_user_self_calendar':
				case 'shared_group_self_calendar':
				case 'unshared_user_self_calendar':
				case 'unshared_group_self_calendar':
					$parameters['parameter']=0;
					break;
			
			}

		return true;
	 }
	 
	  /**Get the new CSS Class of the new IconType musst be defined in activity/css/styles.css**/
	 public static function addIconType($parameters) {
			
		switch($parameters['type']){
			case 'shared_calendar':
			case 'unshared_calendar':
				$parameters['icon']= 'icon-share';
			break;
			case 'event_created':
			case 'shared_event_created':
				$parameters['icon']= 'icon-info';
			break;
			case 'event_edited':
			case 'shared_event_edited':
				$parameters['icon']= 'icon-info-edit';
			break;
			case 'event_deleted':
			case 'shared_event_deleted':
				$parameters['icon']= 'icon-info-delete';
			break;			
		}	
		
		return true;
		
	}
	  /**Filter for sharees calendar**/
	 public static function filterType($parameters) {
			
		      switch ($parameters['filter']) {
			     case 'sharescal':
					$check= array_intersect(array(
						'shared_calendar',
					), $parameters['types']);
					 $parameters['types']=$check;
					break;
				 case 'unsharescal':
					$check= array_intersect(array(
						'unshared_calendar',
					), $parameters['types']);
					 $parameters['types']=$check;
					break;	
		       }
					
		
		
		return true;
		
	}
	 /**Needed Filter to allow access musst be the same like the id in getNavigation()**/
	 public static function getFilterParam($parameters) {
			
		$typeFilter=$parameters['paramName'];
		if(array_key_exists($parameters['paramName'], $_GET)){
			$typeFilter=$_GET[$parameters['paramName']];
		}	
		switch ($typeFilter) {
			case 'calendar':
				$parameters['filter']= 'calendar';
			break;
			case 'sharescal':
				$parameters['filter']= 'sharescal';
			break;
			case 'unsharescal':
				$parameters['filter']= 'unsharescal';
			break;
				
		}	
		
		return true;
		
	}
    
	/**Additional Database Filter**/
	
	 public static function getFilter($parameters) {
			switch ($parameters['filter']) {
			case 'calendar':
				$parameters['limitActivities'] .= ' AND `app` = ?';
				$parameters['parameters'][]='calendar';
				
			break;
				
		}	
		
		return true;
		
	}

     /**Additional Navigation Entrees**/
    public static function getNavigation($parameters) {
	   $l =  \OC::$server->getL10N('calendar');
	   		
				$newEntree=array(
					'id' => 'calendar',
					'name' => $l->t('calendar'),
					'url' => \OCP\Util::linkToAbsolute('activity', 'index.php', array('filter' => 'calendar')),
							);
					
				$newEntree1=array(
					'id' => 'sharescal',
					'name' => $l->t('Sharees').' '.$l->t('calendar'),
					'url' => \OCP\Util::linkToAbsolute('activity', 'index.php', array('filter' => 'sharescal')),
				);
				$newEntree2=array(
					'id' => 'unsharescal',
					'name' => 'Aufgehobene '.$l->t('Sharees').' '.$l->t('calendar'),
					'url' => \OCP\Util::linkToAbsolute('activity', 'index.php', array('filter' => 'unsharescal')),
				);		
			$parameters['entries']['apps'][]=$newEntree;
			$parameters['entries']['apps'][]=$newEntree1;
			$parameters['entries']['apps'][]=$newEntree2;
		
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
		
			if($params['itemType']!=='file' && $params['itemType']!=='folder' && $params['shareType']!==2){
				self::prepareActivityLog($params);
			}	
			
		
	}


     /**
	 * @brief Manage sharing events
	 * @param array $params The hook params
	 */
	public static function unshare($params) {
		
			if($params['itemType']!=='file' && $params['itemType']!=='folder'){
				self::prepareUnshareActivity($params);
			}	
			
		
	}    
	
    public static function prepareUnshareActivity($unshareData){
    	  
		    $l =  \OC::$server->getL10N('calendar');
			$type='unshared_calendar';
			
			if($unshareData['shareType']===\OCP\Share::SHARE_TYPE_LINK){
				
				$description='';	
					    
						 if($unshareData['itemType']=='calendar'){
							$aCalendar=Calendar::find($unshareData['itemSource']);	
							 $description=$l->t('calendar').' '.$aCalendar['displayname'];
					     }else{
					     	$aObject=Object::find($unshareData['itemSource']);
							$aCalendar=Calendar::find($aObject['calendarid']);
							$description=$l->t($unshareData['itemType']).' '.$aObject['summary'].' ('.$l->t('calendar').' '.$aCalendar['displayname'].')';
					     }
	
					
					\OC::$server->getActivityManager()->publishActivity('calendar','unshared_link_self_calendar', array($description), '', '','', '', \OCP\User::getUser(), $type, '');	
			
			}
			
			if($unshareData['shareType']===\OCP\Share::SHARE_TYPE_USER){

                   $description='';	
					   if($unshareData['itemType']=='event' || $unshareData['itemType']=='todo'){
							$aObject=Object::find($unshareData['itemSource']);
							$aCalendar=Calendar::find($aObject['calendarid']);	
							$description=$aObject['summary'].' ('.$l->t('calendar').' '.$aCalendar['displayname'].')';
						}
						if($unshareData['itemType']=='calendar'){
							$aCalendar=Calendar::find($unshareData['itemSource']);
							$description=$aCalendar['displayname'];
						}
					\OC::$server->getActivityManager()->publishActivity('calendar','unshared_user_self_calendar', array($l->t($unshareData['itemType']).' '.$description,$unshareData['shareWith']), '', '','', '', \OCP\User::getUser(), $type, '');	
				
					$description='';	
						if($unshareData['itemType']=='event' || $unshareData['itemType']=='todo'){
							
							$aObject=Object::find($unshareData['itemSource']);
							$aCalendar=Calendar::find($aObject['calendarid']);	
							$description=$aObject['summary'].' ('.$l->t('calendar').' '.$aCalendar['displayname'].')';
						}
						if($unshareData['itemType']=='calendar'){
							$aCalendar=Calendar::find($unshareData['itemSource']);
							$description=$aCalendar['displayname'];
						}
						
						\OC::$server->getActivityManager()->publishActivity('calendar','unshared_with_by_calendar', array($l->t($unshareData['itemType']).' '.$description,\OCP\User::getUser()), '', '','', '', $unshareData['shareWith'], $type, '');	
				
					
			}

           if($unshareData['shareType']===\OCP\Share::SHARE_TYPE_GROUP){
           	
				$description='';	
				   	   if($unshareData['itemType']=='event' || $unshareData['itemType']=='todo'){
							$aObject=Object::find($unshareData['itemSource']);
							$aCalendar=Calendar::find($aObject['calendarid']);	
							$description=$aObject['summary'].' ('.$l->t('calendar').' '.$aCalendar['displayname'].')';
						}
						if($unshareData['itemType']=='calendar'){
							$aCalendar=Calendar::find($unshareData['itemSource']);
							$description=$aCalendar['displayname'];
						}
					
				\OC::$server->getActivityManager()->publishActivity('calendar','unshared_group_self_calendar', array($l->t($unshareData['itemType']).' '.$description,$unshareData['shareWith']), '', '','', '', \OCP\User::getUser(), $type, '');	
					
					
				$usersInGroup = \OC_Group::usersInGroup($unshareData['shareWith']);
				
				$descriptionShare='';	
				if($unshareData['itemType']=='event' || $unshareData['itemType']=='todo'){
					$aObject=Object::find($unshareData['itemSource']);
					$aCalendar=Calendar::find($aObject['calendarid']);	
					$descriptionShare=$aObject['summary'].' ('.$l->t('calendar').' '.$aCalendar['displayname'].')';
				}
				if($unshareData['itemType']=='calendar'){
					$aCalendar=Calendar::find($unshareData['itemSource']);
					$descriptionShare=$aCalendar['displayname'];
				}
					
				foreach ($usersInGroup as $user) {
						\OC::$server->getActivityManager()->publishActivity('calendar','unshared_with_by_calendar', array($l->t($unshareData['itemType']).' '.$descriptionShare,\OCP\User::getUser()), '', '','', '', $user, $type, '');
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
			
			if($shareData['token']!=='' && $shareData['shareType']===\OCP\Share::SHARE_TYPE_LINK){
				$link=\OCP\Util::linkTo('', 'public.php').'?service='.$shareData['itemType'].'&t='.$shareData['token'];
				
					\OC::$server->getActivityManager()->publishActivity($sApp,'shared_link_self_'.$sApp, array($l->t($shareData['itemType']).' '.$shareData['itemTarget']), '', '','', $link, \OCP\User::getUser(), $type, '');	
			}
			
			if($shareData['shareType'] == \OCP\Share::SHARE_TYPE_USER){
				$link='';
				if($shareData['itemType']==='todo'){
					$link=\OCP\Util::linkTo('aufgaben', 'index.php').'#'.$shareData['itemSource'];
				}
				if($shareData['itemType']==='event'){
					$link=\OCP\Util::linkTo('calendar', 'index.php').'#'.$shareData['itemSource'];
				}
				$description=$shareData['itemTarget'];
				if($shareData['itemType']==='todo' || $shareData['itemType']==='event'){
					 $aObject=Object::find($shareData['itemSource']);
					 $aCalendar=Calendar::find($aObject['calendarid']);	
					 $description=$aObject['summary'].' ('.$l->t('calendar').' '.$aCalendar['displayname'].')';
				}
					
				 	\OC::$server->getActivityManager()->publishActivity($sApp,'shared_user_self_'.$sApp, array($l->t($shareData['itemType']).' '.$description,$shareData['shareWith']), '', '','', $link, \OCP\User::getUser(), $type, '');
			
					\OC::$server->getActivityManager()->publishActivity($sApp,'shared_with_by_'.$sApp, array($l->t($shareData['itemType']).' '.$description,\OCP\User::getUser()), '', '','', $link, $shareData['shareWith'], $type, '');
				
				
			}
			
			if($shareData['shareType'] == \OCP\Share::SHARE_TYPE_GROUP){
				
				$link='';
				if($shareData['itemType']==='todo'){
					$link=\OCP\Util::linkTo('aufgaben', 'index.php').'#'.$shareData['itemSource'];
				}
				if($shareData['itemType']==='event'){
					$link=\OCP\Util::linkTo('calendar', 'index.php').'#'.$shareData['itemSource'];
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
