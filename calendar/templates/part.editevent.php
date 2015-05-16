<div id="event">
	<div style="text-align: center;color: #FF1D1D;" id="errorbox"></div>
	
	<form id="event_form">
		<input type="hidden" id="eventid" name="id" value="<?php p($_['eventid']) ?>">
		<input type="hidden" name="lastmodified" value="<?php p($_['lastmodified']) ?>">
		<input type="hidden" name="choosendate" id="choosendate" value="<?php p($_['choosendate']) ?>">
		<input type="hidden" name="mailNotificationEnabled" id="mailNotificationEnabled" value="<?php p($_['mailNotificationEnabled']) ?>" />
    	<input type="hidden" name="allowShareWithLink" id="allowShareWithLink" value="<?php p($_['allowShareWithLink']) ?>" />
		<input type="hidden" name="mailPublicNotificationEnabled"  value="<?php p($_['mailPublicNotificationEnabled']) ?>" />
		<input type="hidden" id="haveshareaction" value="0" />
<?php print_unescaped($this->inc("part.eventform")); ?>
</form>
	<br style="clear: both;" /><br />
	<div id="actions" style="float:left;border-top:1px solid #bbb;width:100%;padding-top:5px;padding-bottom:5px;">
		
		<div  class="button-group first" style="float:left;">
		 <?php 
		       $DeleteButtonTitle=$l->t("Delete");
		        if($_['addSingleDeleteButton'] ) {
		          	$DeleteButtonTitle=$l->t("Serie");
		          }
		 ?> 
		 	
		<?php if($_['permissions'] & OCP\PERMISSION_DELETE) { ?>
		  	<button id="editEvent-delete" class="button"  data-link="<?php print_unescaped(\OC::$server->getURLGenerator()->linkToRoute('calendar.event.deleteEvent')) ?>"><?php p($DeleteButtonTitle);?> <i class="ioc ioc-ban text-danger"></i></button> 
		   <?php if($_['addSingleDeleteButton'] ) { ?>
			<button id="editEvent-delete-single" class="button" data-link="<?php print_unescaped(\OC::$server->getURLGenerator()->linkToRoute('calendar.event.deleteSingleRepeatingEvent')) ?>"><?php p($l->t("Event"));?> <i class="ioc ioc-ban text-danger"></i></button> 
			<?php } ?>
		<?php } ?>
			<button id="editEvent-export" class="button" data-link="<?php print_unescaped(\OC::$server->getURLGenerator()->linkToRoute('calendar.export.exportEvents')) ?>?eventid=<?php p($_['eventid']) ?>"><?php p($l->t("Export"));?> <i style="color:#000;" class="ioc ioc-export"></i></button> 

		</div>
		<div  class="button-group second" style="float:right;">
		<button id="closeDialog" class="button"><?php p($l->t("Cancel"));?></button> 
		<button id="editEvent-submit" class="button" data-link="<?php print_unescaped(\OC::$server->getURLGenerator()->linkToRoute('calendar.event.editEvent')) ?>" style="min-width:60px;"><?php p($l->t("OK"));?></button> 
	   </div>
	
	</div>
	
</div>
