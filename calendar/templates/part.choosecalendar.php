
<input type="hidden" name="mailNotificationEnabled" id="mailNotificationEnabled" value="<?php p($_['mailNotificationEnabled']) ?>" />
<input type="hidden" name="allowShareWithLink" id="allowShareWithLink" value="<?php p($_['allowShareWithLink']) ?>" />

	
	<p><b><?php p($l->t('Your calendars')); ?>:</b></p>
	<table id="calendarList" width="100%" style="border: 0;">
	<?php
	$option_calendars = OCA\Calendar\Calendar::allCalendars(OCP\USER::getUser());
	$mySharees=OCA\Calendar\Object::getCalendarSharees();
	$isShareApiActive=\OC::$server->getAppConfig()->getValue('core', 'shareapi_enabled', 'yes');
	
	for($i = 0; $i < count($option_calendars); $i++) {
		print_unescaped("<tr data-id='".\OCP\Util::sanitizeHTML($option_calendars[$i]['id'])."' data-calname='".\OCP\Util::sanitizeHTML($option_calendars[$i]['displayname'])."'>");
		$tmpl = new OCP\Template('calendar', 'part.choosecalendar.rowfields');
		$tmpl->assign('calendar', $option_calendars[$i]);
		$shared = false;
		
		if(isset($mySharees[$option_calendars[$i]['id']]) && $mySharees[$option_calendars[$i]['id']]) $shared = true;
		
		$tmpl->assign('shared', $shared);
		$tmpl -> assign('isShareApi', $isShareApiActive);
		$tmpl->printpage();
		print_unescaped("</tr>");
	}
	?>
	<tr class="treditcal">
		<td colspan="6">
			<input type="button" value="<?php p($l->t('New Calendar')) ?>" id="newCalendar" />
		</td>
	</tr>
	<tr>
		<td colspan="6">
			<p style="margin: 0 auto;width: 90%;"><input style="display:none;width: 90%;float: left;" type="text" id="caldav_url" title="<?php p($l->t("CalDav Link")); ?>"><img id="caldav_url_close" style="height: 20px;vertical-align: middle;display: none;" src="<?php p(OCP\Util::imagePath('core', 'actions/delete.svg')) ?>" alt="close"/></p>
		</td>
	</tr>
	</table><br>
	</fieldset>

