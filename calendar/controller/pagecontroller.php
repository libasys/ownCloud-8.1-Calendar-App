<?php
/**
 * ownCloud - Calendar
 *
 * @author Sebastian Doell
 * @copyright 2015 sebastian doell sebastian@libasys.de
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU AFFERO GENERAL PUBLIC LICENSE for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
 
namespace OCA\Calendar\Controller;

use \OCP\AppFramework\Controller;
use \OCP\AppFramework\Http\TemplateResponse;
use \OCP\IRequest;
use \OCP\IL10N;
use \OCP\IConfig;
use \OCA\Calendar\Calendar as CalendarCalendar;

/**
 * Controller class for main page.
 */
class PageController extends Controller {
	
	private $userId;
	private $l10n;
	private $configInfo;
	

	public function __construct($appName, IRequest $request,  $userId, IL10N $l10n, IConfig $settings) {
		parent::__construct($appName, $request);
		$this -> userId = $userId;
		$this->l10n = $l10n;
		$this->configInfo = $settings;
	}
	
	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function index() {
			
		$calendars = CalendarCalendar::allCalendars($this -> userId, false, false);
		
		if( count($calendars) == 0 || (count($calendars) == 1 && $calendars[0]['id']=='birthday_'.$this -> userId)) {
			CalendarCalendar::addDefaultCalendars($this -> userId);
			$calendars = CalendarCalendar::allCalendars($this -> userId, true);
		}	
			
		if($this->configInfo->getUserValue($this->userId, 'calendar', 'currentview', 'month') == "onedayview"){
			$this->configInfo->setUserValue($this->userId, 'calendar', 'currentview', "agendaDay");
		}	
		
		if($this->configInfo->getUserValue($this->userId, 'calendar', 'currentview', 'month') == "oneweekview"){
			$this->configInfo->setUserValue($this->userId, 'calendar', 'currentview', "agendaWeek");
		}
		
		if($this->configInfo->getUserValue($this->userId, 'calendar', 'currentview', 'month') == "onemonthview"){
			$this->configInfo->setUserValue($this->userId, 'calendar', 'currentview', "month");
		}
		
		if($this->configInfo->getUserValue($this->userId, 'calendar', 'currentview', 'month') == "listview"){
			$this->configInfo->setUserValue($this->userId, 'calendar', 'currentview', "list");
		}
		
		if($this->configInfo->getUserValue($this->userId, 'calendar', 'currentview', 'month') == "fourweeksview"){
			$this->configInfo->setUserValue($this->userId, 'calendar', 'currentview', "fourweeks");
		}
		
		
		\OCP\Util::addStyle('calendar', '3rdparty/jquery.miniColors');
		\OCP\Util::addscript('calendar', '3rdparty/jquery.miniColors.min');
		\OCP\Util::addScript('calendar', '3rdparty/fullcalendar');
		\OCP\Util::addStyle('calendar', '3rdparty/fullcalendar');
		\OCP\Util::addStyle('calendar', '3rdparty/fontello/css/animation');
		\OCP\Util::addStyle('calendar', '3rdparty/fontello/css/fontello');
		\OCP\Util::addScript('calendar','jquery.scrollTo.min');
		\OCP\Util::addScript('calendar','timepicker');
		\OCP\Util::addScript("calendar", "3rdparty/jquery.webui-popover");
		
		\OCP\Util::addScript("calendar", "3rdparty/chosen.jquery.min");
		\OCP\Util::addScript('calendar','jquery.nicescroll.min');
		\OCP\Util::addStyle("calendar", "3rdparty/chosen");
		\OCP\Util::addScript('calendar', '3rdparty/tag-it');
		\OCP\Util::addStyle('calendar', '3rdparty/jquery.tagit');
		\OCP\Util::addStyle('calendar', '3rdparty/jquery.webui-popover');
		
		if($this->configInfo->getUserValue($this->userId, 'calendar', 'timezone') == null || $this->configInfo->getUserValue($this->userId, 'calendar', 'timezonedetection') == 'true'){
			\OCP\Util::addScript('calendar', '3rdparty/jstz-1.0.4.min');	
			\OCP\Util::addScript('calendar', 'geo');
		}
		
		\OCP\Util::addScript('calendar', 'calendar');
		\OCP\Util::addScript('calendar','loaderimport');
		\OCP\Util::addStyle('calendar', 'style');
		\OCP\Util::addStyle("calendar", "mobile");
		\OCP\Util::addScript('calendar','jquery.multi-autocomplete');
		\OCP\Util::addScript('core','tags');
		\OCP\Util::addScript('calendar','on-event');
		
		$leftNavAktiv = $this->configInfo->getUserValue($this->userId, 'calendar', 'calendarnav');
		$rightNavAktiv = $this->configInfo->getUserValue($this->userId, 'calendar', 'tasknav');
		
		$pCalendar = '';
		$pHiddenCal = 'class="isHiddenCal"';
		$pButtonCalAktive = '';
		
		if($leftNavAktiv === 'true') {
			$pCalendar = $calendars;	
			$pHiddenCal = '';
			$pButtonCalAktive = 'button-info';
		}
		
		
		$pButtonTaskAktive='';
		$pTaskOutput = '';
		$pRightnavAktiv=$rightNavAktiv;
		$pIsHidden =  'class="isHiddenTask"';
						
		if($rightNavAktiv === 'true' && \OC::$server->getAppManager()->isEnabledForUser('aufgaben')) {
			$allowedCals=[];
			
			foreach($calendars as $calInfo){
				$isAktiv=(int)$calInfo['active'];
				if($this->configInfo->getUserValue($this -> userId, 'calendar', 'calendar_'.$calInfo['id']) !== ''){
					$isAktiv= (int) $this->configInfo->getUserValue($this -> userId, 'calendar', 'calendar_'.$calInfo['id']);
				}
				if($isAktiv === 1){
					$allowedCals[]=$calInfo;
				}	
			}
						
			$cDataTimeLine=new \OCA\Aufgaben\Timeline();
			$cDataTimeLine->setCalendars($allowedCals);
			$taskOutPutbyTime=$cDataTimeLine->generateAddonCalendarTodo();
			
			$paramsList =[
				'taskOutPutbyTime' => $taskOutPutbyTime
			];
			$list = new TemplateResponse('aufgaben', 'calendars.tasks.list', $paramsList, '');
			$pButtonTaskAktive='button-info';
			$pTaskOutput =$list -> render();
			$pIsHidden =  '';
		}
		
		$params = [
			'calendars' => $pCalendar,
			'leftnavAktiv' => $leftNavAktiv,
			'isHiddenCal' => $pHiddenCal,
			'buttonCalAktive' => $pButtonCalAktive,
			'isHidden' => $pIsHidden,
			'buttonTaskAktive' => $pButtonTaskAktive,
			'taskOutput' => $pTaskOutput,
			'rightnavAktiv' =>$pRightnavAktiv,
			'mailNotificationEnabled' => \OC::$server->getAppConfig()->getValue('core', 'shareapi_allow_mail_notification', 'yes'),
			'allowShareWithLink' => \OC::$server->getAppConfig()->getValue('core', 'shareapi_allow_links', 'yes'),
			'mailPublicNotificationEnabled' => \OC::$server->getAppConfig()->getValue('core', 'shareapi_allow_public_notification', 'no'),
			
		];
		
		$csp = new \OCP\AppFramework\Http\ContentSecurityPolicy();
		$csp->addAllowedImageDomain('*');
		
		
		$response = new TemplateResponse('calendar', 'calendar', $params);
		$response->setContentSecurityPolicy($csp);
		

		return $response;
	}
}