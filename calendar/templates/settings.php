<?php
/**
 * Copyright (c) 2011 Bart Visscher <bartv@thisnet.nl>
 * Copyright (c) 2012 Georg Ehrke <ownclouddev at georgswebsite dot de>
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */

?>
<div id="calendarSettingsContainer">
<input type="hidden" name="mailNotificationEnabled" id="mailNotificationEnabled" value="<?php p($_['mailNotificationEnabled']) ?>" />
<input type="hidden" name="allowShareWithLink" id="allowShareWithLink" value="<?php p($_['allowShareWithLink']) ?>" />
<input type="hidden" name="mailPublicNotificationEnabled"  value="<?php p($_['mailPublicNotificationEnabled']) ?>" />

<h2 ><?php p($l->t('Your calendars')); ?></h2>
<div id="myCalendarsList" class="settings-div">
	<table id="calendarList" width="100%" style="border: 0;">
	<?php
	$option_calendars = $_['calendars'];
	$mySharees=$_['mySharedCalendars'];
	$isShareApiActive= $_['isShareApiActive'];
	
	for($i = 0; $i < count($option_calendars); $i++) {
		print_unescaped("<tr data-id='".\OCP\Util::sanitizeHTML($option_calendars[$i]['id'])."' data-calname='".\OCP\Util::sanitizeHTML($option_calendars[$i]['displayname'])."'>");
		$tmpl = new OCP\Template('calendar', 'part.choosecalendar.rowfields');
		$tmpl->assign('calendar', $option_calendars[$i]);
		
		$shared = false;
		
		if(isset($mySharees[$option_calendars[$i]['id']]) && $mySharees[$option_calendars[$i]['id']]){
			 $shared = true;
		}
		
		$tmpl->assign('shared', $shared);
		$tmpl -> assign('isShareApi', $isShareApiActive);
		$tmpl->printpage();
		print_unescaped("</tr>");
	}
	?>
	<tr>
		<td colspan="6">
			<input type="button" value="<?php p($l->t('New Calendar')) ?>" id="newCalendar" />
		</td>
	</tr>
	<tr>
		<td colspan="6">
			<p style="margin: 0 auto;width: 90%;">
				<input style="display:none;width: 90%;float: left;" type="text" id="caldav_url" title="<?php p($l->t("CalDav Link")); ?>">
				<img id="caldav_url_close" style="height: 20px;vertical-align: middle;display: none;" src="<?php p(OCP\Util::imagePath('core', 'actions/delete.svg')) ?>" alt="close"/>
			</p>
		</td>
	</tr>
	</table>
	</div>
<h2 id="title_general"><?php p($l->t('General')); ?></h2>
<div id="general" class="settings-div">
	<table class="nostyle">
		<tr>
			<td>
				<label for="timezone" class="bold"><?php p($l->t('Timezone'));?></label>
				&nbsp;&nbsp;
			</td>
			<td>
				<select style="display: none;" id="timezone" name="timezone">
				<?php
				$continent = '';
				foreach($_['timezones'] as $timezone):
					$ex=explode('/', $timezone, 2);//obtain continent,city
					//19810329T020000
					$dateOffset=new \DateTime(date('Ymd\THis'), new \DateTimeZone($timezone));
					$offsetTime= $dateOffset->format('O') ;
					if (!isset($ex[1])) {
						$ex[1] = $ex[0];
						$ex[0] = "Other";
					}
					if ($continent!=$ex[0]):
						if ($continent!="") print_unescaped('</optgroup>');
						print_unescaped('<optgroup label="'.\OCP\Util::sanitizeHTML($ex[0]).'">');
					endif;
					$city=strtr($ex[1], '_', ' ');
					$continent=$ex[0];
					print_unescaped('<option value="'.\OCP\Util::sanitizeHTML($timezone).'"'.($_['timezone'] == $timezone?' selected="selected"':'').'>'.\OCP\Util::sanitizeHTML($city.' ('.$offsetTime.')').'</option>');
				endforeach;?>
				</select>
				<br /><span class="msg msgTz"></span>
			</td>
		</tr>
		<tr>
			<td>
				&nbsp;&nbsp;
			</td>
			<td>
				<?php 
					$checkedTZD='';
					if($_['timezonedetection'] == 'true'){
						$checkedTZD='checked="checked"';
					}
				?>
				<input type="checkbox" name="timezonedetection" id="timezonedetection" <?php print_unescaped($checkedTZD); ?>>
				&nbsp;
				<label for="timezonedetection"><?php p($l->t('Update timezone automatically')); ?></label>
				<br /><span class="msg msgTzd"></span>
			</td>
		</tr>
		
		<tr>
			<td>
				<label for="timeformat" class="bold"><?php p($l->t('Time format'));?></label>
				&nbsp;&nbsp;
			</td>
			<td>
				<?php 
				  
				  $aTimeFormat=[
				   '24' => ['id' => '24h', 'title' => $l->t("24h")],
				   'ampm' => ['id' => 'ampm', 'title' => $l->t("12h")]
				  ];
				?>
				<select style="display: none; width: 120px;" id="timeformat" title="<?php p("timeformat"); ?>" name="timeformat">
					<?php
					  foreach($aTimeFormat as $key => $val){
					  	$selected='';
						  if($key == $_['timeformat']){
						  	$selected ='selected="selected"';
						  }
						  print_unescaped('<option value="'.$key.'" id="'.$val['id'].'" '.$selected.'>'.$val['title'].'</option>');
					  }
					  ?>
					
				</select>
				<br /><span class="msg msgTf"></span>
			</td>
		</tr>
		<tr>
			<td>
				<label for="firstday" class="bold"><?php p($l->t('Start week on'));?></label>
				&nbsp;&nbsp;
			</td>
			<td>
				<?php 
					$aFirstDay=[
				   'mo' => ['id' => 'mo', 'title' => $l->t("Monday")],
				   'tu' =>  ['id' => 'tu', 'title' => $l->t("Tuesday")],
				   'we' => ['id' => 'we', 'title' => $l->t("Wednesday")],
				   'th' =>  ['id' => 'th', 'title' => $l->t("Thursday")],
				   'fr' =>  ['id' => 'fr', 'title' => $l->t("Friday")],
				   'sa' => ['id' => 'sa', 'title' => $l->t("Saturday")],
				   'su' => ['id' => 'su', 'title' => $l->t("Sunday")]
				   
				  ];
				?>
				<select style="display: none;" id="firstday" title="<?php p("First day"); ?>" name="firstday">
					<?php
					  foreach($aFirstDay as $key => $val){
					  	$selected='';
						  if($key == $_['firstday']){
						  	$selected ='selected="selected"';
						  }
						  print_unescaped('<option value="'.$key.'" id="'.$val['id'].'" '.$selected.'>'.$val['title'].'</option>');
					  }
					  ?>
					
				</select>
				<br /><span class="msg msgFd"></span>
			</td>
		</tr>
		<tr class="advancedsettings">
			<td colspan="2">
				<label for="" class="bold"><?php p($l->t('Cache'));?></label><br />
				
				<?php 
				  $cssCached='style="background-color:#DC143C;color:#FFFFFF;text-shadow:#fff 0px 0px 0px;"';
				  $msgCache = $l->t('Not all calendars are completely cached');
				  if($_['allCalendarCached'] == 'true'){
				  	$cssCached='style="background-color:#F8F8F8;color:#333;text-shadow:#fff 0 1px 0;"';
					 $msgCache = $l->t('Everything seems to be completely cached'); 
				  }
				?>
				<input title="<?php p($msgCache); ?>" <?php print_unescaped($cssCached); ?> id="cleancalendarcache" type="button" class="button" value="<?php p($l->t('Clear cache for repeating events'));?>">
			<br /><span class="msg msgCcc"></span>
			</td>
		</tr>
	</table>
</div>
<h2 id="title_urls"><?php p($l->t('URLs')); ?></h2>
<div id="urls" class="settings-div">
		<?php p($l->t('Calendar CalDAV syncing addresses')); ?> (<a href="http://owncloud.org/synchronisation/" target="_blank"><?php p($l->t('more info')); ?></a>)
		<dl>
		<dt><?php p($l->t('Primary address (Kontact et al)')); ?></dt>
		<dd><input type="text" style="width:300px;" value="<?php print_unescaped(OCP\Util::linkToRemote('caldav')); ?>" readonly /></dd>
		<dt><?php p($l->t('iOS/OS X')); ?></dt>
		<dd><input type="text" style="width:300px;" value="<?php print_unescaped(OCP\Util::linkToRemote('caldav')); ?>principals/<?php p(OCP\USER::getUser()); ?>/" readonly /></dd>
		</dl>
	</div>
</div>
