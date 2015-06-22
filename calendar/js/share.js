CalendarShare={
   calendarConfig:null,
   
   popOverElem:null,
   availableViews:{
   	 'prev':{'action':'prev','view':false,'weekend':false,'title':'<i class="ioc ioc-angle-left"></i>'},
   	 'agendaDay':{'action':'agendaDay','view':true,'weekend':true,'title':t('calendar','Day')},
   	 'agendaThreeDays':{'action':'agendaThreeDays','view':true,'weekend':true,'title':t('calendar','3-Days')},
   	 'agendaWorkWeek':{'action':'agendaWorkWeek','view':true,'weekend':false,'title':t('calendar','W-Week')},
   	 'agendaWeek':{'action':'agendaWeek','view':true,'weekend':true,'title':t('calendar','Week')},
   	 'month':{'action':'month','view':true,'weekend':true,'title':t('calendar','Month')},
   	 'year':{'action':'year','view':true,'weekend':true,'title':t('calendar','Year')},
   	 'list':{'action':'list','view':true,'weekend':true,'title':t('calendar','List')},
   	 'next':{'action':'next','view':false,'weekend':false,'title':'<i class="ioc ioc-angle-right"></i>'},
   },
	init:function(){
		var token = ($('#fullcalendar').data('token') !== undefined) ? $('#fullcalendar').data('token') : '';
		
							
		if(CalendarShare.calendarConfig == null){
			$.getJSON(OC.generateUrl('apps/calendar/publicgetguestsettingscalendar'),{t:token}, function(jsondata){
				if(jsondata.status == 'success'){
					CalendarShare.calendarConfig=[];
					
					if(CalendarShare.defaultConfig[jsondata.calendarId] !== undefined){
						CalendarShare.defaultConfig = CalendarShare.defaultConfig[jsondata.calendarId];
					}else{
						CalendarShare.defaultConfig = CalendarShare.defaultConfig[0];
					}
					
					CalendarShare.calendarConfig['defaultView'] = CalendarShare.defaultConfig['defaultView'];
					CalendarShare.calendarConfig['agendatime'] = CalendarShare.defaultConfig['agendatime'];
					CalendarShare.calendarConfig['defaulttime'] = CalendarShare.defaultConfig['defaulttime'];
					CalendarShare.calendarConfig['firstDay'] = CalendarShare.defaultConfig['firstDay'];
					CalendarShare.calendarConfig['eventSources'] = jsondata.eventSources;
					CalendarShare.calendarConfig['calendarcolors'] = jsondata.calendarcolors;
					CalendarShare.calendarConfig['myRefreshChecker'] = jsondata.myRefreshChecker;
					
					
					if(CalendarShare.defaultConfig['smallCalendarLeft'] === true){
						CalendarShare.buildLeftNavigation();
					}else{
						$('#leftcontent').remove();
					}
					if(CalendarShare.defaultConfig['header'] === false){
						$('header').remove();
						$('#controls').css('top',0);
						$('#fullcalendar').css('top','50px');
						$('#leftcontent').css('top','50px');
						if(CalendarShare.defaultConfig['calendarViews'] === null 
						&& CalendarShare.defaultConfig['showTodayButton'] === false
						&& CalendarShare.defaultConfig['showTimeZone'] === false
						){
							$('#fullcalendar').css('top','10px');
							$('#leftcontent').css('top','40px');
							$('#controls').remove();
						}
					}else{
						$('#header').show();
					}
					
					if(CalendarShare.defaultConfig['showTodayButton'] === false){
						$('.leftControls').remove();
					}else{
						$('.leftControls').show();
					}
					
					if(CalendarShare.defaultConfig['footer'] === false){
						$('footer').remove();
					}else{
						$('footer').show();
					}
					
					if(CalendarShare.defaultConfig['showTimeZone'] === false){
						$('.rightControls').html('');
					}else{
						$('.rightControls').show();
					}	
					
					CalendarShare.buildAvailableViews();
					
				
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
					
					if(CalendarShare.defaultConfig['showTimeZone'] === true){
						CalendarShare.buildtimeZoneSelectBox();
						 //$('#timezone').val(timezoneName);
						 //$('#timezone').chosen();
					}
					
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
			weekNumberTitle :  t('calendar', 'CW '),
			weekNumbers : true,
			weekMode : 'variable',
			yearColumns: CalendarShare.defaultConfig['yearColumns'],
			firstMonth:CalendarShare.defaultConfig['firstMonth'],
			lastMonth:CalendarShare.defaultConfig['lastMonth'],
			hiddenMonths:CalendarShare.defaultConfig['hiddenMonths'],
			monthClickable:CalendarShare.defaultConfig['monthClickable'],
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
		
		CalendarShare.UI.setTimeline();
		var heightToSet=0;
		if(CalendarShare.defaultConfig['footer'] === false && CalendarShare.defaultConfig['header'] === false){
			heightToSet+= 60; 
		}
		if(CalendarShare.defaultConfig['footer'] === true){
			heightToSet+=50; 
		}
		if(CalendarShare.defaultConfig['header'] === true){
			heightToSet+=80; 
		}
		$("#fullcalendar").height(($(window).height()-heightToSet));
		
		
		$('#fullcalendar').width($(window).width()-$('#leftcontent').width()-25);
	
		$('#fullcalendar').fullCalendar('option', 'height', $(window).height() - $('#controls').height() - $('#header').height()-45 );
    },
    buildLeftNavigation:function(){
    
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
				
				if (view.name == 'month' || view.name == 'year') {
					$('td.fc-day').removeClass('activeDay');
					prettyDate = $.datepicker.formatDate('yy-mm-dd', date); 
					$('td[data-date=' + prettyDate + ']').addClass('activeDay');
				}

			}
		});
		
    },
     buildAvailableViews:function(){
     	var availabeViews = CalendarShare.defaultConfig['calendarViews'];
     	if(availabeViews !== null && availabeViews !== false){
	     	var views = [];
	     	$.each(availabeViews,function(i,el){
	     		views[i]=$('<button/>')
	     		.attr({
	     			'data-action' : CalendarShare.availableViews[el].action,
	     			'data-view' :  CalendarShare.availableViews[el].view,
	     			'data-weekends' : CalendarShare.availableViews[el].weekend,
	     		})
	     		.html(CalendarShare.availableViews[el].title)
	     		.click(function(){
		     		 if($(this).data('view') === false){
							$('#fullcalendar').fullCalendar($(this).data('action'));
					   }else{
				   	   $('#fullcalendar').fullCalendar('option', 'weekends', $(this).data('weekends'));
					   	   $('#fullcalendar').fullCalendar('changeView',$(this).data('action'));
					   }
		     	});
	     	});
	     	$('#view').append(views);
	     	if($('#view button').length === 2){
	     		if($('#view button[data-action="prev"]').length === 1 &&  $('#view button[data-action="next"]').length === 1){
	     			$('#datecontrol_today').remove();
	     			var TodayButton=$('<button />').attr({'id':'datecontrol_today','class':'button'}).text(t('calendar','Today'));
	     			$('#view button[data-action="prev"]').after(TodayButton);
	     		}
	     	}
	     	
     	}
     	
     },
      buildtimeZoneSelectBox:function(){
      		 
      		 $('#timezone').change( function(){
				var post = $( '#timezone' ).serialize();
				//$.post( OC.generateUrl('apps/calendar/calendarsettingssettimezone'), post, function(data){
				 $('#fullcalendar').fullCalendar('refetchEvents');
				//	});
				return false;
			});
		    $('#timezone').chosen();
      },
   Util:{
   	addIconsCal:function(title,src,width){
			return '<div class="eventIcons"><i title="' + title + '"  class="ioc ioc-' + src + '"></i></div>';
		},
	getDayOfWeek : function(iDay) {
			var weekArray = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
			return weekArray[iDay];
		},
	 rruleToText : function(sRule) {

			if (sRule != '' && sRule != undefined) {
				sTemp = sRule.split(';');
				sTemp2 = [];

				$.each(sTemp, function(i, el) {
					sTemp1 = sTemp[i].split('=');
					sTemp2[sTemp1[0]] = sTemp1[1];
				});
				iInterval = sTemp2['INTERVAL'];

				soFreq = t('calendar', sTemp2['FREQ']);
				if (iInterval > 1) {
					if (sTemp2['FREQ'] == 'DAILY') {
						soFreq = t('calendar', 'All') + ' ' + iInterval + ' ' + t('calendar', 'Days');
					}
					if (sTemp2['FREQ'] == 'WEEKLY') {
						soFreq = t('calendar', 'All') + ' ' + iInterval + ' ' + t('calendar', 'Weeks');
					}
					if (sTemp2['FREQ'] == 'MONTHLY') {
						soFreq = t('calendar', 'All') + ' ' + iInterval + ' ' + t('calendar', 'Months');
					}
					if (sTemp2['FREQ'] == 'YEARLY') {
						soFreq = t('calendar', 'All') + ' ' + iInterval + ' ' + t('calendar', 'Years');
					}
					//tmp=soFreq.toString();
					//tmp.split(" ");

					//soFreq=tmp[0]+' '+iInterval+'. '+tmp[1];
				}

				saveMonth = '';
				if (sTemp2['BYMONTH']) {
					sTempBm = sTemp2['BYMONTH'].split(',');
					iCpBm = sTempBm.length;
					$.each(sTempBm, function(i, el) {
						if (saveMonth == '')
							saveMonth = ' im ' + monthNames[(el - 1)];
						else {
							if (iCpBm != (i + 1)) {
								saveMonth += ', ' + monthNames[(el - 1)];
							} else {
								saveMonth += ' ' + t('calendar', 'and') + ' ' + monthNames[(el - 1)];
							}
						}
					});
				}
				saveMonthDay = '';
				if (sTemp2['BYMONTHDAY']) {
					sTempBmd = sTemp2['BYMONTHDAY'].split(',');
					iCpBmd = sTempBmd.length;
					$.each(sTempBmd, function(i, el) {
						if (saveMonthDay == '')
							saveMonthDay = ' ' + t('calendar', 'on') + ' ' + el + '.';
						else {
							if (iCpBmd != (i + 1)) {
								saveMonthDay += ', ' + el + '.';
							} else {
								saveMonthDay += ' ' + t('calendar', 'and') + ' ' + el + '.';
							}
						}
					});
				}

				saveDay = '';
				if (sTemp2['BYDAY']) {
					sTemp3 = sTemp2['BYDAY'].split(',');
					iCpBd = sTemp3.length;
					$.each(sTemp3, function(i, el) {
						var elLength = el.length;
						if (elLength == 2) {
							if (saveDay == '')
								saveDay = ' ' + t('calendar', 'on') + ' ' + t('calendar', el);
							else {
								if (iCpBd != (i + 1)) {
									saveDay += ', ' + t('calendar', el);
								} else {
									saveDay += ' ' + t('calendar', 'and') + ' ' + t('calendar', el);
								}
							}
						}
						if (elLength == 3) {
							var week = el.substring(0, 1);
							var day = el.substring(1, 3);
							if (saveDay == '')
								saveDay = ' ' + t('calendar', 'on') + ' ' + week + '. ' + t('calendar', day);
							else
								saveDay += ', ' + t('calendar', day);
						}
						if (elLength == 4) {
							var week = el.substring(1, 2);
							var day = el.substring(2, 4);
							if (saveDay == '')
								saveDay = ' ' + t('calendar', 'on') + ' ' + week + '. ' + t('calendar', day);
							else
								saveDay += ', ' + t('calendar', day);
						}
					});
				}
				//#rruleoutput
				var returnVal = soFreq + saveMonthDay + saveDay + saveMonth;
				return returnVal;
			} else
				return false;
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
			
			if($('.webui-popover').length>0){
				if(CalendarShare.popOverElem !== null){
					CalendarShare.popOverElem.webuiPopover('destroy');
					CalendarShare.popOverElem = null;
					$('#event').remove();
				}
			}
			
			CalendarShare.popOverElem=$(jsEvent.target);
			
			CalendarShare.popOverElem.webuiPopover({
				url:OC.generateUrl('apps/calendar/getshowevent'),
				
				async:{
					type:'POST',
					data:{
						id : id,
						choosendate : choosenDate
					},
					success:function(that,data){
						that.displayContent();
						CalendarShare.UI.startShowEventDialog(CalendarShare.popOverElem,that);
						return false;
					}
				},
				multi:false,
				closeable:false,
				animation:'pop',
				placement:'auto-left-right',
				cache:false,
				type:'async',
				width:400,
				height:50,
			}).webuiPopover('show');
			
		},
		
		startShowEventDialog:function(targetElem,that){
			//CalendarShare.UI.loading(false);
			
			$('#fullcalendar').fullCalendar('unselect');
			
			that.getContentElement().css('height','auto');
			
			$('#closeDialog').on('click', function() {
				CalendarShare.popOverElem.webuiPopover('destroy');
				CalendarShare.popOverElem = null;
			});

			
			$('.tipsy').remove();
		    
			$('.tipsy').remove();
			
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

if($.fullCalendar !== undefined){
	
	function ListView(element, calendar) {
		var $this = this;
	
		// imports
		jQuery.fullCalendar.views.month.call($this, element, calendar);
		//jQuery.fullCalendar.BasicView.call(t, element, calendar, 'month');
		var opt = $this.opt;
		var trigger = $this.trigger;
		var eventElementHandlers = $this.eventElementHandlers;
		var reportEventElement = $this.reportEventElement;
		var formatDate = calendar.formatDate;
		var formatDates = calendar.formatDates;
		var addDays = $.fullCalendar.addDays;
		var cloneDate = $.fullCalendar.cloneDate;
		//var clearTime =  $.fullCalendar.clearTime;
		var skipHiddenDays = $this.skipHiddenDays;
	
		function clearTime(d) {
			d.setHours(0);
			d.setMinutes(0);
			d.setSeconds(0);
			d.setMilliseconds(0);
			return d;
		}
	
		function skipWeekend(date, inc, excl) {
			inc = inc || 1;
			while (!date.getDay() || (excl && date.getDay() == 1 || !excl && date.getDay() == 6)) {
				addDays(date, inc);
			}
			return date;
		}
	
		// overrides
		$this.name = 'list';
		$this.render = render;
		$this.renderEvents = renderEvents;
		$this.setHeight = setHeight;
		$this.setWidth = setWidth;
		$this.clearEvents = clearEvents;
	
		function setHeight(height, dateChanged) {
		}
	
		function setWidth(width) {
		}
	
		function clearEvents() {
			//this.reportEventClear();
		}
	
		// main
		function sortEvent(a, b) {
			return a.start - b.start;
		}
	
		function render(date, delta) {
			
			var viewDays = moment(date.toISOString(), "YYYY-MM").daysInMonth();
			
			if (delta) {
				addDays(date, delta * viewDays);
			}
	
			var start = cloneDate(date, true);
			viewDays = moment(start.toISOString(), "YYYY-MM").daysInMonth();
			start.setDate(1);
			
			var end = addDays(cloneDate(start), viewDays);
	
			var visStart = cloneDate(start);
			skipHiddenDays(visStart);
	
			var visEnd = cloneDate(end);
			skipHiddenDays(visEnd, -1, true);
	
			$this.title = formatDate(start, opt('titleFormat', 'month'));
			$this.start = start;
			$this.end = end;
			$this.visStart = visStart;
			$this.visEnd = visEnd;
	
		}
	
		function eventsOfThisDay(events, theDate) {
			var start = cloneDate(theDate, true);
			var end = addDays(cloneDate(start), 1);
			var retArr = new Array();
	
			$.each(events, function(i, value) {
				var event_end = $this.eventEnd(events[i]);
				if (events[i].start < end && event_end >= start) {
					retArr.push(events[i]);
				}
			});
			return retArr;
		}
	
		function renderEvent(event) {
			if (event.allDay) {//all day event
				var time = opt('allDayText');
			} else {
	
				var time = formatDates(event.start, event.end, opt('timeFormat', 'agenda'));
			}
			var classes = ['fc-event', 'fc-list-event'];
			classes = classes.concat(event.className);
	
			if (event.source) {
				classes = classes.concat(event.source.className || []);
			}
	
			var bgColor = '#D4D5AA';
			var color = '#000000';
			if ( typeof CalendarShare.calendarConfig['calendarcolors'][event.calendarid] != 'undefined') {
				bgColor = CalendarShare.calendarConfig['calendarcolors'][event.calendarid]['bgcolor'];
				color = CalendarShare.calendarConfig['calendarcolors'][event.calendarid]['color'];
			}
			var imgBday = '';
			if (event.bday) {
				imgBday=CalendarShare.Util.addIconsCal('Happy Birthday', 'birthday-cake', '14');
	
			}
			var imgReminder = '';
			if (event.isalarm) {
			   imgReminder=CalendarShare.Util.addIconsCal(t('calendar', 'Reminder'), 'clock', '14');
			}
	
			var imgShare = '';
			if (event.shared) {
				 imgShare=CalendarShare.Util.addIconsCal(t('core', 'Shared'), 'share', '14');
			}
	
			var imgPrivate = '';
	
			if (event.privat == 'private') {
				imgPrivate=CalendarShare.Util.addIconsCal(t('calendar', 'Show As'), 'lock', '14');
			}
			if (event.privat == 'confidential') {
				imgPrivate=CalendarShare.Util.addIconsCal(t('calendar', 'Show As'), 'eye', '14');
			}
			eventLocation = '';
			if (event.location != '' && event.location != null && typeof event.location != 'undefined') {
	
				eventLocation = '<span class="location">' + event.location + '</span>';
			}
			var imgRepeating = '';
			if (event.isrepeating) {
			    imgRepeating=CalendarShare.Util.addIconsCal(t('calendar', 'Repeat'), 'repeat', '14');
			}
	
			var Kategorien = '';
			if (event.categories.length > 0) {
	
				Kategorien = '<div style="float:right;margin-top:2px;" class="categories">';
	
				$(event.categories).each(function(i, category) {
					Kategorien += '<a class="catColPrev" style="background-color:#ccc;color:#555;" title="'+category+'">' + category.substring(0, 1) + '</a>';
					
				});
				Kategorien += '</div>';
			}
			var html = '<tr class="fc-list-row">' + '<td>&nbsp;</td>' + '<td class="fc-list-time ">' + time + '</td>' + '<td>&nbsp;</td>' + '<td class="fc-list-event">' + '<span id="list' + event.id + '"' + ' class="' + classes.join(' ') + '"' + '>' + '<span class="colorCal-list" style="margin-top:6px;background-color:' + bgColor + ';">' + '&nbsp;' + '</span>' + '<span class="list-icon">' + imgBday + imgShare + ' ' + imgPrivate + ' ' + imgRepeating + ' ' + imgReminder + '&nbsp;' + '</span>' + '<span class="fc-event-title">' + escapeHTML(event.title) + '</span>' + '<span>' + Kategorien + '</span>' + '<span>' + eventLocation + '</span>' + '</span>' + '</td>' + '</tr>';
	
			return html;
		}
	
		function renderDay(date, events) {
	
			var today = clearTime(new Date());
	
			var addTodayClass = '';
			if (+date == +today) {
				addTodayClass = 'fc-list-today';
	
			}
	
			var dayRows = $('<tr>' + '<td colspan="4" class="fc-list-date ' + addTodayClass + '">' + '&nbsp;<span>' + formatDate(date, opt('titleFormat', 'day')) + '</span>' + '</td>' + '</tr>');
	
			$.each(events, function(i, value) {
	
				var event = events[i];
				var eventElement = $(renderEvent(event));
				triggerRes = trigger('eventRender', event, event, eventElement);
				if (triggerRes === false) {
					eventElement.remove();
				} else {
					if (triggerRes && triggerRes !== true) {
						eventElement.remove();
						eventElement = $(triggerRes);
					}
					$.merge(dayRows, eventElement);
					eventElementHandlers(event, eventElement);
					reportEventElement(event, eventElement);
				}
			});
			return dayRows;
		}
	
		function renderEvents(events, modifiedEventId) {
			events = events.sort(sortEvent);
	
			var table = $('<table class="fc-list-table" align="center"></table>');
			var total = events.length;
			if (total > 0) {
				var date = cloneDate($this.visStart);
				while (date <= $this.visEnd) {
					var dayEvents = eventsOfThisDay(events, date);
					if (dayEvents.length > 0) {
						table.append(renderDay(date, dayEvents));
					}
					date = addDays(date, 1);
				}
			} else {
				table = $('<div>').text('No Events');
	
			}
	
			this.element.html(table);
		}
	
	};
	$.fullCalendar.views.list = ListView;
}

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
		if($("#fullcalendar").length === 1){
			var heightToSet=0;
			if(CalendarShare.defaultConfig['footer'] === true){
				heightToSet+=50; 
			}
			if(CalendarShare.defaultConfig['header'] === true){
				heightToSet+=80; 
			}
			$("#fullcalendar").height(($(window).height()-heightToSet));
			
			$('#fullcalendar').width($(window).width()-$('#leftcontent').width()-25);
		
			$('#fullcalendar').fullCalendar('option', 'height', $(window).height() - $('#controls').height() - $('#header').height()-45 );
		}
	
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
	
	
	
	CalendarShare.init();
	
	
	$('#datecontrol_today').click(function(){
		$('#fullcalendar').fullCalendar('today');
	});
  
   
   }
});