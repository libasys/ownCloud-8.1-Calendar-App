<?php
namespace OCA\Calendar\AppInfo;

$app = new Application();
$c = $app->getContainer();
// add an navigation entry
$navigationEntry = function () use ($c) {
	return [
		'id' => $c->getAppName(),
		'order' => 1,
		'name' => $c->query('L10N')->t('Calendar'),
		'href' => $c->query('URLGenerator')->linkToRoute('calendar.page.index'),
		'icon' => $c->query('URLGenerator')->imagePath('calendar', 'calendar.svg'),
	];
};
$c->getServer()->getNavigationManager()->add($navigationEntry);

\OC::$server->getSearch()->registerProvider('OCA\Calendar\Search\Provider');

\OC::$server->getActivityManager()->registerExtension(function() {
		return new \OCA\Calendar\Activity();
});

\OCA\Calendar\Hooks::register();

\OCP\Util::addScript('calendar','alarm');
\OCP\Util::addScript('calendar','loaderimport');
\OCP\Util::addStyle('calendar', '3rdparty/jquery.miniColors');
\OCP\Util::addscript('calendar', '3rdparty/jquery.miniColors.min');
