<div id="notification-container">
	<div id="notification" style="display: none;"></div>
</div>

<div id="loading">
<i style="margin-top:20%;" class=" ioc-spinner ioc-spin"></i>
</div>
<input type="hidden" id="isPublic" name="isPublic" value="1">

<header>
	<div id="header">
<a href="<?php print_unescaped(link_to('', 'index.php')); ?>"
			title="<?php p($theme -> getLogoClaim()); ?>" id="owncloud">
			<div class="logo-icon svg"></div>
		</a>
			
		<div class="header-right">
			<span><a href="<?php print_unescaped($_['webcallink']); ?>" class="button"><?php p($l->t('Subscribe'));?></a></span>
			<span id="details"><?php p($l->t('%s shared the calendar %s with you',
						array($_['displayName'], $_['calendarName']))) ?></span>
		</div>
		
	</div></header>
<div id="controls">
	<div class="leftControls">
	<div class="button-group" style="margin: 5px 3px;">	
	<button class="button"  id="datecontrol_today"><?php p($l->t('Today'));?></button>
	
	</div>
	
	</div>
	<div class="centerControls">
		
		<div id="view" class="button-group" style="margin: 5px 3px;float:none;">
		<button class="button" data-action="prev" data-view="false" data-weekends="false"><i class="ioc ioc-previous"></i></button>		
		<button class="button" data-action="agendaDay" data-view="true" data-weekends="true"><?php p($l->t('Day'));?></button>
		<button class="button" data-action="agendaThreeDays" data-view="true" data-weekends="true"><?php p($l->t('3-Days'));?></button>	
		<button class="button" data-action="agendaWorkWeek" data-view="true" data-weekends="false"><?php p($l->t('W-Week'));?></button>			
		<button class="button" data-action="agendaWeek" data-view="true" data-weekends="true"><?php p($l->t('Week'));?></button>
	  <button class="button" data-action="month" data-view="true" data-weekends="true"><?php p($l->t('Month'));?></button>
	   <button class="button" data-action="list" data-view="true" data-weekends="true"><i class="ioc ioc-list" title="<?php p($l->t('List'));?>"></i></button>
	  <button class="button"  data-action="next" data-view="false" data-weekends="false"><i class="ioc ioc-next"></i></button>	
			
	  </div>
  
	</div>
	<div class="rightControls" style="text-align:left;margin-right:10px;margin-top:2px;line-height:45px;">
		<label for="timezone" class="bold" style="float:left;"><?php p($l->t('Timezone'));?></label>&nbsp;&nbsp;
	<select style="display:none;font-size:12px;"  id="timezone" name="timezone" >
				<?php
				$continent = '';
				foreach($_['timezones'] as $timezone):
					$ex=explode('/', $timezone, 2);//obtain continent,city
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
					print_unescaped('<option value="'.\OCP\Util::sanitizeHTML($timezone).'"'.($_['timezone'] == $timezone?' selected="selected"':'').'>'.\OCP\Util::sanitizeHTML($city).'</option>');
				endforeach;?>
				</select>
	</div>	
	
	
	
	
</div>
<div id="leftcontent">
	<div id="leftcontentInner">
	<div id="datepickerNav"></div>	
	</div>
</div>

	<div id="fullcalendar" data-token="<?php p($_['sharingToken'])?>"></div>
	<div id="dialog_message" style="width:0;height:0;top:0;left:0;display:none;"></div>	
<div id="dialog" style="width:0;height:0;top:0;left:0;display:none;"></div>
<div id="dialog_holder" style="width:0;height:0;top:0;left:0;display:none;"></div>
	<footer>
		<p class="info">
			<?php print_unescaped($theme->getLongFooter()); ?>
		</p>
	</footer>
