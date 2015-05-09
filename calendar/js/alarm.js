
//SEARCH
OC.search.resultTypes['calendar']=t('calendar','Cal.');
OC.search.resultTypes['tasks']=t('aufgaben','Tasks');
OC.search.resultTypes['contacts']=t('kontakte','Contacts');

(function($){

  $.extend({
    playSound: function(){
    
      return $('<audio autoplay="autoplay"><source src="'+arguments[0]+'.mp3" type="audio/mpeg"><source src="'+arguments[0]+'.ogg" type="audio/ogg"></audio>').prependTo('#reminderBox');
    }
  });

})(jQuery);

$(document).ready(function(){
	
	$('<div id="reminderBox" style="width:0;height:0;top:0;left:0;display:none;">').appendTo($('#body-user'));
	liveReminderCheck();
	
});

var timerRefresher=null;

/**
 * Calls the server periodically every 1 min to check live calendar events
 * 
 */
function liveReminderCheck(){
	
		var url = OC.generateUrl('/apps/calendar/getreminderevents');
		var myRefChecker='';
		 if (timerRefresher){
			window.clearInterval(timerRefresher);
		}
		
		var timerRefresher = window.setInterval(function(){
			if($('#fullcalendar').length==1 && Calendar.calendarConfig != null){
			//calId = ctag
				myRefChecker=Calendar.calendarConfig['myRefreshChecker'];
			}
			
			$.post(url,{EvSource:myRefChecker},function(jasondata){
					
					if($('#fullcalendar').length==1){
					  if(jasondata.refresh!='onlyTimeLine'){
							Calendar.calendarConfig['myRefreshChecker'][jasondata.refresh.id]=jasondata.refresh.ctag;
							if(Calendar.UI.timerLock == false) {
								$('#fullcalendar').fullCalendar('refetchEvents');
							}
							if(Calendar.UI.timerLock == true) {
								Calendar.UI.timerLock=false;
							}
							Calendar.Util.setTimeline();
						}
						if(jasondata.refresh=='onlyTimeLine'){
							Calendar.Util.setTimeline();
							//alert(jasondata.refresh);
						}
					}
					//
					if(jasondata.data!='') openReminderDialog(jasondata.data);
				
				//
			});
			
		
			
		}, 60000);
		
		
	
}

var openReminderDialog=function(data){
			//var output='<audio autoplay="autoplay"><source src="'+OC.filePath('calendar','audio', 'ring.ogg')+'"></source><source src="'+OC.filePath('calendar','audio','ring.mp3')+'"></source></audio>';
			
			
			 var output='';
			 $.each(data, function(i, elem) {
				  output+='<b>'+elem.startdate+'</b><br />';
				  output+='<i class="ioc ioc-'+elem.icon+'"></i> <a href="'+elem.link+'">'+elem.summary+'</a><br />';
				
				});
			$( "#reminderBox" ).html(output);	
			 $.playSound(oc_webroot+'/apps/calendar/audio/ring');
			$( "#reminderBox" ).dialog({
			resizable: false,
			title : t('calendar', 'Reminder Alert'),
			width:350,
			height:200,
			modal: true,
			buttons: 
			[  { text:t('calendar', 'Ready'), click: function() {
			    	$( "#reminderBox" ).html('');	
			    	$( this ).dialog( "close" );
			    }
			    } 
			],
	
		});
  	 
		return false;

			
};