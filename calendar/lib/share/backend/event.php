<?php
/**
 * Copyright (c) 2012 Bart Visscher <bartv@thisnet.nl>
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */
namespace OCA\Calendar\Share\Backend;

use OCA\Calendar\Object;

class Event implements \OCP\Share_Backend {

	const FORMAT_EVENT = 0;

	private static $event;

	public function isValidSource($itemSource, $uidOwner) {
		self::$event = Object::find($itemSource);
		if (self::$event) {
			return true;
		}
		return false;
	}
    
	 
	public function generateTarget($itemSource, $shareWith, $exclude = null) {
		
		if(!self::$event) {
			self::$event = Object::find($itemSource);
		}
		return self::$event['summary'];
	}

	public function isShareTypeAllowed($shareType) {
	return true;
	}

	public function formatItems($items, $format, $parameters = null) {
		$events = array();
		if ($format == self::FORMAT_EVENT) {
			
			foreach ($items as $item) {
				if(!Object::checkSharedEvent($item['item_source'])){	
				$event = Object::find($item['item_source']);
				
				$event['summary'] = $item['item_target'];
				$event['item_source'] = $item['item_source'];
				$event['privat'] =false;
				$event['shared'] =false;
				$event['isalarm']=$event['isalarm'];
				$event['permissions'] = $item['permissions'];
				//$event['userid'] = $event['userid'];
				$event['orgevent'] =false;
				
				
				$events[] = $event;
				}
			}
		}
		return $events;
	}

}
