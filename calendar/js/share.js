CalendarShare={
   calendarConfig:null,
	init:function(){
		var token = ($('#fullcalendar').data('token') !== undefined) ? $('#fullcalendar').data('token') : '';
		
		if(CalendarShare.calendarConfig == null){
			$.getJSON(OC.generateUrl('apps/calendar/publicgetguestsettingscalendar'),{t:token}, function(jsondata){
				if(jsondata.status == 'success'){
					CalendarShare.calendarConfig=[];
					CalendarShare.calendarConfig['defaultView'] = jsondata.defaultView;
					CalendarShare.calendarConfig['agendatime'] = jsondata.agendatime;
					CalendarShare.calendarConfig['defaulttime'] = jsondata.defaulttime;
					CalendarShare.calendarConfig['firstDay'] = jsondata.firstDay;
					CalendarShare.calendarConfig['eventSources'] = jsondata.eventSources;
					CalendarShare.calendarConfig['calendarcolors'] = jsondata.calendarcolors;
					CalendarShare.calendarConfig['myRefreshChecker'] = jsondata.myRefreshChecker;
					
					var timezone = jstz.determine();
					var timezoneName = timezone.name();
				
					$.post(OC.generateUrl('apps/calendar/publicgetguesstimezone'), {timezone: timezoneName},
						function(data){
							
							if (data.status == 'success' && typeof(data.message) != 'undefined'){
								$('#notification').html(data.message);
								$('#notification').slideDown();
								window.setTimeout(function(){$('#notification').slideUp();}, 5000);
								$('#fullcalendar').fullCalendar('refetchEvents');
							}
						});
					
					CalendarShare.initCalendar();
					
				}
				
			});
		}else{
			CalendarShare.initCalendar();
		}
		
		
		
	},
	initCalendar:function(){
    	
    	var bWeekends = true;
		if (CalendarShare.calendarConfig['defaultView'] == 'agendaWorkWeek') {
			bWeekends = false;
		}
	   
		var firstHour = new Date().getUTCHours() + 2;
	
		
	
		var monthNames=[
			t('calendar', 'January'),
			t('calendar', 'February'),
			t('calendar', 'March'),
			t('calendar', 'April'),
			t('calendar', 'May'),
			t('calendar', 'June'),
			t('calendar', 'July'),
			t('calendar', 'August'),
			t('calendar', 'September'),
			t('calendar', 'October'),
			t('calendar', 'November'),
			t('calendar', 'December')
		];
		
		var monthNamesShort=[
			t('calendar', 'Jan.'),
			t('calendar', 'Feb.'),
			t('calendar', 'Mar.'),
			t('calendar', 'Apr.'),
			t('calendar', 'May.'),
			t('calendar', 'Jun.'),
			t('calendar', 'Jul.'),
			t('calendar', 'Aug.'),
			t('calendar', 'Sep.'),
			t('calendar', 'Oct.'),
			t('calendar', 'Nov.'),
			t('calendar', 'Dec.')
		];
		
		var dayNames=[
			t('calendar', 'Sunday'),
			t('calendar', 'Monday'),
			t('calendar', 'Tuesday'),
			t('calendar', 'Wednesday'),
			t('calendar', 'Thursday'),
			t('calendar', 'Friday'),
			t('calendar', 'Saturday')
		];
		
		var dayNamesShort=[
			t('calendar', 'Sun.'),
			t('calendar', 'Mon.'),
			t('calendar', 'Tue.'),
			t('calendar', 'Wed.'),
			t('calendar', 'Thu.'),
			t('calendar', 'Fri.'),
			t('calendar', 'Sat.')
		];
		
		$('#fullcalendar').fullCalendar({
			header : {
				center : 'title',
				left : '',
				right : ''
			},
			firstDay : CalendarShare.calendarConfig['firstDay'],
			editable : false,
			startEditable:false,
			defaultView : CalendarShare.calendarConfig['defaultView'],
			aspectRatio : 1.5,
			weekNumberTitle : 'KW',
			weekNumbers : true,
			weekMode : 'variable',
			firstHour : firstHour,
			weekends : bWeekends,
			timeFormat : {
				agenda : CalendarShare.calendarConfig['agendatime'],
				'' : CalendarShare.calendarConfig['defaulttime']
			},
			columnFormat : {
				month : t('calendar', 'ddd'), // Mon
				week : t('calendar', 'ddd M/d'), // Mon 9/7
				agendaThreeDays : t('calendar', 'dddd M/d'), // Mon 9/7
				day : t('calendar', 'dddd M/d') // Monday 9/7
			},
			titleFormat : {
				month : t('calendar', 'MMMM yyyy'),
				// September 2009
				week : t('calendar', "MMM d[ yyyy]{ '&#8212;'[ MMM] d yyyy}"),
				// Sep 7 - 13 2009
				day : t('calendar', 'dddd, MMM d, yyyy'),
				// Tuesday, Sep 8, 2009
			},
			axisFormat : CalendarShare.calendarConfig['defaulttime'],
			monthNames : monthNames,
			monthNamesShort : monthNamesShort,
			dayNames : dayNames,
			dayNamesShort : dayNamesShort,
			allDayText : t('calendar', 'All day'),
			viewRender : CalendarShare.UI.viewRender,
			slotMinutes : 15,
			eventClick : CalendarShare.UI.showEvent,
			eventRender: CalendarShare.UI.renderEvents,
			loading : CalendarShare.UI.loading,
			eventSources : CalendarShare.calendarConfig['eventSources'],
		
		});
		/*
		if (CalendarShare.calendarConfig['defaultView'] == 'month') {
			$("#fullcalendar").niceScroll();
		}else{
			$("#scrollDiv").niceScroll();
		}*/
		CalendarShare.UI.setTimeline();
		$("#fullcalendar").height(($(window).height()-130));
		$('#fullcalendar').width($(window).width()-$('#leftcontent').width()-20);
	
		$('#fullcalendar').fullCalendar('option', 'height', $(window).height() - $('#controls').height() - $('#header').height()-45 );
    },
   Util:{
   	addIconsCal:function(title,src,width){
			return '<div class="eventIcons"><i title="' + title + '"  class="ioc ioc-' + src + '"></i></div>';
		},
	getDayOfWeek : function(iDay) {
			var weekArray = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
			return weekArray[iDay];
		},
	 rruleToText:function(sRule){
			
			if(sRule != ''){
			sTemp=sRule.split(';');
			sTemp2=[];
			
			
			$.each(sTemp,function(i,el){
				sTemp1=sTemp[i].split('=');
				sTemp2[sTemp1[0]]=sTemp1[1];
			});
			iInterval=sTemp2['INTERVAL'];
			
			soFreq= t('calendar',sTemp2['FREQ']);
			if(iInterval>1) {
				if(sTemp2['FREQ']=='DAILY'){
					soFreq=t('calendar', 'All')+' '+iInterval+' '+t('calendar', 'Days');
				}
				if(sTemp2['FREQ']=='WEEKLY'){
					soFreq=t('calendar', 'All')+' '+iInterval+' '+t('calendar', 'Weeks');
				}
				if(sTemp2['FREQ']=='MONTHLY'){
					soFreq=t('calendar', 'All')+' '+iInterval+' '+t('calendar', 'Months');
				}
				if(sTemp2['FREQ']=='YEARLY'){
					soFreq=t('calendar', 'All')+' '+iInterval+' '+t('calendar', 'Years');
				}
				//tmp=soFreq.toString();				
				//tmp.split(" ");
				
				//soFreq=tmp[0]+' '+iInterval+'. '+tmp[1];
			}
			
			saveMonth='';
			if(sTemp2['BYMONTH']){
				sTempBm=sTemp2['BYMONTH'].split(',');
				iCpBm=sTempBm.length;
					$.each(sTempBm,function(i,el){
					if(saveMonth=='') saveMonth=' im '+ monthNames[(el-1)];
					else{
						  if(iCpBm!=(i+1)){ 
						   	saveMonth+=', '+ monthNames[(el-1)];
						  	}else{
						  			saveMonth+=' '+t('calendar', 'and')+' '+ monthNames[(el-1)];
						  	}
						}
				});
			}
			saveMonthDay='';
			if(sTemp2['BYMONTHDAY']){
				sTempBmd=sTemp2['BYMONTHDAY'].split(',');
				iCpBmd=sTempBmd.length;
					$.each(sTempBmd,function(i,el){
					if(saveMonthDay=='') saveMonthDay=' '+t('calendar', 'on')+' '+ el+'.';
					else {
						if(iCpBmd!=(i+1)){
						  saveMonthDay+=', '+ el+'.';
						}else{
							 saveMonthDay+=' '+t('calendar', 'and')+' '+ el+'.';
						}
					}
				});
			}
			
			saveDay='';
			if(sTemp2['BYDAY']){
				sTemp3=sTemp2['BYDAY'].split(',');
				iCpBd=sTemp3.length;
				$.each(sTemp3,function(i,el){
					var elLength=el.length;
					if(elLength == 2){
						if(saveDay=='') saveDay=' '+t('calendar', 'on')+' '+ t('calendar', el);
						else {
							if(iCpBd!=(i+1)){
							   saveDay+=', '+ t('calendar', el);
							}else{
								 saveDay+=' '+t('calendar', 'and')+' '+ t('calendar', el);
							}
						}
					}
					if(elLength == 3){
						var week=el.substring(0,1);
						var day=el.substring(1,3);
						if(saveDay=='') saveDay=' '+t('calendar', 'on')+' '+week+'. '+ t('calendar', day);
						else saveDay+=', '+ t('calendar', day);
					}
					if(elLength == 4){
						var week=el.substring(1,2);
						var day=el.substring(2,4);
						if(saveDay=='') saveDay=' '+t('calendar', 'on')+' '+week+'. '+ t('calendar', day);
						else saveDay+=', '+ t('calendar', day);
					}
				});
			}
			//#rruleoutput
			var returnVal=soFreq+saveMonthDay+saveDay+saveMonth;
			return returnVal;
			}else return false;
			//alert(soFreq+saveMonthDay+saveDay+saveMonth);
		},		
   },
   UI:{
   	  loading: function(isLoading){
			if (isLoading){
				$('#loading').show();
			}else{
				
				$('#loading').hide();
				
			}
			
		},
	 timerCheck:null,
   	  showEvent:function(calEvent, jsEvent, view){
			
			var id = calEvent.id;
			 var choosenDate ='';
			if(typeof calEvent.start!='undefined'){
			   choosenDate = Math.round(calEvent.start.getTime()/1000);
			}
			if($('#event').dialog('isOpen') == true){
				// TODO: save event
				$('#event').dialog('destroy').remove();
			}else{
				CalendarShare.UI.loading(true);
				$('#dialog_holder').load(OC.generateUrl('apps/calendar/getshowevent'), {id: id,choosendate:choosenDate}, CalendarShare.UI.startShowEventDialog);
			}
		},
		
		startShowEventDialog:function(){
			CalendarShare.UI.loading(false);
			
			$('#fullcalendar').fullCalendar('unselect');
			
		
		     //Calendar.UI.lockTime();
      
			$('#closeDialog').on('click',function(){
					$('#event').dialog('destroy').remove();
			});
			
			
			$( "#event" ).tabs({ selected: 0});
			$('.tipsy').remove();
			$('#event').dialog({
				width : 450,
				height: 'auto',
				
				close : function(event, ui) {
					$(this).dialog('destroy').remove();
				}
			});
			var sRuleReader=CalendarShare.Util.rruleToText($('#sRuleRequest').val());
             $("#rruleoutput").text(sRuleReader);
             
			$( "#showLocation" ).tooltip({
					items: "img, [data-geo], [title]",
					position: { my: "left+15 center", at: "right center" },
					content: function() {
					var element = $( this );
					if ( element.is( "[data-geo]" ) ) {
					var text = element.text();
					return "<img class='map' alt='" + text +
					"' src='http://maps.google.com/maps/api/staticmap?" +
					"zoom=14&size=350x350&maptype=terrain&sensor=false&center=" +
					text + "'>";
					}
					if ( element.is( "[title]" ) ) {
					return element.attr( "title" );
					}
					if ( element.is( "img" ) ) {
					return element.attr( "alt" );
					}
					}
				});
			
		},
		viewRender:function(view,element){
			 $( "#datepickerNav" ).datepicker("setDate", $('#fullcalendar').fullCalendar('getDate'));

			    if (view.name != CalendarShare.calendarConfig['defaultView']) {
				$.post(OC.generateUrl('apps/calendar/changeviewcalendarpublic'), {
					v : view.name
				});
				CalendarShare.calendarConfig['defaultView'] = view.name;
			}
			/*
			if (view.name == 'month') {
				
				$("#fullcalendar").niceScroll();
			}else{
				$("#scrollDiv").niceScroll();
			}*/
			 $('#view button').removeClass('active');
			 $('#view button[data-action='+view.name+']').addClass('active');
		},
		renderEvents : function(event, element) {
				
				var EventInner=element.find('.fc-event-inner');

				if (event.isrepeating) {
					EventInner.prepend(CalendarShare.Util.addIconsCal('repeating','repeat','14'));
				}
				
				if (event.privat == 'confidential') {
					EventInner.prepend(CalendarShare.Util.addIconsCal('confidential','eye','12'));
				}

		  
		},
		
		setTimeline:function() {
			var curTime = new Date();
			if(curTime.getHours() == 0 && curTime.getMinutes() <= 5) // Because I am calling this function every 5 minutes
			{// the day has changed
				var todayElem = $(".fc-today");
				todayElem.removeClass("fc-today");
				todayElem.removeClass("fc-state-highlight");
				
				todayElem.next().addClass("fc-today");
				todayElem.next().addClass("fc-state-highlight");
			}
			
			var parentDiv = $(".fc-agenda-slots:visible").parent();
			var timeline = parentDiv.children(".timeline");
			if (timeline.length == 0) { //if timeline isn't there, add it
				timeline = $("<hr>").addClass("timeline");
				parentDiv.prepend(timeline);
			}
		
			var curCalView = $('#fullcalendar').fullCalendar("getView");
			if (curCalView.visStart < curTime && curCalView.visEnd > curTime) {
				timeline.show();
			} else {
				timeline.hide();
			}
		
			var curSeconds = (curTime.getHours() * 60 * 60) + (curTime.getMinutes() * 60) + curTime.getSeconds();
			var percentOfDay = curSeconds / 86400; //24 * 60 * 60 = 86400, # of seconds in a day
			var topLoc = Math.floor(parentDiv.height() * percentOfDay);
		
			timeline.css("top", topLoc + "px");
		
		},
   }	
};

var  liveReminderCheck=function(){
	
	//event.stopPropagation();
	
	
		var url =  OC.generateUrl('/apps/calendar/getreminderevents');
		if($('#eventPublic').length==0){
		
		
		
		 if (CalendarShare.UI.timerCheck){
			window.clearInterval(CalendarShare.UI.timerCheck);
		}
		
		 CalendarShare.UI.timerCheck = window.setInterval( function() {
			if(CalendarShare.calendarConfig != null){
				var myRefChecker=CalendarShare.calendarConfig['myRefreshChecker'];
				//alert(myRefChecker);
				$.post(url,{EvSource:myRefChecker},function(jasondata){
					if(jasondata.status == 'success'){
						  // alert(jasondata.refresh);
						  if(jasondata.refresh){
							myRefreshChecker[jasondata.refresh.id]=jasondata.refresh.ctag;
							$('#fullcalendar').fullCalendar('refetchEvents');
							}
							CalendarShare.UI.setTimeline();
					}
				
					//
				});
			}
		}, 60000);
		
	}
	
	//window.clearInterval(myTimer);
};
var resizeTimeout = null;
$(window).resize(_.debounce(function() {
	if (resizeTimeout)
		clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(function() {
		$("#fullcalendar").height(($(window).height()-130));
		$('#fullcalendar').width($(window).width()-$('#leftcontent').width()-20);
	
		$('#fullcalendar').fullCalendar('option', 'height', $(window).height() - $('#controls').height() - $('#header').height()-45 );

	
	}, 500);
}));

$(document).ready(function(){
	
	$('#body-public').addClass('appbody-calendar');
	$('#body-public').removeClass('appbody-gallery');
	
	if($('#eventPublic').length>0){
		
		var sRuleReader=CalendarShare.Util.rruleToText($('#sRuleRequestSingle').val());
        $("#rruleoutput").text(sRuleReader);
        
        $("#showLocation").tooltip({
				items : "img, [data-geo], [title]",
				position : {
					my : "left+15 center",
					at : "right center"
				},
				content : function() {
					var element = $(this);
					if (element.is("[data-geo]")) {
						var text = element.text();
						return "<img class='map' alt='" + text + "' src='http://maps.google.com/maps/api/staticmap?" + "zoom=14&size=350x350&maptype=terrain&sensor=false&center=" + text + "'>";
					}
					if (element.is("[title]")) {
						return element.attr("title");
					}
					if (element.is("img")) {
						return element.attr("alt");
					}
				}
			});
        
	}
	
	if($('#eventPublic').length==0){
	
	
	calOptions={
		
	};
	
	CalendarShare.init();
	
	$("#datepickerNav").datepicker({
			minDate:null,
			onSelect : function(value, inst) {
				var date = inst.input.datepicker('getDate');

				$('#fullcalendar').fullCalendar('gotoDate', date);

				var view = $('#fullcalendar').fullCalendar('getView');

				if (view.name !== 'month') {
					$("[class*='fc-col']").removeClass('activeDay');
					daySel = CalendarShare.Util.getDayOfWeek(date.getDay());
					$('td.fc-' + daySel).addClass('activeDay');
				}
				
				if (view.name == 'month') {
					$('td.fc-day').removeClass('activeDay');
					prettyDate = $.datepicker.formatDate('yy-mm-dd', date); 
					$('td[data-date=' + prettyDate + ']').addClass('activeDay');
				}

			}
	});
	
	
	$('#view button').each(function(i,el){
		   $(el).on('click',function(){
			   if($(this).data('view') === false){
					$('#fullcalendar').fullCalendar($(this).data('action'));
			   }else{
			   	  
			   	   $('#fullcalendar').fullCalendar('option', 'weekends', $(this).data('weekends'));
			   	   $('#fullcalendar').fullCalendar('changeView',$(this).data('action'));
			   	 
			   }
		   });
	});
	
	$('#datecontrol_today').click(function(){
		$('#fullcalendar').fullCalendar('today');
	});
	
	
	
   // liveReminderCheck();
    
    $('#timezone').change( function(){
		var post = $( '#timezone' ).serialize();
		$.post( OC.generateUrl('apps/calendar/calendarsettingssettimezone'), post, function(data){
			   $('#fullcalendar').fullCalendar('refetchEvents');
			});
		return false;
	});
    $('#timezone').chosen();
   }
});