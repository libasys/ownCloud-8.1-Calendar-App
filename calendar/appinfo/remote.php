<?php
/**
 * Copyright (c) 2011 Jakob Sack <mail@jakobsack.de>
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */

 
//OCP\App::checkAppEnabled('calendar');
/*
if(substr(\OC::$server->getRequest()->getRequestUri(),0,strlen(OC_App::getAppWebPath('calendar').'/caldav.php')) == OC_App::getAppWebPath('calendar'). '/caldav.php') {
	$baseuri = OC_App::getAppWebPath('calendar').'/caldav.php';
}*/

// only need authentication apps



// Backends
//$principalBackend = new OCA\Calendar\Connector\Sabre\Principal();

$authBackend = new \OC\Connector\Sabre\Auth();

$principalBackend = new \OC\Connector\Sabre\Principal(
	\OC::$server->getConfig(),
	\OC::$server->getUserManager()
);



$caldavBackend    = new OCA\Calendar\Connector\Sabre\Backend();


	// Root nodes
	$Sabre_CalDAV_Principal_Collection = new \Sabre\CalDAV\Principal\Collection($principalBackend);
	$Sabre_CalDAV_Principal_Collection->disableListing = true; // Disable listening
	
	$calendarRoot = new OCA\Calendar\Connector\Sabre\CalendarRoot($principalBackend, $caldavBackend);
	$calendarRoot->disableListing = true; // Disable listening
	
	$nodes = array(
		$Sabre_CalDAV_Principal_Collection,
		$calendarRoot,
		);
	
	
	// Fire up server
	$server = new \Sabre\DAV\Server($nodes);
	$server->httpRequest->setUrl(\OC::$server->getRequest()->getRequestUri());
	$server->setBaseUri($baseuri);
	// Add plugins
	$defaults = new OC_Defaults();
	$email = 'sebastian.doell@libasys.de';
	//\OCP\Util::writeLog('calendar',' IMIP USE Start: '.$email, \OCP\Util::DEBUG);
	$server->addPlugin(new \Sabre\DAV\Auth\Plugin($authBackend,$defaults->getName()));
	$server->addPlugin(new \Sabre\CalDAV\Plugin());
	$server->addPlugin(new \Sabre\DAVACL\Plugin());
	//$server->addPlugin(new \Sabre\CalDAV\Schedule\Plugin());
//	$server->addPlugin(new \Sabre\DAV\Browser\Plugin(false)); // Show something in the Browser, but no upload
	$server->addPlugin(new \Sabre\CalDAV\ICSExportPlugin());
	$server->addPlugin(new \OC\Connector\Sabre\ExceptionLoggerPlugin('caldav', \OC::$server->getLogger()));
	$server->addPlugin(new \OC\Connector\Sabre\AppEnabledPlugin(
		'calendar',
		\OC::$server->getAppManager()
	));
	
	if($email !== null) {
		$server->addPlugin(
		    new \Sabre\CalDAV\Schedule\IMipPlugin($email)
		);
	}
	
	// And off we go!
	$server->exec();
	
