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


use \OCA\Calendar\App as CalendarApp;
use \OCA\Calendar\Calendar as CalendarCalendar;
use \OCA\Calendar\VObject;
use \OCA\Calendar\Object;

use \OCP\AppFramework\Controller;
use \OCP\AppFramework\Http\JSONResponse;
use \OCP\AppFramework\Http\DataDownloadResponse;
use \OCP\IRequest;
use \OCP\Share;
use \OCP\IConfig;

class ExportController extends Controller {

	private $userId;
	private $l10n;
	private $configInfo;

	public function __construct($appName, IRequest $request, $userId, $l10n, IConfig $settings) {
		parent::__construct($appName, $request);
		$this -> userId = $userId;
		$this->l10n = $l10n;
		$this->configInfo = $settings;
	}
	
	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function exportEvents(){
		$token = $this -> params('t');	
		$calid = null;
		$eventid = null;
		
		if (isset($token)) {
				
			$linkItem = \OCP\Share::getShareByToken($token, false);
			if (is_array($linkItem) && isset($linkItem['uid_owner'])) {
				$rootLinkItem = \OCP\Share::resolveReShare($linkItem);
				
				if (isset($rootLinkItem['uid_owner'])) {
					\OCP\JSON::checkUserExists($rootLinkItem['uid_owner']);	
					if($linkItem['item_type']=='calendar'){
						$calid=$linkItem['item_source'];
					}
					if($linkItem['item_type']=='event' || $linkItem['item_type']=='todo'){
						$eventid=$linkItem['item_source'];
					}
				}
			}
			
		}
		else{
			if (\OCP\User::isLoggedIn()) {
				
				$calid = $this -> params('calid');
				$eventid = $this -> params('eventid');
				
				
			}
		}
		
		if(!is_null($calid)) {
			$calendar = CalendarApp::getCalendar($calid, true);
			if(!$calendar) {
				$params = [
				'status' => 'error',
				];
				$response = new JSONResponse($params);
				return $response;
			}
			
			$name = str_replace(' ', '_', $calendar['displayname']) . '.ics';
			$calendarEvents = \OCA\Calendar\Export::export($calid, \OCA\Calendar\Export::CALENDAR);
			
			$response = new DataDownloadResponse($calendarEvents, $name, 'text/calendar');
			
			return $response;	
				
		}
		if(!is_null($eventid)) {
			$data = CalendarApp::getEventObject($eventid, false);
			if(!$data) {
				$params = [
				'status' => 'error',
				];
				$response = new JSONResponse($params);
				return $response;
			}
			
			$name = str_replace(' ', '_', $data['summary']) . '.ics';
			$singleEvent = \OCA\Calendar\Export::export($eventid, \OCA\Calendar\Export::EVENT);
			
			$response = new DataDownloadResponse($singleEvent, $name, 'text/calendar');
			
			return $response;	
			
		}
		
	}
}