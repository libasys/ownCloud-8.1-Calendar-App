/**
 * Copyright (c) 2012 Georg Ehrke <ownclouddev at georgswebsite dot de>
 * Copyright (c) 2011 Bart Visscher <bartv@thisnet.nl>
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */

Calendar = {
	firstLoading : true,
	calendarConfig:null,
	init:function(){
		
		if(Calendar.calendarConfig == null){
			$.getJSON(OC.generateUrl('apps/calendar/calendarsettingsgetusersettingscalendar'), function(jsondata){
				if(jsondata.status == 'success'){
					Calendar.calendarConfig=[];
					Calendar.calendarConfig['defaultView'] = jsondata.defaultView;
					Calendar.calendarConfig['agendatime'] = jsondata.agendatime;
					Calendar.calendarConfig['defaulttime'] = jsondata.defaulttime;
					Calendar.calendarConfig['firstDay'] = jsondata.firstDay;
					Calendar.calendarConfig['categories'] = jsondata.categories;
					Calendar.calendarConfig['tags'] = jsondata.tags;
					
					Calendar.calendarConfig['eventSources'] = jsondata.eventSources;
					Calendar.calendarConfig['calendarcolors'] = jsondata.calendarcolors;
					
					Calendar.calendarConfig['mycalendars'] = jsondata.mycalendars;
					Calendar.calendarConfig['myRefreshChecker'] = jsondata.myRefreshChecker;
					
					Calendar.initCalendar();
					Calendar.Util.calViewEventHandler();
					
				}
			});
			
		}else{
			Calendar.initCalendar();
		}
	},
    initCalendar:function(){
    	
    	var bWeekends = true;
		if (Calendar.calendarConfig['defaultView'] == 'agendaWorkWeek') {
			bWeekends = false;
		}
	   
		var firstHour = new Date().getUTCHours() + 2;
	
		$("#leftcontent").niceScroll();
		$("#rightCalendarNav").niceScroll();
	
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
			firstDay : Calendar.calendarConfig['firstDay'],
			editable : true,
			defaultView : Calendar.calendarConfig['defaultView'],
			aspectRatio : 1.5,
			weekNumberTitle : t('calendar', 'CW '),
			weekNumbers : true,
			weekMode : 'variable',
			firstHour : firstHour,
			weekends : bWeekends,
			timeFormat : {
				agenda : Calendar.calendarConfig['agendatime'],
				'' : Calendar.calendarConfig['defaulttime']
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
			axisFormat : Calendar.calendarConfig['defaulttime'],
			monthNames : monthNames,
			monthNamesShort : monthNamesShort,
			dayNames : dayNames,
			dayNamesShort : dayNamesShort,
			allDayText : t('calendar', 'All day'),
			viewRender : function(view, element) {
				$("#datepickerNav").datepicker("setDate", $('#fullcalendar').fullCalendar('getDate'));
				
				if (view.name != Calendar.calendarConfig['defaultView']) {
					
					$.post(OC.generateUrl('apps/calendar/changeviewcalendar'), {
						v : view.name
					});
					Calendar.calendarConfig['defaultView'] = view.name;
				}
				$('.view button').removeClass('active');
				$('.view button[data-action=' + view.name + ']').addClass('active');
				
				if (view.name == 'list') {
					$('.fc-view-list').height($(window).height() - 150);
				}
				if(view.name == 'agendaDay'){
					Calendar.Util.initAddDayView();
					
				}
				if (view.name == 'month') {
					
					$("#fullcalendar").niceScroll();
				}else{
					$("#scrollDiv").niceScroll();
				}
				
				
				Calendar.Util.rebuildCalendarDim();
				
				try {
					Calendar.Util.setTimeline();
				} catch(err) {
				}
	
			},
			selectable : true,
			selectHelper : true,
			slotMinutes : 15,
			select : Calendar.UI.newEvent,
			eventClick : Calendar.UI.showEvent,
			eventDrop : Calendar.UI.moveEvent,
			eventResize : Calendar.UI.resizeEvent,
			eventRender : Calendar.UI.Events.renderEvents,
			loading : Calendar.UI.loading,
			eventSources : Calendar.calendarConfig['eventSources'],
	
		});
		
		Calendar.Util.rebuildCalView();
		
    },
	Util : {
		showGlobalMessage:function(msg){
			$('#notification').html(msg);
			$('#notification').slideDown();
			window.setTimeout(function(){$('#notification').slideUp();}, 3000);
		},
		Selectable : function(ListSelector, IdReturnField) {
			//var FromDate=$('#from').val().split('-');
			//var fromDay=FromDate[0];
			var logicWD = $('#logicCheckWD').val();
			var InputRadio = '#showOwnDev input[name=radioMonth]';
			var InputCheck = '#showOwnDev input[name=checkMonth]';

			$(ListSelector).each(function(i, el) {
				$(el).on('click', function() {
					var bLogic = true;
					var sFreq = $('#rAdvanced option:selected').val();

					if ((sFreq == 'MONTHLY' && ListSelector == '#rByweekday li') || (sFreq == 'YEARLY' && ListSelector == '#rByweekdayYear li')) {
						if ($(el).data('val') != logicWD) {
							bLogic = false;
						}
					}

					if (!$(el).closest('ul').hasClass('ui-isDisabled') && bLogic === true) {

						if ((sFreq == 'MONTHLY' && $(InputRadio + ':checked').val() == 'onweekday') || (sFreq == 'YEARLY' && $(InputCheck).is(':checked') && ListSelector == '#rByweekdayYear li')) {
							$(ListSelector).removeClass('ui-selected');
							$(this).addClass('ui-selected');
						} else {
							$(this).toggleClass('ui-selected');
							if ($(ListSelector + '.ui-selected').length == 0)
								$(this).addClass('ui-selected');
						}

						// $('#rruleOwnoutput').text(sResultInput);
						//Calendar.Util.rruleToText(sResultInput);
					}
				});
			});
		},
		getrRuleonSubmit : function() {
			var sFreq = $('#rAdvanced option:selected').val();
			var iInterval = $('#rInterval').val();

			var srRule = '';
			if (sFreq == 'DAILY') {
				srRule = 'FREQ=' + sFreq;
			}
			if (sFreq == 'WEEKLY') {
				var sResult = '';
				$('#rByweekdayWeek li.ui-selected').each(function() {
					if (sResult == '')
						sResult = $(this).data('val');
					else {
						sResult += ',' + $(this).data('val');
					}
				});
				srRule = 'FREQ=' + sFreq + ';BYDAY=' + sResult;
			}
			if (sFreq == 'MONTHLY') {
				var sResult = '';
				var sMonthChoose = $('#showOwnDev input[name=radioMonth]:checked').val();
				if (sMonthChoose == 'every') {
					$('#rBymonthday li.ui-selected').each(function() {
						if (sResult == '')
							sResult = $(this).data('val');
						else {
							sResult += ',' + $(this).data('val');
						}
					});
					srRule = 'FREQ=' + sFreq + ';BYMONTHDAY=' + sResult;
				}
				if (sMonthChoose == 'onweekday') {
					var iWeek = $('#weekofmonthoptions option:selected').val();
					$('#rByweekday li.ui-selected').each(function() {
						if (sResult == '')
							sResult = iWeek + $(this).data('val');
						else {
							sResult += ',' + iWeek + $(this).data('val');
						}
					});
					srRule = 'FREQ=' + sFreq + ';BYDAY=' + sResult;
				}
			}
			if (sFreq == 'YEARLY') {
				var sYearChoose = $('#showOwnDev input[name=checkMonth]');
				var sResultMonth = '';
				$('#rBymonth li.ui-selected').each(function() {
					if (sResultMonth == '')
						sResultMonth = $(this).data('val');
					else {
						sResultMonth += ',' + $(this).data('val');
					}
				});
				sResultMonth = ';BYMONTH=' + sResultMonth;

				var sResult = '';
				if (sYearChoose.is(':checked')) {
					var iWeek = $('#weekofmonthoptions option:selected').val();
					$('#rByweekdayYear li.ui-selected').each(function() {
						if (sResult == '')
							sResult = iWeek + $(this).data('val');
						else {
							sResult += ',' + iWeek + $(this).data('val');
						}
					});
					sResult = ';BYDAY=' + sResult;

				}
				srRule = 'FREQ=' + sFreq + sResultMonth + sResult;

			}
			if (Math.floor(iInterval) != iInterval || $.isNumeric(iInterval) == false) {
				iInterval = 1;
			}
			var sRuleReader = Calendar.Util.rruleToText(srRule + ';INTERVAL=' + iInterval);
			$("#rruleoutput").text(sRuleReader);
			$('#lRrule').html('<i style="font-size:12px;" class="ioc ioc-repeat"></i> '+sRuleReader).show();
			$("#sRuleRequest").val(srRule + ';INTERVAL=' + iInterval);

		},
		getReminderonSubmit : function() {
			var sAdvMode = $('#reminderAdvanced option:selected').val();
			var sResult = '';
			if (sAdvMode == 'DISPLAY') {
				var sTimeMode = $('#remindertimeselect option:selected').val();
				//-PT5M
				var rTimeSelect = $('#remindertimeinput').val();

				if (sTimeMode != 'ondate' && (Math.floor(rTimeSelect) == rTimeSelect && $.isNumeric(rTimeSelect))) {
					var sTimeInput = $('#remindertimeinput').val();
					if (sTimeMode == 'minutesbefore') {
						sResult = '-PT' + sTimeInput + 'M';
					}
					if (sTimeMode == 'hoursbefore') {
						sResult = '-PT' + sTimeInput + 'H';
					}
					if (sTimeMode == 'daysbefore') {
						sResult = '-PT' + sTimeInput + 'D';
					}
					if (sTimeMode == 'weeksbefore') {
						sResult = '-PT' + sTimeInput + 'W';
					}
					if (sTimeMode == 'minutesafter') {
						sResult = '+PT' + sTimeInput + 'M';
					}
					if (sTimeMode == 'hoursafter') {
						sResult = '+PT' + sTimeInput + 'H';
					}
					if (sTimeMode == 'daysafter') {
						sResult = '+PT' + sTimeInput + 'D';
					}
					if (sTimeMode == 'weeksafter') {
						sResult = '+PT' + sTimeInput + 'W';
					}
					sResult = 'TRIGGER:' + sResult;
				}
				if (sTimeMode == 'ondate' && $('#reminderdate').val() != '') {
					//20140416T065000Z
					var dateTuple = $('#reminderdate').val().split('-');
					var timeTuple = $('#remindertime').val().split(':');

					var day, month, year, minute, hour;
					day = dateTuple[0];
					month = dateTuple[1];
					year = dateTuple[2];
					hour = timeTuple[0];
					minute = timeTuple[1];

					var sDate = year + '' + month + '' + day + 'T' + hour + '' + minute + '00Z';

					sResult = 'TRIGGER;VALUE=DATE-TIME:' + sDate;
				}
				if (sResult != '') {
					$("#sReminderRequest").val(sResult);
					var sReader = Calendar.Util.reminderToText(sResult);
					$('#reminderoutput').text(sReader);
					$('#lReminder').html(' <i style="font-size:14px;" class="ioc ioc-clock"></i> '+sReader).show();

				} else {
					Calendar.UI.reminder('reminderreset');
					alert('Wrong Input!');
				}
			}
			//alert(sResult);

		},
		reminderToText : function(sReminder) {
			if (sReminder != '') {
				
				var sReminderTxt = '';
				if (sReminder.indexOf('-PT') != -1) {
					//before
					var sTemp = sReminder.split('-PT');
					var sTempTF = sTemp[1].substring((sTemp[1].length - 1));
					if (sTempTF == 'M') {
						sReminderTxt = t('calendar', 'Minutes before');
					}
					if (sTempTF == 'H') {
						sReminderTxt = t('calendar', 'Hours before');
					}
					if (sTempTF == 'D') {
						sReminderTxt = t('calendar', 'Days before');
					}
					if (sTempTF == 'W') {
						sReminderTxt = t('calendar', 'Weeks before');
					}
					var sTime = sTemp[1].substring(0, (sTemp[1].length - 1));
					sReminderTxt = sTime + ' ' + sReminderTxt;
				} else if (sReminder.indexOf('+PT') != -1) {
					var sTemp = sReminder.split('+PT');
					var sTempTF = sTemp[1].substring((sTemp[1].length - 1));
					if (sTempTF == 'M') {
						sReminderTxt = t('calendar', 'Minutes after');
					}
					if (sTempTF == 'H') {
						sReminderTxt = t('calendar', 'Hours after');
					}
					if (sTempTF == 'D') {
						sReminderTxt = t('calendar', 'Days after');
					}
					if (sTempTF == 'W') {
						sReminderTxt = t('calendar', 'Weeks after');
					}
					var sTime = sTemp[1].substring(0, (sTemp[1].length - 1));
					sReminderTxt = sTime + ' ' + sReminderTxt;
				} else {
					//onDate
					sReminderTxt = t('calendar', 'on');
					
					var sTemp = sReminder.split('DATE-TIME:');
					var sDateTime = sTemp[1].split('T');
					var sYear = sDateTime[0].substring(0, 4);
					var sDay = sDateTime[0].substring(4, 6);
					var sMonth = sDateTime[0].substring(6, 8);
				    var sHour='';
				    var sMinute='';
				    var sHM='';
				    
				    if(sDateTime.length > 1){
						 sHour = sDateTime[1].substring(0, 2);
						 sMinute = sDateTime[1].substring(2, 4);
						 sHM =  sHour + ':' + sMinute;
					}
					sReminderTxt = sReminderTxt + ' ' + sDay + '.' + sMonth + '.' + sYear + ' ' +sHM;

				}

				return sReminderTxt;
			} else
				return false;
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
		sendmail : function(eventId, emails) {
			Calendar.UI.loading(true);
			$.post(OC.generateUrl('apps/calendar/sendemaileventics'), {
				eventId : eventId,
				emails : emails,

			}, function(result) {
				if (result.status == 'success') {
					//Lang
					OC.dialogs.alert('E-Mails an: ' + emails + ' erfolgreich versendet.', 'Email erfolgreich versendet');
					$('#inviteEmails').val('');
				} else {
					OC.dialogs.alert(result.data.message, 'Error sending mail');
				}
				Calendar.UI.loading(false);
			});
		},
		addSubscriber : function(eventId, emails, existAttendees) {
			
			$.ajax({
			type : 'POST',
			url : OC.generateUrl('apps/calendar/addsubscriberevent'),
			data :{
				eventId : eventId,
				emails : emails,
				attendees : existAttendees,
			},
			success : function(jsondata) {
				if (jsondata.message == 'sent') {
						//Lang
						OC.dialogs.alert('E-Mails an: ' + emails + ' erfolgreich versendet.', 'Email erfolgreich versendet');
						$('#addSubscriberEmail').val('');
					}
					if (jsondata.message == 'notsent') {
						OC.dialogs.alert('Es wurde keine E-Mail versendet', 'Email nicht versendet');
						$('#addSubscriberEmail').val('');
					}
			}
		});
			
			
		},

		addIconsCal : function(title, src, width) {
			
			//share-alt,repeat,lock,clock-o
			return '<div class="eventIcons"><i title="' + title + '"  class="ioc ioc-' + src + '"></i></div>';
		},
		dateTimeToTimestamp : function(dateString, timeString) {
			dateTuple = dateString.split('-');
			timeTuple = timeString.split(':');

			var day, month, year, minute, hour;
			day = parseInt(dateTuple[0], 10);
			month = parseInt(dateTuple[1], 10);
			year = parseInt(dateTuple[2], 10);
			hour = parseInt(timeTuple[0], 10);
			minute = parseInt(timeTuple[1], 10);

			var date = new Date(year, month - 1, day, hour, minute);

			return parseInt(date.getTime(), 10);
		},

		touchCal : function(EVENTID) {
			$.post(OC.generateUrl('apps/calendar/touchcalendar'), {
				eventid : EVENTID
			}, function(jsondata) {
				$('#fullcalendar').fullCalendar('refetchEvents');
			});
		},
		getDayOfWeek : function(iDay) {
			var weekArray = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
			return weekArray[iDay];
		},
		formatDate : function(year, month, day) {
			if (day < 10) {
				day = '0' + day;
			}
			if (month < 10) {
				month = '0' + month;
			}
			return day + '-' + month + '-' + year;
		},
		formatTime : function(hour, minute) {
			if (hour < 10) {
				hour = '0' + hour;
			}
			if (minute < 10) {
				minute = '0' + minute;
			}
			return hour + ':' + minute;
		},
		adjustDate : function() {
			var fromTime = $('#fromtime').val();
			var fromDate = $('#from').val();
			var fromTimestamp = Calendar.Util.dateTimeToTimestamp(fromDate, fromTime);

			var toTime = $('#totime').val();
			var toDate = $('#to').val();
			var toTimestamp = Calendar.Util.dateTimeToTimestamp(toDate, toTime);

			if (fromTimestamp >= toTimestamp) {
				fromTimestamp += 30 * 60 * 1000;

				var date = new Date(fromTimestamp);
				movedTime = Calendar.Util.formatTime(date.getHours(), date.getMinutes());
				movedDate = Calendar.Util.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate());

				$('#to').val(movedDate);
				$('#totime').val(movedTime);
				
			}
		},
		adjustTime : function() {
			var fromTime = $('#fromtime').val();
			var fromDate = $('#from').val();
			var fromTimestamp = Calendar.Util.dateTimeToTimestamp(fromDate, fromTime);
			var toTime = $('#totime').val();
			var toDate = $('#to').val();
			var toTimestamp = Calendar.Util.dateTimeToTimestamp(toDate, toTime);

			if (fromTimestamp >= toTimestamp) {
				fromTimestamp += 30 * 60 * 1000;

				var date = new Date(fromTimestamp);
				movedTime = Calendar.Util.formatTime(date.getHours(), date.getMinutes());

				$('#totime').val(movedTime);
				
			}
		},
		completedTaskHandler : function(event) {
			$Task = $(this).closest('.taskListRow');
			TaskId = $Task.attr('data-taskid');
			checked = $(this).is(':checked');

			$.post(OC.generateUrl('apps/calendar/setcompletedtaskcalendar'), {
				id : TaskId,
				checked : checked ? 1 : 0
			}, function(jsondata) {
				if (jsondata.status == 'success') {
					task = jsondata.data;
					//$Task.data('task', task)
					$(task).each(function(i,el){
							$task=$('li[data-taskid="'+el.id+'"]');
							$task.addClass('done');
							$task.remove();
					});
					
					
				} else {
					alert(jsondata.data.message);
				}
			});

		},
		rebuildTaskView : function() {
			$.post(OC.generateUrl('apps/calendar/rebuildtaskviewrightcalendar'), function(data) {

				if (data !== '') {
					$('#rightCalendarNav').html(data);
					$('.inputTasksRow').each(function(i, el) {
						$(el).click(Calendar.Util.completedTaskHandler);
					});
				} else {
					$('#tasknavActive').removeClass('button-info');
					$('#rightCalendarNav').addClass('isHiddenTask');
					$('#rightCalendarNav').html('');
					checkedTask = 'false';
					$.post(OC.generateUrl('apps/calendar/calendarsettingssettasknavactive'), {
						checked : checkedTask
					});
				}
				Calendar.Util.rebuildCalendarDim();
			});
		},
		rebuildCalView : function() {
			$.post(OC.generateUrl('apps/calendar/rebuildleftnavigationcalendar'), function(data) {
				
				$('#leftcontent').html(data);

				Calendar.Util.rebuildCalendarDim();
				Calendar.Util.calViewEventHandler();

				Calendar.UI.buildCategoryList();

				$('#categoryCalendarList').hide();
				$('#showCategory').click(function() {
		
					if (! $('#categoryCalendarList').is(':visible')) {
						$('h3[data-id="lCategory"] i.ioc-chevron-down').removeClass('ioc-rotate-270');
						$('#categoryCalendarList').show('fast');
					} else {
						$('#categoryCalendarList').hide('fast');
						$('h3[data-id="lCategory"] i.ioc-chevron-down').addClass('ioc-rotate-270');
					}
				});
				
				$('.view.navigation-left button').each(function(i, el) {
					$(el).on('click', function() {
						$('#fullcalendar').show();
						if ($(this).data('view') === false) {
							$('#fullcalendar').fullCalendar($(this).data('action'));
						} else {
			
							$('#fullcalendar').fullCalendar('option', 'weekends', $(this).data('weekends'));
							$('#fullcalendar').fullCalendar('changeView', $(this).data('action'));
			
						}
					});
				});
			});
		},
		calViewEventHandler : function() {
			$('.activeCalendarNav').on('change', function(event) {
				event.stopPropagation();

				Calendar.UI.Calendar.activation(this, $(this).data('id'));
			});
			$('.iCalendar').on('click', function(event) {
				if (!$(this).closest('.calListen').hasClass('isActiveCal')) {
					$('.calListen').removeClass('isActiveCal');
					$('.calListen .colCal').removeClass('isActiveUserCal');

					CalId = $(this).closest('.calListen').attr('data-id');
					Calendar.UI.Calendar.choosenCalendar(CalId);
				}

			});
			$('.refreshSubscription').on('click', function(event) {
				CalId = $(this).closest('.calListen').attr('data-id');

				if (CalId != 'birthday_' + oc_current_user) {
					Calendar.UI.Calendar.refreshCalendar(CalId);
				}
			});
			$('.toolTip').tipsy({
				html : true,
				gravity:'nw'
			});

			$("#datepickerNav").datepicker({

				minDate : null,
				firstDay: Calendar.calendarConfig['firstDay'],
				onSelect : function(value, inst) {
					var date = inst.input.datepicker('getDate');

					$('#fullcalendar').fullCalendar('gotoDate', date);

					var view = $('#fullcalendar').fullCalendar('getView');

					if (view.name !== 'month' && view.name !== 'list') {
						$("[class*='fc-col']").removeClass('activeDay');
						daySel = Calendar.Util.getDayOfWeek(date.getDay());
						$('td.fc-' + daySel).addClass('activeDay');
					}
					if (view.name == 'month') {
						$('td.fc-day').removeClass('activeDay');
						prettyDate = formatDatePretty(date, 'yy-mm-dd');
						$('td[data-date=' + prettyDate + ']').addClass('activeDay');
					}

				}
			});

		},
		rebuildCalendarDim : function() {
			//$(window).trigger("resize");
          $('#fullcalendar').show();
			var addWidth = 0;
			if ($('#rightCalendarNav').width() == 0 && $('#app-navigation').width() > 0) {
				addWidth = 25;
				//alert($('#leftcontent').width())

			}

			var calWidth = ($(window).width()) - ($('#app-navigation').width() + $('#rightCalendarNav').width() + addWidth);
			if ($(window).width() > 768) {

				
				$('#first-group').css({
					'margin-left' : '5px'
				});
				$('#calendarnavActive').show();
				$('#rightCalendarNav').show();
				$('#tasknavActive').show();
				$('#showDayOfMonth').show();
				$('.fc-event-vert').removeClass('bigSize-vert-resize');
				
			} else {
				
				if ($('#app-navigation').hasClass('isHiddenCal')) {
					$('#calendarnavActive').addClass('button-info');
					$('#app-navigation').removeClass('isHiddenCal');

					Calendar.Util.rebuildCalView();
					$.post(OC.generateUrl('apps/calendar/calendarsettingssetcalendarnavactive'), {
						checked : 'true'
					});
				}
				$('.fc-event-vert').addClass('bigSize-vert-resize');
				$('#calendarnavActive').hide();

				$('#first-group').css({
					'margin-left' : '30px'
				});
				
				calWidth = $(window).width();
				//$('#leftcontentInner').removeClass('addTopLeftContentInner');
				$('#rightCalendarNav').hide();
				$('#tasknavActive').hide();
			}

			if ($('.view button[data-action=agendaDay]').hasClass('active')) {
				calWidth = (calWidth / 2);
				$('#dayMore').width(calWidth - 8);
				$('#dayMore').show();
				$('#datepickerNav').hide();
				
				
				if ($(window).width() > 768) {
					$('#datepickerNav').hide();
					$('#showDayOfMonth').show();
					$('#datepickerDayMore').show();
					$('#DayListMore').removeClass('moveTopDayListMore');
					$('#DayListMore').height($(window).height() - $('#controls').height() - $('#header').height() - 310);
					$('#DayMore').height($(window).height() - $('#controls').height() - $('#header').height()-20);
				} else {
					$('#datepickerNav').show();
					$('#showDayOfMonth').hide();
					$('#datepickerDayMore').hide();
					$('#DayListMore').addClass('moveTopDayListMore');
					
					$('#DayListMore').height($(window).height() - $('#controls').height() - $('#header').height() - 65);
					
					if ($(window).width() < 500) {
						$('#dayMore').width((calWidth * 2));
						$('#fullcalendar').hide();
						
					}
				}

				if ($(window).width() < 1250) {
					$('#showDayOfMonth').hide();
					$('#datepickerDayMore').addClass('datepickerDayMoreWidth');
				} else {
					$('#showDayOfMonth').show();
					$('#datepickerDayMore').removeClass('datepickerDayMoreWidth');
				}
				//alert($('#DayListMore').height());
				
				$("#datepickerDayMore").datepicker("setDate", $('#fullcalendar').fullCalendar('getDate'));
				
			} else {
				$('#dayMore').hide();
				$('#datepickerNav').show();
			}
            $("#fullcalendar").height(($(window).height()-100));
			$('#fullcalendar').width(calWidth-20);
			$('#fullcalendar').fullCalendar('option', 'height', $(window).height() - $('#controls').height() - $('#header').height() - 15);
			$('#controls').width($(window).width());
		},
		setTimeline : function() {
			var curTime = new Date();
			if (curTime.getHours() == 0 && curTime.getMinutes() <= 5)// Because I am calling this function every 5 minutes
			{
				// the day has changed
				var todayElem = $(".fc-today");
				todayElem.removeClass("fc-today");
				todayElem.removeClass("fc-state-highlight");

				todayElem.next().addClass("fc-today");
				todayElem.next().addClass("fc-state-highlight");
			}

			var parentDiv = $(".fc-agenda-slots:visible").parent();
			var timeline = parentDiv.children(".timeline");
			if (timeline.length == 0) {//if timeline isn't there, add it
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
			var percentOfDay = curSeconds / 86400;
			//24 * 60 * 60 = 86400, # of seconds in a day
			var topLoc = Math.floor(parentDiv.height() * percentOfDay);

			timeline.css("top", topLoc + "px");

		},
		initAddDayView : function() {

			$("#datepickerDayMore").datepicker({
				minDate : null,
				firstDay: Calendar.calendarConfig['firstDay'],
				onSelect : function(value, inst) {
					var date = inst.input.datepicker('getDate');

					$('#fullcalendar').fullCalendar('gotoDate', date);
					$("[class*='fc-col']").removeClass('activeDay');
					daySel = Calendar.Util.getDayOfWeek(date.getDay());
					$('td.fc-' + daySel).addClass('activeDay');

					$('#showDayOfMonth').text(date.getDate());

					var nowDay = $.fullCalendar.formatDate(date, 'yyyy/MM/dd');

					if ($('.eventsDate[data-date="' + nowDay + '"]').length > 0) {

						$('#DayListMore').scrollTo('.eventsDate[data-date="' + nowDay + '"]', 800);
						$('.eventsDate').removeClass('selectedDay');
						$('.eventsDate[data-date="' + nowDay + '"]').addClass('selectedDay');
					}

				}
			});
			//Month Events Needs better Check if cal is active or not

			Calendar.Util.loadDayList(true);
			

		},
		loadDayList : function(reload) {
			
			if ($('.view button[data-action=agendaDay]').hasClass('active')) {
              
				var d = $('#fullcalendar').fullCalendar('getDate');
				var month = d.getMonth();
				var year = d.getFullYear();

				var monthYear = month + '-' + year;

				$('#showDayOfMonth').text(d.getDate());

				//alert(monthYear+':'+$('#eventsList').attr('data-date'));
				if (monthYear != $('#eventsList').attr('data-date') || reload === true) {
					var htmlList = '';
					$('#DayListMore').html('');
					
					$.ajax({
						type : 'POST',
						url : OC.generateUrl('apps/calendar/geteventsdayview'),
						data :{
							month : month,
							year : year
						},
						success : function(data) {
							
							var selectedDay = $('#fullcalendar').fullCalendar('getDate');
							var nowDay = $.fullCalendar.formatDate(selectedDay, 'yyyy/MM/dd');

							if (data.sortdate != undefined) {

								$.each(data.sortdate, function(i, elem) {
									//tmpDate=new Date(elem);
									MyDate = $.datepicker.formatDate('DD, dd. MM yy', new Date(elem));

									var AddCssDate = '';
									if (nowDay == elem) {
										AddCssDate = ' selectedDay';
									}
									var dayData = elem;
									htmlList += '<li class="eventsDate' + AddCssDate + '" data-date="' + dayData + '" title="' + dayData + '">' + MyDate + '</li>';
									//$('#datepickerDayMore .ui-state-default').find('text="1"').text();

									if (data.data[elem] != undefined) {
										$.each(data.data[elem], function(it, el) {
											var bgColor = '#D4D5AA';
											var color = '#000000';
											if(el[0]!==undefined){
												if ( typeof Calendar.calendarConfig['calendarcolors'][el[0].calendarid] != 'undefined') {
													bgColor = Calendar.calendarConfig['calendarcolors'][el[0].calendarid]['bgcolor'];
													color = Calendar.calendarConfig['calendarcolors'][el[0].calendarid]['color'];
												}
												var CalDiv = '<span class="colorCal-list" style="margin-top:6px;background-color:' + bgColor + ';">' + '&nbsp;' + '</span>';
												var time = '<span class="timeAgenda">'+t('calendar',"All day")+'</span>';
	
												if (!el[0].allDay) {
													var time = '<span class="timeAgenda">' + $.fullCalendar.formatDates(new Date(el[0].startlist), new Date(el[0].endlist), 'HH:mm{ - HH:mm}') + '</span>';
												}
												//share-alt,repeat,lock,clock-o,eye
												var repeatIcon = '';
												var dateToLoad = el[0].startlist;
												if (el[0].isrepeating) {
													repeatIcon = Calendar.Util.addIconsCal(t('calendar', 'Repeat'), 'repeat', '14');
													dateToLoad = dayData;
												}
												var sharedIcon = '';
												if (el[0].shared) {
													sharedIcon = Calendar.Util.addIconsCal(t('core', 'Shared'), 'share', '14');
												}
												var privatIcon = '';
												if (el[0].privat == 'private') {
													privatIcon = Calendar.Util.addIconsCal(t('calendar', 'Show As'), 'lock', '12');
												}
												if (el[0].privat == 'confidential') {
													privatIcon = Calendar.Util.addIconsCal(t('calendar', 'Show As'), 'eye', '12');
												}
												var alarmIcon = '';
												if (el[0].isalarm) {
													alarmIcon = Calendar.Util.addIconsCal(t('calendar', 'Reminder'), 'clock', '14');
												}
												var location = '';
												if (el[0].location) {
													location = '<span class="listLocation">' + el[0].location + '</span>';
												}
												htmlList += '<li class="eventsRow" data-id="' + el[0].id + '" data-date="' + dateToLoad + '">' + time + ' ' + CalDiv + repeatIcon + sharedIcon + privatIcon + alarmIcon + ' ' + el[0].title + location + '</li>';
										}
										});
									}

								});
							}
							if (htmlList != '') {
								htmlList = '<ul id="eventsList" data-date="' + month + '-' + year + '">' + htmlList + '</ul>';
							} else {
								htmlList = '<ul id="eventsList" data-date="' + month + '-' + year + '"><li class="noEventFound">Keine Termine vorhanden</li></ul>';
							}
							$('#DayListMore').html(htmlList);

							$('.eventsDate').on('click', function() {

								$('.eventsDate').removeClass('selectedDay');
								$(this).addClass('selectedDay');
								$('#fullcalendar').fullCalendar('gotoDate', new Date($(this).attr('data-date')));

							});

							$('.eventsRow').on('click', function() {
								$('#fullcalendar').fullCalendar('gotoDate', new Date($(this).attr('data-date')));
								var calEvent = {};
								calEvent['id'] = $(this).attr('data-id');
								Calendar.UI.showEvent(calEvent, '', '');

							});
							if ($('.eventsDate[data-date="' + nowDay + '"]').length > 0) {
								$('#DayListMore').scrollTo('.eventsDate[data-date="' + nowDay + '"]', 800);
							}

						}
					});

					
				}
			}
		},
		checkShowEventHash : function() {
			var id = parseInt(window.location.hash.substr(1));
			if (id) {
				var calEvent = {};
				calEvent['id'] = id;
				Calendar.UI.showEvent(calEvent, '', '');
			}
		},
	},
	UI : {

		loading : function(isLoading) {
			if (isLoading) {
				$('#loading').show();
			} else {
				if (Calendar.firstLoading == true) {
					Calendar.Util.checkShowEventHash();
						
				}
				$('#loading').hide();

				//  $('#fullcalendar').fullCalendar('today');
				//fc-event
				$(".fc-event").droppable({
					activeClass : "activeHover",
					hoverClass : "dropHover",
					accept : '.categorieslisting',
					over : function(event, ui) {

					},
					drop : function(event, ui) {
						//OC.Kontakte.addCardToGroup($(this).attr('data-id'),ui.draggable.attr('data-id'));
						Calendar.UI.addCategory($(this).find('.fc-event-inner').data('id'), ui.draggable.attr('title'));
						//alert($(this).find('.fc-event-inner').data('id')+':'+ui.draggable.attr('title'));
					}
				});
				
				Calendar.firstLoading = false;
			}

		},

		timerLock : false,
		openShareDialog : function(url, EventId) {
			
			$("#dialogSmall").html('');
			var selCal = $('<select name="calendar" id="calendarAdd"></select>');
			$.each(Calendar.calendarConfig['mycalendars'], function(i, elem) {
				if(elem['issubscribe'] === 0){
					var option = $('<option value="' + elem['id'] + '">' + elem['name'] + '</option>');
					selCal.append(option);
				}
			});

			$('<p>' + t('calendar', 'Please choose a calendar') + '</p>').appendTo("#dialogSmall");
			selCal.appendTo("#dialogSmall");

			$("#dialogSmall").dialog({
				resizable : false,
				title : t('calendar', 'Add Event'),
				width : 350,
				modal : true,
				buttons : [{
					text : t('core', 'Add'),
					click : function() {
						var oDialog = $(this);
						var CalId = $('#calendarAdd option:selected').val();

						$.post(url, {
							'eventid' : EventId,
							'calid' : CalId
						}, function(jsondata) {
							if (jsondata.status == 'success') {
								oDialog.dialog("close");
								$('#event').dialog('destroy').remove();
								$('#fullcalendar').fullCalendar('refetchEvents');
								Calendar.Util.showGlobalMessage(jsondata.msg);
								
							} else {
								alert(jsondata.msg);
							}
						});
					}
				}, {
					text : t('calendar', 'Cancel'),
					click : function() {
						$(this).dialog("close");
					}
				}],

			});

			return false;
		},
		openImportDialog : function(DATA) {
			$("#dialogSmall").html('');
			var selCal = $('<select name="calendar" id="calendarAdd"></select>');
			$.each(Calendar.calendarConfig['mycalendars'], function(i, elem) {
				var createEvent = (elem['permissions'] & OC.PERMISSION_CREATE) ? true : false;
				
				if(elem['id'] != 'birthday_'+oc_current_user && elem['issubscribe'] == false && createEvent !== false){
					var option = $('<option value="' + elem['id'] + '">' + elem['name'] + '</option>');
					selCal.append(option);
				}
			});
			
			var optionNew = $('<option value="newCal">' + t('calendar', 'create a new calendar') + '</option>');
			selCal.append(optionNew);
			var divInner = $('<div />').attr({'id':'innerImport'});
			divInner.appendTo("#dialogSmall");
			
			$('<p>' + t('calendar', 'Please choose a calendar') + '</p>').appendTo(divInner);
			selCal.appendTo(divInner);
			$('<div id="newcalform" style="display:none;"><br><input id="calendar_newcalendar_color" class="color-picker" type="hidden" size="6" value=""><input id="calendar_import_newcalendar" style="width:80%;" class="" type="text" placeholder="' + t('calendar', 'Name of new calendar') + '" value=""></div><div  id="calendar_import_mergewarning" class="hint" style="display:none;">' + t('calendar', 'A Calendar with this name already exists. If you continue anyhow, these calendars will be merged.') + '</div>').appendTo(divInner);

			$('#calendarAdd').change(function() {
				if ($('#calendarAdd option:selected').val() == 'newCal') {
					$('#newcalform').slideDown('slow');
					Calendar_Import.Dialog.mergewarning($('#calendar_import_newcalendar').val());
				} else {
					$('#newcalform').slideUp('slow');
					$('#calendar_import_mergewarning').slideUp('slow');
				}
			});
			$('#calendar_import_newcalendar').keyup(function() {
				Calendar_Import.Dialog.mergewarning($.trim($('#calendar_import_newcalendar').val()));
			});

			$('#calendar_newcalendar_color').miniColors({
				letterCase : 'uppercase'
			});

			$("#dialogSmall").dialog({
				resizable : false,
				title : t('calendar', 'Add Event'),
				width : 450,
				modal : true,
				buttons : [{
					text : t('core', 'Add'),
					click : function() {
						var oDialog = $(this);
						var CalId = $('#calendarAdd option:selected').val();

						$.post(OC.generateUrl('apps/calendar/importeventsperdropcalendar'), {
							'data' : DATA,
							'calid' : CalId,
							'addCal' : $('#calendar_import_newcalendar').val(),
							'addCalCol' : $('#calendar_newcalendar_color').val()
						}, function(jsondata) {
							if (jsondata.status == 'success') {
								//oDialog.dialog( "close" );
								if (jsondata.eventSource != '') {
									$('#fullcalendar').fullCalendar('addEventSource', jsondata.eventSource);
									Calendar.Util.rebuildTaskView();
									Calendar.Util.rebuildCalView();
								} else {
									$('#fullcalendar').fullCalendar('refetchEvents');
								}
								$('#calendar_import_mergewarning').html(jsondata.message);
								$('#calendar_import_mergewarning').slideDown();
								//$('#dialog').html('');
							} else {
								alert(jsondata.message);
							}
						});
					}
				}, {
					text : t('calendar', 'Ready'),
					click : function() {
						$(this).dialog("close");
						$('#innerImport').remove();

					}
				}],

			});

			return false;
		},
		startShowEventDialog : function() {
			Calendar.UI.loading(false);
			
			$('#fullcalendar').fullCalendar('unselect');

			Calendar.UI.lockTime();

			$('#closeDialog').on('click', function() {
				if ($('#haveshareaction').val() == '1') {

					Calendar.Util.touchCal($('#eventid').val());
				}
				$('#event').dialog('destroy').remove();
			});

			$("#event").tabs({
				selected : 0
			});
			$('.tipsy').remove();
			
			$('#event').dialog({
				width : 400,
				height : 'auto',
				beforeClose: function( event, ui ) {
					if(OC.Share.droppedDown){
						OC.Share.hideDropDown();
					}
				},
				close : function(event, ui) {
					if ($('#haveshareaction').val() == '1') {
					Calendar.Util.touchCal($('#eventid').val());
				}
				$('#event').dialog('destroy').remove();
				}
			});
			
			var winWidth=$(window).width();
			
			if(winWidth <= 440){
				$('#event').dialog('option',{"width":(winWidth-20)});
			}
			
			var sReminderReader = '';
			$('.sReminderRequest').each(function(i, el) {
				sRead = Calendar.Util.reminderToText($(this).val());
				if (sReminderReader == '')
					sReminderReader = sRead;
				else {
					sReminderReader += '<br />' + sRead;
				}
			});
			$('#reminderoutput').html(sReminderReader);

			var sRuleReader = Calendar.Util.rruleToText($('#sRuleRequest').val());
			$("#rruleoutput").text(sRuleReader);

			//var sReminderReader=Calendar.Util.reminderToText($('#sReminderRequest').val());

			$('.exdatelistrow').each(function(i, el) {

				$(el).on('click', function() {
					Calendar.UI.removeExdate($(el).data('exdate'));
				});
			});

			//Calendar.UI.Share.init();

			$('#sendemailbutton').click(function() {
				if ($('#inviteEmails').val() !== '') {

					Calendar.Util.sendmail($(this).attr('data-eventid'), $('#inviteEmails').val());
				}
			});

			$('#addSubscriber').click(function() {
				if ($('#addSubscriberEmail').val() !== '') {
					var existAttendees = [];
					$('.attendeerow').each(function(i, el) {
						existAttendees[i] = $(el).attr('data-email');
					});
					Calendar.Util.addSubscriber($(this).attr('data-eventid'), $('#addSubscriberEmail').val(), existAttendees);
				}
			});

			$('#showEvent-delete').on('click', function() {
				var delink = $(this).data('link');

				$("#dialogSmall").text(t('calendar', 'Are you sure?'));

				$("#dialogSmall").dialog({
					resizable : false,
					title : t('calendar', 'Delete Event'),
					width : 210,
					modal : true,
					buttons : [{
						text : t('calendar', 'No'),
						'class' : 'cancelDialog',
						click : function() {
							$("#dialogSmall").html('');
							$(this).dialog("close");
						}
					}, {
						text : t('calendar', 'Yes'),
						'class' : 'okDialog',
						click : function() {
							var oDialog = $(this);
							Calendar.UI.submitShowDeleteEventForm(delink);
							$("#dialogSmall").html('');
							oDialog.dialog("close");
						}
					}],
				});
				return false;
			});

			$('#editEvent-add').on('click', function() {
				Calendar.UI.openShareDialog($(this).data('link'), $('#eventid').val());
			});

			$('#editEventButton').on('click', function() {
				var calEvent = {};
				calEvent['id'] = $('#eventid').val();
				calEvent['start'] = $('#choosendate').val();
				//alert($('#eventid').val());
				Calendar.UI.editEvent(calEvent, '', '');
				return false;
			});

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
			OC.Share.loadIcons('event');
			
			return false;
		},
		startEventDialog : function() {
			Calendar.UI.loading(false);

			$('#fullcalendar').fullCalendar('unselect');

			Calendar.UI.lockTime();
			
			/*
			if($('#from').val() == $('#to').val()){
				 $('#lenddate').hide();
			}*/

			if ($('#submitNewEvent').length == 0) {

				var sRule = Calendar.Util.rruleToText($("#sRuleRequest").val());
				if (sRule != ''){
					$("#rruleoutput").text(sRule);
					$("#lRrule").html('<i style="font-size:12px;" class="ioc ioc-repeat"></i> '+sRule);
					$('#linfoRepeatReminder').hide();
				}

				var sReminder = Calendar.Util.reminderToText($("#sReminderRequest").val());
				
				if (sReminder != ''){
					$("#reminderoutput").text(sReminder);
					$("#lReminder").html('<i style="font-size:14px;" class="ioc ioc-clock"></i> '+sReminder);
					$('#linfoRepeatReminder').hide();
				}
				
				$('#accordion span.ioc-checkmark').hide();
				if($('#event_form input[name="link"]').val() != ''){
					$('#accordion span.lurl').show();
				}
				if($('#event_form textarea[name="description"]').val() != ''){
					$('#accordion span.lnotice').show();
				}
				if($('#event_form input[name="categories"]').val() != ''){
					$('#accordion span.ltag').show();
				}
				OC.Share.loadIcons('event');
			}else {
				$('#rEndRepeat').hide();
				$('#rEndRepeatOutput').hide();
				$('#accordion span.ioc-checkmark').hide();
				$('#event-title').bind('keydown', function(event){
				if (event.which == 13){
					Calendar.UI.validateEventForm($('#submitNewEvent').data('link'));
				}
			});
			}
			
            $( "#accordion" ).accordion({
		      collapsible: true,
		      heightStyle: "content",
		      active: false,
		      animate:false
		    });
             
             
			$('#editEvent-delete').on('click', function() {
				var delink = $(this).data('link');

				$("#dialogSmall").html(t('calendar', 'Are you sure?'));

				$("#dialogSmall").dialog({
					resizable : false,
					title : t('calendar', 'Delete Event'),
					width : 210,
					modal : true,
					buttons : [{
						text : t('calendar', 'No'),
						'class' : 'cancelDialog',
						click : function() {
							$(this).dialog("close");
						}
					}, {
						text : t('calendar', 'Yes'),
						'class' : 'okDialog',
						click : function() {
							//alert(delink);

							var oDialog = $(this);
							Calendar.UI.submitDeleteEventForm(delink);
							oDialog.dialog("close");
						}
					}],
				});
				return false;

			});
			//INIT
			var FromTime = $('#fromtime').val().split(':');
			$('#from').datetimepicker({
				altField : '#fromtime',
				dateFormat : 'dd-mm-yy',
				firstDay: Calendar.calendarConfig['firstDay'],
				stepMinute : 5,
				minDate : null,
				numberOfMonths : 1,
				hour : FromTime[0],
				minute : FromTime[1],
				addSliderAccess : true,
				sliderAccessArgs : {
					touchonly : false
				},
				showButtonPanel : false,
				onClose : function(dateText, inst) {
					if ($('#to').val() != '') {
						var testStartDate = $('#from').datetimepicker('getDate');
						var testEndDate = $('#to').datetimepicker('getDate');

						if (testStartDate > testEndDate) {
							$('#to').datetimepicker('setDate', $('#from').datetimepicker('getDate'));
						}
					} else {
						$('#to').val(dateText);
					}
					Calendar.Util.adjustTime();
					var startDateTxt=$.datepicker.formatDate('dd.mm.yy',$('#from').datetimepicker('getDate'));
					var toDateTxt=$.datepicker.formatDate('dd.mm.yy',$('#to').datetimepicker('getDate'));
					Calendar.UI.setDateTimeLabelonEvent(startDateTxt,toDateTxt);
				},
				onSelect : function(selectedDateTime) {
					//$('#to').datetimepicker('option', 'minDateTime', $('#from').datetimepicker('getDate'));
					
				}
			});
			
			
			
			var ToTime = $('#totime').val().split(':');
			$('#to').datetimepicker({
				altField : '#totime',
				firstDay: Calendar.calendarConfig['firstDay'],
				dateFormat : 'dd-mm-yy',
				stepMinute : 5,
				numberOfMonths : 1,
				hour : ToTime[0],
				minute : ToTime[1],
				minDate : null,
				addSliderAccess : true,
				sliderAccessArgs : {
					touchonly : false
				},
				showButtonPanel : false,
				onClose : function(dateText, inst) {

					if ($('#from').val() != '') {
						var testStartDate = $('#from').datetimepicker('getDate');

						var testEndDate = $('#to').datetimepicker('getDate');
						if (testStartDate > testEndDate){
							$('#from').datetimepicker('setDate', testEndDate);
						}
					} else {
						$('#from').val(dateText);
					}
					
					Calendar.Util.adjustTime();
					var startDateTxt=$.datepicker.formatDate('dd.mm.yy',$('#from').datetimepicker('getDate'));
					var toDateTxt=$.datepicker.formatDate('dd.mm.yy',$('#to').datetimepicker('getDate'));
					Calendar.UI.setDateTimeLabelonEvent(startDateTxt,toDateTxt);
					
				},
				onSelect : function(selectedDateTime) {
					//alert($('#from').datetimepicker('getDate'));
					//$('#from').datetimepicker('option', 'maxDate', $('#to').datetimepicker('getDate'));
					
				}
			});
			//INIT
			
			var startDateTxt=$.datepicker.formatDate('dd.mm.yy',$('#from').datetimepicker('getDate'));
			var toDateTxt=$.datepicker.formatDate('dd.mm.yy',$('#to').datetimepicker('getDate'));
			Calendar.UI.setDateTimeLabelonEvent(startDateTxt,toDateTxt);
			
			
			//Reminder
			$('#reminderdate').datetimepicker({
				altField : '#remindertime',
				dateFormat : 'dd-mm-yy',
				stepMinute : 5,
				numberOfMonths : 1,
				addSliderAccess : true,
				sliderAccessArgs : {
					touchonly : false
				},
				showButtonPanel : false
			});

			Calendar.UI.reminder('init');
			
			$('#reminderAdvanced').change(function() {
				Calendar.UI.reminder('reminder');
			});
			$('#remindertimeselect').change(function() {
				Calendar.UI.reminder('remindertime');
			});
             /*
			$('#category').multiple_autocomplete({
				source : categoriesSel
			});*/
				aExitsTags=false;
				if($('#categories').val()!=''){
					var sExistTags = $('#categories').val();
					var aExitsTags = sExistTags.split(",");
				}
				
				$('#tagmanager').tagit({
					tagSource : Calendar.calendarConfig['categories'],
					maxTags : 4,
					initialTags : aExitsTags,
					allowNewTags : false,
					placeholder :t('calendar', 'Add Tags'),
				});

			//INIT
			var sCalendarSel = '#sCalSelect.combobox';
			$(sCalendarSel + ' ul').hide();
			if ($(sCalendarSel + ' li').hasClass('isSelected')) {
				$(sCalendarSel + ' .selector').html('<span class="colCal" style="width:26px;height:26px;margin-top:5px;cursor:pointer;float:none;background-color:' + $(sCalendarSel + ' li.isSelected').data('color') + '">&nbsp;<span>');
			}
			$(sCalendarSel + ' .selector').on('click', function() {
				if ($(sCalendarSel + ' ul').is(':visible')) {
					$(sCalendarSel + ' ul').slideUp();
				} else {
					$(sCalendarSel + ' ul').slideDown();
				}
			});
			$(sCalendarSel + ' li').click(function() {
				$(this).parents(sCalendarSel).find('.selector').html('<span class="colCal" style="width:26px;height:26px;margin-top:5px;float:none;background-color:' + $(this).data('color') + '">&nbsp;<span>');
				$(sCalendarSel + ' li .colCal').removeClass('isSelectedCheckbox');
				$(sCalendarSel + ' li').removeClass('isSelected');
				$('#hiddenCalSelection').val($(this).data('id'));
				$(this).addClass('isSelected');
				$(this).find('.colCal').addClass('isSelectedCheckbox');
				$(sCalendarSel + ' ul').hide();
			});
			//ENDE

			//sRepeatSelect
			var sRepeaterSel = '#sRepeatSelect.combobox';
			$(sRepeaterSel + ' ul').hide();
			if ($(sRepeaterSel + ' li').hasClass('isSelected')) {
				$(sRepeaterSel + ' .selector').html($(sRepeaterSel + ' li.isSelected').text());
				
				if ($(sRepeaterSel + ' li.isSelected').data('id') != 'doesnotrepeat') {
					$('#rEndRepeat').show();
					$('#rEndRepeatOutput').show();
				}else{
					$('#rEndRepeat').hide();
						$('#rEndRepeatOutput').hide();
				}
			}
			$(sRepeaterSel + ' .comboSelHolder').on('click', function() {
				$(sRepeaterSel + ' ul').toggle();
			});
			$(sRepeaterSel + ' li').click(function() {
				$(sRepeaterSel + ' li .colCal').removeClass('isSelectedCheckbox');
				$(sRepeaterSel + ' li').removeClass('isSelected');
				$('#repeat').val($(this).data('id'));
				if ($(this).data('id') == 'OWNDEF') {
					$('#showOwnDev').show();
					$('#rEndRepeat').show();
					$('#rEndRepeatOutput').show();
				} else {
					$('#sRuleRequest').val('FREQ=' + $(this).data('id') + ';INTERVAL=1');
					$("#rruleoutput").text('');
					$('#rEndRepeat').show();
					$('#linfoRepeatReminder').hide();
					var sRuleReader = Calendar.Util.rruleToText($('#sRuleRequest').val());
					$('#lRrule').html('<i style="font-size:12px;" class="ioc ioc-repeat"></i> '+sRuleReader).show();
					//$('#rEndRepeatOutput').show();
				}
				if ($(this).data('id') == 'doesnotrepeat') {
					$('#rEndRepeat').hide();
					$('#rEndRepeatOutput').hide();
					$('#lRrule').hide();
					if(!$('#lReminder').is(':visible')){
						$('#linfoRepeatReminder').show();
					}
				}
				$(this).addClass('isSelected');
				$(this).parents(sRepeaterSel).find('.selector').html($(this).text());
				$(this).find('.colCal').addClass('isSelectedCheckbox');
				$(sRepeaterSel + ' ul').hide();
			});

			//sRepeatSelect
			var sReminderSel = '#sReminderSelect.combobox';
			$(sReminderSel + ' ul').hide();
			if ($(sReminderSel + ' li').hasClass('isSelected')) {
				$(sReminderSel + ' .selector').html($(sReminderSel + ' li.isSelected').text());
				if ($(sReminderSel + ' li.isSelected').data('id') != 'OWNDEF') {
					$('#reminderTrOutput').hide();
				}
			}
			$(sReminderSel + ' .comboSelHolder').on('click', function() {
				$(sReminderSel + ' ul').toggle();
			});
			$(sReminderSel + ' li').click(function() {
				$(sReminderSel + ' li .colCal').removeClass('isSelectedCheckbox');
				$(sReminderSel + ' li').removeClass('isSelected');
				$('#reminder').val($(this).data('id'));
				if ($(this).data('id') == 'OWNDEF') {
					$('#showOwnReminderDev').show();
					$('#reminderTrOutput').show();
				} else if($(this).data('id') != 'none') {
					$('#sReminderRequest').val('TRIGGER:' + $(this).data('id'));
					$('#reminderTrOutput').hide();
					$('#linfoRepeatReminder').hide();
					var sReminderReader = Calendar.Util.reminderToText($('#sReminderRequest').val());
					$('#lReminder').html(' <i style="font-size:14px;" class="ioc ioc-clock"></i> '+sReminderReader).show();
				}	else {
					if($(this).data('id') == 'none'){
						$('#reminderTrOutput').hide();
						$('#lReminder').hide();
						if(!$('#lRrule').is(':visible')){
						$('#linfoRepeatReminder').show();
					}
					}
				}
				$(this).addClass('isSelected');
				$(this).parents(sReminderSel).find('.selector').html($(this).text());
				$(this).find('.colCal').addClass('isSelectedCheckbox');
				$(sReminderSel + ' ul').hide();
			});

			Calendar.UI.repeat('init');
			$('#end').change(function() {
				Calendar.UI.repeat('end');
			});
			$('#rAdvanced').change(function() {
				Calendar.UI.repeat('repeat');
			});

			$('#closeDialog').on('click', function() {
				if ($('#haveshareaction').val() == '1') {
					Calendar.Util.touchCal($('#eventid').val());
				}
				$('#event').dialog('destroy').remove();
				return false;
			});

	
			$('.tipsy').remove();
			$('#event').dialog({
				width : 450,
				title : t('calendar', 'Edit an event'),
				height : 'auto',
				beforeClose: function( event, ui ) {
					if(OC.Share.droppedDown){
						OC.Share.hideDropDown();
					}
				},
				closeOnEscape : true,
				close : function(event, ui) {
					if ($('#haveshareaction').val() == '1') {
						Calendar.Util.touchCal($('#eventid').val());
					}
					$('#event').dialog('destroy').remove();
					return false;
				}
			});
			var winWidth=$(window).width();
			
			if(winWidth <500){
				$('#event').dialog('option',{"width":(winWidth-20)});
			}

			$('#sendemailbutton').click(function() {
				Calendar.Util.sendmail($(this).attr('data-eventid'));
			});
			/*
			$('#editEventButton').on('click', function() {
				var calEvent = {};
				calEvent['id'] = $('#eventid').val();
				//alert($('#eventid').val());
				Calendar.UI.editEvent(calEvent, '', '');

			});*/
			return false;
		},
		newEvent : function(start, end, allday) {

			start = Math.round(start.getTime() / 1000);
			if (end) {
				end = Math.round(end.getTime() / 1000);
			}
			if ($('#event').dialog('isOpen') == true) {
				// TODO: save event
				
				$('#event').dialog('destroy').remove();
			} else {
				Calendar.UI.loading(true);
				
				$('#dialog_holder').load(OC.generateUrl('apps/calendar/getnewformevent'), {
					start : start,
					end : end,
					allday : allday ? 1 : 0
				}, Calendar.UI.startEventDialog);
			}
		},
		showEvent : function(calEvent, jsEvent, view) {
			
			var id = calEvent.id;
			var choosenDate = '';
			if ( typeof calEvent.start != 'undefined') {
				choosenDate = Math.round(calEvent.start.getTime() / 1000);
			}
			if ($('#event').dialog('isOpen') == true) {
				// TODO: save event
				$('#event').dialog('destroy').remove();
			} else {
				Calendar.UI.loading(true);
				$('#dialog_holder').load(OC.generateUrl('apps/calendar/getshowevent'), {
					id : id,
					choosendate : choosenDate
				}, Calendar.UI.startShowEventDialog);
			}
		},

		editEvent : function(calEvent, jsEvent, view) {

			var choosenDate = calEvent.start;
			/*
			 if (calEvent.editable == false || calEvent.source.editable == false) {
			 return;
			 }*/
			var id = calEvent.id;
			//if($('#event').dialog('isOpen') == true){
			// TODO: save event
			$('#event').dialog('destroy').remove();
			//}else{
			Calendar.UI.loading(true);
			
			$('#dialog_holder').load(OC.generateUrl('apps/calendar/geteditformevent'), {
				id : id,
				choosendate : choosenDate
			}, Calendar.UI.startEventDialog);
			//}
		},
		submitDeleteEventForm : function(url) {
			var id = $('input[name="id"]').val();

			$("#errorbox").css('display', 'none').empty();
			Calendar.UI.loading(true);
			
			$.ajax({
				type : 'POST',
				url : url,
				data :{
					id :id,
				},
				success : function(jsondata) {
					Calendar.UI.loading(false);
					$('#fullcalendar').fullCalendar('removeEvents', id);
					$('#event').dialog('destroy').remove();
					Calendar.UI.timerLock = true;
					
				}
			});
			
		},
		submitShowDeleteEventForm : function(url) {
			var id = $('input[name="eventid"]').val();

			$("#errorbox").css('display', 'none').empty();
			Calendar.UI.loading(true);
			$.ajax({
				type : 'POST',
				url : url,
				data :{
					id :id,
				},
				success : function(jsondata) {
					Calendar.UI.loading(false);
					$('#fullcalendar').fullCalendar('removeEvents', id);
					$('#event').dialog('destroy').remove();
						Calendar.UI.timerLock = true;
						Calendar.Util.loadDayList(true);
				}
			});
			
		},
		submitDeleteEventSingleForm : function(url) {

			var id = $('#eventid').val();
			var choosenDate = $('#choosendate').val();
			var allDay = $('input[name="allday"]').is(':checked');

			$("#errorbox").css('display', 'none').empty();
			Calendar.UI.loading(true);
			$.ajax({
				type : 'POST',
				url : url,
				data :{
					id :id,
					choosendate : choosenDate,
					allday : allDay
				},
				success : function(jsondata) {
					Calendar.UI.loading(false);
					$('#fullcalendar').fullCalendar('refetchEvents');
					$('#event').dialog('destroy').remove();
					Calendar.UI.timerLock = true;
					Calendar.Util.loadDayList(true);
				}
			});
			
			

		},
		removeExdate : function(choosenDate) {

			var id = $('#eventid').val();
			
			$.ajax({
				type : 'POST',
				url : OC.generateUrl('apps/calendar/deleteexdateevent'),
				data :{
					id : id,
					choosendate : choosenDate
				},
				success : function(jsondata) {
					$('li.exdatelistrow[data-exdate=' + choosenDate + ']').remove();
					$('#fullcalendar').fullCalendar('refetchEvents');
				}
			});

			

		},

		validateEventForm : function(url) {
			
			var string = '';
						var objTags = $('#tagmanager').tagit('tags');
						$(objTags).each(function(i, el) {
							if (string == '') {
								string = el.value;
							} else {
								string += ',' + el.value;
							}
						});
						$('#categories').val(string);
			
			var post = $("#event_form").serialize();
			$("#errorbox").css('display', 'none').empty();
			Calendar.UI.loading(true);
			$.post(url, post, function(data) {
				Calendar.UI.loading(false);
				
				if (data.status == "error") {

					var output = t('calendar','Missing or invalid fields') + ": <br />";

					if (data.title == "true") {
						output = output + t('calendar','Title') + "<br />";
					}
					if (data.cal == "true") {
						output = output +  t('calendar','Calendar') + "<br />";
					}
					if (data.from == "true") {
						output = output + t('calendar','From Date') + "<br />";
					}
					if (data.fromtime == "true") {
						output = output +  t('calendar','From Time') + "<br />";
					}
					if (data.to == "true") {
						output = output +  t('calendar','To Date') + "<br />";
					}
					if (data.totime == "true") {
						output = output + t('calendar','To Time') + "<br />";
					}
					if (data.endbeforestart == "true") {
						output = output +  t('calendar','The event ends before it starts') + "!<br/>";
					}
					if (data.dberror == "true") {
						output = t('calendar','There was a database fail');
					}
					$("#errorbox").css('display', 'block').html(output);
				} else if (data.status == 'success') {

					$('#event').dialog('destroy').remove();
					$('#fullcalendar').fullCalendar('refetchEvents');

					Calendar.Util.loadDayList(true);

					Calendar.UI.timerLock = true;
				}
			}, "json");
		},
		addCategory : function(iId, category) {
			$.ajax({
			type : 'POST',
			url : OC.generateUrl('apps/calendar/addcategorietoevent'),
			data :{
				id : iId,
				category : category
			},
			success : function(jsondata) {
				if(jsondata.status == 'success'){
					Calendar.UI.loading(false);
					$('.tipsy').remove();
					$('#fullcalendar').fullCalendar('refetchEvents');
				}else{
					Calendar.UI.loading(false);
					Calendar.Util.showGlobalMessage(jsondata.msg);
					$('.tipsy').remove();
				}
				
				
			}
		});
			
		},
		moveEvent : function(event, dayDelta, minuteDelta, allDay, revertFunc) {
			if ($('#event').length != 0) {
				revertFunc();
				return;
			}
			Calendar.UI.loading(true);
			
			$.ajax({
			type : 'POST',
			url : OC.generateUrl('apps/calendar/moveevent'),
			data :{
				id : event.id,
				dayDelta : dayDelta,
				minuteDelta : minuteDelta,
				allDay : allDay ? 1 : 0,
				lastmodified : event.lastmodified
			},
			success : function(jsondata) {
				
				if(jsondata.status == 'success'){
					Calendar.UI.loading(false);
					$('.tipsy').remove();
					event.lastmodified = jsondata.lastmodified;
					Calendar.UI.timerLock = true;
					Calendar.Util.loadDayList(true);
				}else{
					Calendar.UI.loading(false);
					Calendar.Util.showGlobalMessage(jsondata.msg);
					$('.tipsy').remove();
					revertFunc();
					$('#fullcalendar').fullCalendar('updateEvent', event);
				}
			},
			error : function(jsondata) {
				
				Calendar.UI.loading(false);
				$('.tipsy').remove();
				revertFunc();
				$('#fullcalendar').fullCalendar('updateEvent', event);
			}
		});
			
		},
		
		resizeEvent : function(event, dayDelta, minuteDelta, revertFunc) {
			$('.tipsy').remove();
			Calendar.UI.loading(true);
			
			$.ajax({
			type : 'POST',
			url : OC.generateUrl('apps/calendar/resizeevent'),
			data :{
				id : event.id,
				dayDelta : dayDelta,
				minuteDelta : minuteDelta,
				lastmodified : event.lastmodified
			},
			success : function(jsondata) {
				if(jsondata.status == 'success'){
					Calendar.UI.loading(false);
					$('.tipsy').remove();
					event.lastmodified = jsondata.lastmodified;
					Calendar.UI.timerLock = true;
					Calendar.Util.loadDayList(true);
				}else{
					Calendar.UI.loading(false);
					Calendar.Util.showGlobalMessage(jsondata.msg);
					$('.tipsy').remove();
					revertFunc();
					$('#fullcalendar').fullCalendar('updateEvent', event);
				}
				
			},
			error : function(jsondata) {
				Calendar.UI.loading(false);
				$('.tipsy').remove();
				revertFunc();
				$('#fullcalendar').fullCalendar('updateEvent', event);
			}
			});
			
			
		},
		showadvancedoptions : function() {
			$("#advanced_options").slideDown('slow');
			$("#advanced_options_button").css("display", "none");
		},

		getEventPopupText : function(event) {
			if (event.allDay) {
				var timespan = $.fullCalendar.formatDates(event.start, event.end, 'ddd d MMMM[ yyyy]{ - [ddd d] MMMM yyyy}', {
					monthNamesShort : monthNamesShort,
					monthNames : monthNames,
					dayNames : dayNames,
					dayNamesShort : dayNamesShort
				});
				//t('calendar', "ddd d MMMM[ yyyy]{ - [ddd d] MMMM yyyy}")
			} else {
				var timespan = $.fullCalendar.formatDates(event.start, event.end, 'ddd d MMMM[ yyyy] ' + defaulttime + '{ - [ ddd d MMMM yyyy]' + defaulttime + '}', {
					monthNamesShort : monthNamesShort,
					monthNames : monthNames,
					dayNames : dayNames,
					dayNamesShort : dayNamesShort
				});
				//t('calendar', "ddd d MMMM[ yyyy] HH:mm{ - [ ddd d MMMM yyyy] HH:mm}")
				// Tue 18 October 2011 08:00 - 16:00
			}

			var html = '<div class="summary">' + escapeHTML(event.title) + '</div>' + '<div class="timespan">' + timespan + '</div>';
			if (event.rightsoutput != false) {
				html += '<div class="rightsreader">' + escapeHTML(event.rightsoutput) + '</div>';

			}
			if (event.description) {
				html += '<div class="description">' + escapeHTML(event.description) + '</div>';

			}
			if (event.categories.length > 0) {

				html += '<div class="categories">';
				$(event.categories).each(function(i, category) {
					html += '<a class="tag">' + category + '</a>';
				});
				html += '</div>';
			}

			return html;
		},
		setDateTimeLabelonEvent:function(sStart,sEnd){
			//allday_checkbox
			if(sStart == sEnd){
				if ($('#allday_checkbox').is(':checked')) {
					$('#ldatetime').text(t('calendar','On')+' '+sStart);
				}else{
					$('#ldatetime').text(t('calendar','On')+' '+sStart+' '+$('#fromtime').val()+' '+t('calendar','To')+' '+$('#totime').val());
				}
			}else{
				if ($('#allday_checkbox').is(':checked')) {
					$('#ldatetime').text(t('calendar','From')+' '+sStart+' '+t('calendar','To')+' '+sEnd);
				}else{
					$('#ldatetime').text(t('calendar','From')+' '+sStart+' '+$('#fromtime').val()+' '+t('calendar','To')+' '+sEnd+' '+$('#totime').val());
				}
			}
		},
		lockTime : function() {
			if ($('#allday_checkbox').is(':checked')) {
				$("#fromtime").attr('disabled', true).addClass('disabled');
				$("#totime").attr('disabled', true).addClass('disabled');
				$('#lendtime').hide();
				$('#lstarttime').hide();
			} else {
				$("#fromtime").attr('disabled', false).removeClass('disabled');
				$("#totime").attr('disabled', false).removeClass('disabled');
				$('#lendtime').show();
				$('#lstarttime').show();

			}
		},
		showCalDAVUrl : function(username, calname) {
			$('#caldav_url').val(OC.linkToRemote('caldav')+'/calendars/' + username + '/' + calname);
			$('#caldav_url').show();
			$("#caldav_url_close").show();
		},
		reminder : function(task) {
			if (task == 'init') {
				$('#remCancel').on('click', function() {
					$('#showOwnReminderDev').hide();
					if ($('#submitNewEvent').length != 0) {
						Calendar.UI.reminder('reminderreset');

					}
					return false;
				});
				$('#remOk').on('click', function() {
					Calendar.Util.getReminderonSubmit();
					$('#showOwnReminderDev').hide();
					return false;
				});

				$('#showOwnReminderDev').hide();

				//$('.advancedReminder').css('display', 'none');

				Calendar.UI.reminder('reminder');
				Calendar.UI.reminder('remindertime');
			}
			if (task == 'reminderreset') {
				var sReminderSel = '#sReminderSelect.combobox';
				$(sReminderSel + ' li .colCal').removeClass('isSelectedCheckbox');
				$(sReminderSel + ' li').removeClass('isSelected');
				$('#reminder').val('none');
				$('#reminderTrOutput').hide();
				$("#reminderoutput").text('');
				$("#sReminderRequest").val('');
				$(sReminderSel + ' li[data-id=none]').addClass('isSelected');
				$(sReminderSel + ' li[data-id=none]').parents(sReminderSel).find('.selector').html($(sReminderSel + ' li[data-id=none]').text());
				$(sReminderSel + ' li[data-id=none]').find('.colCal').addClass('isSelectedCheckbox');
			}

			if (task == 'reminder') {
				$('.advancedReminder').css('display', 'none');

				if ($('#reminderAdvanced option:selected').val() == 'DISPLAY') {

					$('#reminderemailinputTable').css('display', 'none');
					$('#reminderTable').css('display', 'block');
					$('#remindertimeinput').css('display', 'block');
				}
				if ($('#reminderAdvanced option:selected').val() == 'EMAIL') {
					$('#reminderemailinputTable').css('display', 'block');
					$('#reminderTable').css('display', 'block');
					$('#remindertimeinput').css('display', 'block');
				}
			}
			if (task == 'remindertime') {

				$('#reminderemailinputTable').css('display', 'none');
				$('#reminderdateTable').css('display', 'none');
				$('#remindertimeinput').css('display', 'block');
				if ($('#remindertimeselect option:selected').val() == 'ondate') {
					$('#reminderdateTable').css('display', 'block');
					$('#remindertimeinput').css('display', 'none');
				}
			}
		},

		repeat : function(task) {
			if (task == 'init') {

				$('#rCancel').on('click', function() {
					$('#showOwnDev').hide();
					if ($('#submitNewEvent').length != 0) {
						// $('#repeat option[value=doesnotrepeat]').attr('selected','selected');
						var sRepeaterSel = '#sRepeatSelect.combobox';
						$(sRepeaterSel + ' li .colCal').removeClass('isSelectedCheckbox');
						$(sRepeaterSel + ' li').removeClass('isSelected');
						$('#repeat').val('doesnotrepeat');
						$('#rEndRepeat').hide();
						$('#rEndRepeatOutput').hide();
						$("#rruleoutput").text('');
						$(sRepeaterSel + ' li[data-id=doesnotrepeat]').addClass('isSelected');
						$(sRepeaterSel + ' li[data-id=doesnotrepeat]').parents(sRepeaterSel).find('.selector').html($(sRepeaterSel + ' li[data-id=doesnotrepeat]').text());
						$(sRepeaterSel + ' li[data-id=doesnotrepeat]').find('.colCal').addClass('isSelectedCheckbox');
					}
					return false;
				});
				$('#rOk').on('click', function() {
					Calendar.Util.getrRuleonSubmit();
					$('#showOwnDev').hide();
					return false;
				});

				$('div#showOwnDev input[type=radio]').change(function(event) {

					if ($(this).val() == 'every') {
						$('#rByweekday').addClass('ui-isDisabled');
						$('#rBymonthday').removeClass('ui-isDisabled');
					}
					if ($(this).val() == 'onweekday') {
						$('#rByweekday').removeClass('ui-isDisabled');
						$('#rBymonthday').addClass('ui-isDisabled');
					}
				});

				$('div#showOwnDev input[name=checkMonth]').click(function(event) {
					$('#rByweekdayYear').toggleClass('ui-isDisabled');
				});

				$('#showOwnDev').hide();

				Calendar.Util.Selectable('#rByweekday li');
				Calendar.Util.Selectable('#rBymonthday li');
				Calendar.Util.Selectable('#rBymonth li');
				Calendar.Util.Selectable('#rByweekdayYear li');
				Calendar.Util.Selectable('#rByweekdayWeek li');

				$('input[name="bydate"]').datepicker({
					minDate : null,
					dateFormat : 'dd-mm-yy'
				});

				Calendar.UI.repeat('end');
				Calendar.UI.repeat('repeat');
			}
			if (task == 'end') {
				$('#byoccurrences').css('display', 'none');
				$('#bydate').css('display', 'none');
				if ($('#end option:selected').val() == 'count') {
					$('#byoccurrences').css('display', 'block');
				}
				if ($('#end option:selected').val() == 'date') {
					$('#bydate').css('display', 'block');
				}
			}
			if (task == 'repeat') {
				$('.advancedRepeat').css('display', 'none');

				if ($('#rAdvanced option:selected').val() == 'DAILY') {
					$('#sInterval').text(t('calendar', 'All'));
					$('#sInterval1').text(t('calendar', 'Days'));
				}

				if ($('#rAdvanced option:selected').val() == 'MONTHLY') {
					$('#sInterval').text(t('calendar', 'All'));
					$('#sInterval1').text(t('calendar', 'Months'));

					$('#checkBoxVisible').hide();
					$('#radioVisible').show();

					$('#advanced_weekday').css('display', 'block');
					$('#advanced_weekofmonth').css('display', 'block');
					$('#advanced_bymonthday').css('display', 'block');

				}
				if ($('#rAdvanced option:selected').val() == 'WEEKLY') {
					$('#sInterval').text(t('calendar', 'All'));
					$('#sInterval1').text(t('calendar', 'Weeks') + ' ' + t('calendar', 'on') + ':');
					$('#advanced_weekdayWeek').css('display', 'block');
				}
				if ($('#rAdvanced option:selected').val() == 'YEARLY') {
					$('#sInterval').text(t('calendar', 'All'));
					$('#checkBoxVisible').show();
					$('#radioVisible').hide();
					$('#sInterval1').text(t('calendar', 'Years') + ' im:');
					$('#advanced_bymonth').css('display', 'block');
					$('#advanced_weekdayYear').css('display', 'block');
					$('#advanced_weekofmonth').css('display', 'block');

				}

			}

		},
		
		categoriesChanged : function(newcategories) {
			
			if(newcategories.length !== Calendar.calendarConfig['categories'].length){
				var newCat = [];
				var newTags={};
				$.each(newcategories, function(i, el) {
					
					if(Calendar.calendarConfig['tags'][el.name]!== undefined){
						newCat[i] = el.name;
						newTags[el.name]=Calendar.calendarConfig['tags'][el.name];
					}else{
						newCat[i] = el.name;
						newTags[el.name]={'name':el.name,'bgcolor':'#006DCC','color':'#ffffff'};
					}
				});
				
				Calendar.calendarConfig['categories'] = newCat;
				Calendar.calendarConfig['tags'] = newTags;
				
				//$('#tagmanager').tagit('destroy');
				Calendar.UI.buildCategoryList();
			}
			
		},
		buildCategoryList : function() {
			var htmlCat = '';
			$.each(Calendar.calendarConfig['tags'], function(i, elem) {
				
				htmlCat += '<li class="categorieslisting" title="' + elem['name'] + '"><span class="catColPrev" style="background-color:'+elem['bgcolor']+';color:'+elem['color']+';">' + elem['name'].substring(0, 1) + '</span> ' + elem['name'] + '</li>';
			});

			$('#categoryCalendarList').html(htmlCat);
			$('.categorieslisting').each(function(i, el) {
				$(el).on('click', function() {
					Calendar.UI.filterCategory($(this).attr('title'));
				});
			});

			$(".categorieslisting").draggable({
				appendTo : "body",
				helper : "clone",
				cursor : "move",
				delay : 500,
				start : function(event, ui) {
					ui.helper.addClass('draggingContact');
				}
			});

		},
		filterCategory : function(catname) {
			$('#fullcalendar .fc-event .categories').find('a.catColPrev').each(function(i, el) {

				if ($(el).attr('title') == catname) {
					$Event = $(el).closest('.fc-event');
					$Event.fadeOut(600).fadeIn(600).fadeOut(400).fadeIn(400);
					/*
					 $Event.animate({marginTop: "-0.6in"},
					 {
					 duration: 1000,
					 complete: function() {
					 $( this ).animate({marginTop: "0in",});
					 }
					 });
					 */
				}
			});
		},
		Events : {
			renderEvents : function(event, element) {
				//share-alt,repeat,lock,clock-o,eye
				var EventInner = element.find('.fc-event-inner').attr({'data-id': event.id});
				
				if (event.orgevent) {
					element.css('border', '2px dotted #000000');
				}
				if (event.bday) {
					
					EventInner.prepend(Calendar.Util.addIconsCal('Happy Birthday', 'birthday-cake', '14'));
					
				}
				if (event.isalarm) {
					EventInner.prepend(Calendar.Util.addIconsCal(t('calendar', 'Reminder'), 'clock', '14'));
				}

				if (event.isrepeating) {
					EventInner.prepend(Calendar.Util.addIconsCal(t('calendar', 'Repeat'), 'repeat', '14'));
				}

				if (event.shared) {
					EventInner.prepend(Calendar.Util.addIconsCal(t('core', 'Shared'), 'share', '14'));
				}
				if (event.privat == 'private') {
					EventInner.prepend(Calendar.Util.addIconsCal(t('calendar', 'Show As'), 'lock', '12'));
				}
				if (event.privat == 'confidential') {
					EventInner.prepend(Calendar.Util.addIconsCal(t('calendar', 'Show As'), 'eye', '12'));
				}

				if (event.categories.length > 0) {
					var $categories = $('<div style="float:right;margin-top:2px;">').addClass('categories').prependTo(EventInner);
					$(event.categories).each(function(i, category) {
						if(Calendar.calendarConfig['tags'][category]){
							$categories.append($('<a>').addClass('catColPrev').css({'background-color':Calendar.calendarConfig['tags'][category]['bgcolor'],'color':Calendar.calendarConfig['tags'][category]['color']}).text(category.substring(0, 1)).attr('title', category));
						}
					});
				}
			}
		},
		Calendar : {
			activation : function(checkbox, calendarid) {
				Calendar.UI.loading(true);
				$.post(OC.generateUrl('apps/calendar/setactivecalendar'), {
					calendarid : calendarid,
					active : checkbox.checked ? 1 : 0
				}, function(data) {
					Calendar.UI.loading(false);
					if (data.status == 'success') {

						checkbox.checked = data.active == 1;

						if (data.active == 1) {
							$('#fullcalendar').fullCalendar('addEventSource', data.eventSource);
						} else {

							$('#fullcalendar').fullCalendar('removeEventSource', data.eventSource.url);
						}
						Calendar.Util.loadDayList(true);
						
						Calendar.Util.rebuildTaskView();
						//Calendar.Util.rebuildCalView();
					}

				});
			},
			refreshCalendar : function(calendarid) {
				Calendar.UI.loading(true);
				$.post(OC.generateUrl('apps/calendar/refreshsubscribedcalendar'), {
					calendarid : calendarid
				}, function(jsondata) {
					if (jsondata.status == 'success') {
						Calendar.UI.loading(false);
						$('#fullcalendar').fullCalendar('refetchEvents');
					}
				});

			},
			choosenCalendar : function(calendarid) {
				$.post(OC.generateUrl('apps/calendar/setmyactivecalendar'), {
					calendarid : calendarid
				}, function(jsondata) {
					if (jsondata.status == 'success') {
						$('.calListen[data-id=' + jsondata.choosencalendar + ']').addClass('isActiveCal');
						$('.calListen[data-id=' + jsondata.choosencalendar + '] .colCal').addClass('isActiveUserCal');
					}
				});

			},
			newCalendar : function(object) {
				var tr = $('<tr />').attr('class','treditcal').load(OC.generateUrl('apps/calendar/getnewformcalendar'), function(data) {
					$('input.minicolor').miniColors({
						letterCase : 'uppercase',
					});
					$('#editCalendar-submit').on('click', function () {
							Calendar.UI.Calendar.submit($(this), $(this).data('id'));
						});
						
					$('#editCalendar-cancel').on('click', function () {
								Calendar.UI.Calendar.cancel($(this), $(this).data('id'));
						});
				});
				
				$(object).closest('tr').after(tr).hide();
			},
			edit : function(object, calendarid) {
				var tr = $(document.createElement('tr')).load(OC.generateUrl('apps/calendar/geteditformcalendar'), {
					calendarid : calendarid
				}, function() {
					//Calendar.UI.Calendar.colorPicker(this)
					$('input.minicolor').miniColors({
						letterCase : 'uppercase',
					});
					$('#editCalendar-submit').on('click', function () {
							Calendar.UI.Calendar.submit($(this), $(this).data('id'));
						});
						
					$('#editCalendar-cancel').on('click', function () {
						Calendar.UI.Calendar.cancel($(this), $(this).data('id'));
					});
				});
				$(object).closest('tr').after(tr).hide();
			},
			deleteCalendar : function(calid) {
				
				var check = confirm(t('calendar','Do you really want to delete this calendar?'));

				if (check == false) {
					return false;
				} else {
					$.post(OC.generateUrl('apps/calendar/deletecalendar'), {
						calendarid : calid
					}, function(data) {
						if (data.status == 'success') {
							
							var url =OC.generateUrl('apps/calendar/getevents')+'?calendar_id='+calid;
							$('#fullcalendar').fullCalendar('removeEventSource', url);
							$('#calendarList tr[data-id="' + calid + '"]').fadeOut(400, function() {
								$('#calendarList tr[data-id="' + calid + '"]').remove();
							});
							$('#fullcalendar').fullCalendar('refetchEvents');
							Calendar.Util.rebuildCalView();
						}
					});
				}
			},
			submit : function(button, calendarid) {
				var displayname = $.trim($("#displayname_" + calendarid).val());
				var active = 0;
				if ($("#edit_active_" + calendarid).is(':checked')) {
					active = 1;
				}
				var description = $("#description_" + calendarid).val();

				var calendarcolor = $("#calendarcolor_" + calendarid).val();
				if (displayname == '') {
					$("#displayname_" + calendarid).css('background-color', '#FF2626');
					$("#displayname_" + calendarid).focus(function() {
						$("#displayname_" + calendarid).css('background-color', '#F8F8F8');
					});
				}

				var url;
				if (calendarid == 'new') {
					var externuri = $("#externuri_" + calendarid).val();
					if (externuri !== '') {
						//Lang
						$("#externuri_" + calendarid).after('<div id="messageTxtImportCal">Importiere ... Bitte warten!</div>');
					}
					url = OC.generateUrl('apps/calendar/newcalendar');
				} else {
					url = OC.generateUrl('apps/calendar/editcalendar');
				}

				$.post(url, {
					id : calendarid,
					name : displayname,
					active : active,
					description : description,
					color : calendarcolor,
					externuri : externuri
				}, function(data) {
					if (data.status == 'error') {
						$("#messageTxtImportCal").css('color', 'red').text(data.message);
						$("#externuri_" + calendarid).css('background-color', '#FF2626');
						$("#externuri_" + calendarid).focus(function() {
							$("#externuri_" + calendarid).css('background-color', '#F8F8F8');
						});
						$("#messageTxtImportCal").animate({
							color : 'green',
						}, 3000, function() {
							$(this).remove();
							prevElem.html(data.page).show().next().remove();
						});
					}
					if (data.status == 'success') {

						var prevElem = $(button).closest('tr').prev();

						if (data.countEvents !== false) {
							//Lang
							$("#messageTxtImportCal").text('Importierte Events: ' + data.countEvents);
							$("#messageTxtImportCal").animate({
								color : 'green',
							}, 3000, function() {
								$(this).remove();
								prevElem.html(data.page).show().next().remove();
							});
						} else {
							
							prevElem.html(data.page).show().next().remove();
						}

						$('#fullcalendar').fullCalendar('removeEventSource', data.eventSource.url);
						$('#fullcalendar').fullCalendar('addEventSource', data.eventSource);
						if (calendarid == 'new') {
							$(prevElem).attr('data-id', data.calid);
							
							$('table#calendarList').append('<tr><td colspan="6"><a href="#" id="newCalendar"><input type="button" value="' + t('calendar','New Calendar') + '"></a></td></tr>');
							
						}
						Calendar.Util.rebuildCalView();
					} else {
						//error
						$("#displayname_" + calendarid).css('background-color', '#FF2626');
						$("#displayname_" + calendarid).focus(function() {
							$("#displayname_" + calendarid).css('background-color', '#F8F8F8');
						});
					}
				}, 'json');
			},
			cancel : function(button, calendarid) {
				$(button).closest('tr').prev().show().next().remove();
			}
		},

		Drop : {
			init : function() {
				if ( typeof window.FileReader === 'undefined') {
					console.log('The drop-import feature is not supported in your browser :(');

					return false;
				}

				droparea = document.getElementById('fullcalendar');
				droparea.ondragover = function() {
					return false;
				};
				droparea.ondragend = function() {
					return false;
				};
				droparea.ondrop = function(e) {
					e.preventDefault();
					e.stopPropagation();
					Calendar.UI.Drop.drop(e);
				};
			

			},
			drop : function(e) {
				if (e.dataTransfer != undefined) {
					var files = e.dataTransfer.files;

					for (var i = 0; i < files.length; i++) {

						var file = files[i];
						// alert(file.type);
						if (!file.type.match('text/calendar'))
							continue;

						var reader = new FileReader();
						reader.onload = function(event) {
							Calendar.UI.openImportDialog(event.target.result);

							//Calendar_Import.Dialog.open(event.target.result);
							//$('#fullcalendar').fullCalendar('refetchEvents');
						};
						reader.readAsDataURL(file);
					}
				}
			},
			doImport : function(data) {

				$.post(OC.generateUrl('apps/calendar/importeventsperdropcalendar'), {
					'data' : data
				}, function(result) {
					if (result.status == 'success') {
						$('#fullcalendar').fullCalendar('addEventSource', result.eventSource);
						$('#notification').html(result.message);
						$('#notification').slideDown();
						window.setTimeout(function() {
							$('#notification').slideUp();
						}, 5000);
						return true;
					} else {
						$('#notification').html(result.message);
						$('#notification').slideDown();
						window.setTimeout(function() {
							$('#notification').slideUp();
						}, 5000);
					}
				});
			}
		}
	},
	Settings : {
		//
	},

};

$.fullCalendar.views.list = ListView;
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
		var viewDays = 14;
		if (delta) {
			addDays(date, delta * viewDays);
		}

		var start = addDays(cloneDate(date), -((date.getDay() - opt('firstDay') + viewDays) % viewDays));
		var end = addDays(cloneDate(start), viewDays);

		var visStart = cloneDate(start);
		skipHiddenDays(visStart);

		var visEnd = cloneDate(end);
		skipHiddenDays(visEnd, -1, true);

		$this.title = formatDates(visStart, addDays(cloneDate(visEnd), -1), opt('titleFormat', 'week'));
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
		if ( typeof Calendar.calendarConfig['calendarcolors'][event.calendarid] != 'undefined') {
			bgColor = Calendar.calendarConfig['calendarcolors'][event.calendarid]['bgcolor'];
			color = Calendar.calendarConfig['calendarcolors'][event.calendarid]['color'];
		}
		var imgBday = '';
		if (event.bday) {
			imgBday=Calendar.Util.addIconsCal('Happy Birthday', 'birthday-cake', '14');

		}
		var imgReminder = '';
		if (event.isalarm) {
		   imgReminder=Calendar.Util.addIconsCal(t('calendar', 'Reminder'), 'clock', '14');
		}

		var imgShare = '';
		if (event.shared) {
			 imgShare=Calendar.Util.addIconsCal(t('core', 'Shared'), 'share', '14');
		}

		var imgPrivate = '';

		if (event.privat == 'private') {
			imgPrivate=Calendar.Util.addIconsCal(t('calendar', 'Show As'), 'lock', '14');
		}
		if (event.privat == 'confidential') {
			imgPrivate=Calendar.Util.addIconsCal(t('calendar', 'Show As'), 'eye', '14');
		}
		eventLocation = '';
		if (event.location != '' && event.location != null && typeof event.location != 'undefined') {

			eventLocation = '<span class="location">' + event.location + '</span>';
		}
		var imgRepeating = '';
		if (event.isrepeating) {
		    imgRepeating=Calendar.Util.addIconsCal(t('calendar', 'Repeat'), 'repeat', '14');
		}

		var Kategorien = '';
		if (event.categories.length > 0) {

			Kategorien = '<div style="float:right;margin-top:2px;" class="categories">';

			$(event.categories).each(function(i, category) {
				if(Calendar.calendarConfig['tags'][category]){
					
				Kategorien += '<a class="catColPrev" style="background-color:'+Calendar.calendarConfig['tags'][category]['bgcolor']+';color:'+Calendar.calendarConfig['tags'][category]['color']+';" title="'+category+'">' + category.substring(0, 1) + '</a>';
				}
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

}

function formatDatePretty(date, formatOpt) {
	if ( typeof date == 'number') {
		date = new Date(date);
	}
	return $.datepicker.formatDate(formatOpt, date);
}

/*
 var openEvent = function(id) {
 if(typeof Calendar !== 'undefined') {
 Calendar.openEvent(id);
 } else {
 window.location.href = OC.linkTo('calendar', 'index.php') + '#' + id;
 }
 };
 */

var resizeTimeout = null;
$(window).resize(_.debounce(function() {
	if (resizeTimeout)
		clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(function() {
		Calendar.Util.rebuildCalendarDim();

	}, 500);
}));

$(document).ready(function() {
	
	$(document).on('click', '#event a.share', function(event) {
		event.stopPropagation();
		$('#event #haveshareaction').val('1');
		$('#event #dropdown').css({
			'top' : $(event.target).offset().top + 40,
			'left' : $('#event').offset().left
		});
		
		return true;
	});
	
	
	
	Calendar.init();
	//Calendar.UI.initScroll();
	

	/***NEW ***/

	$('.inputTasksRow').each(function(i, el) {
		$(el).click(Calendar.Util.completedTaskHandler);
	});

	/**END**/

	$(OC.Tags).on('change', function(event, data) {

		if (data.type === 'event') {
			Calendar.UI.categoriesChanged(data.tags);
		}
	});


	

	$('.view button').each(function(i, el) {
		$(el).on('click', function() {
			$('#fullcalendar').show();
			if ($(this).data('view') === false) {
				$('#fullcalendar').fullCalendar($(this).data('action'));
			} else {

				$('#fullcalendar').fullCalendar('option', 'weekends', $(this).data('weekends'));
				$('#fullcalendar').fullCalendar('changeView', $(this).data('action'));

			}
		});
	});

	$('#datecontrol_today').click(function() {
		$('#fullcalendar').fullCalendar('today');
	});

	//Calendar.UI.Share.init();
	Calendar.UI.Drop.init();

	$('#choosecalendarGeneralsettings').on('click keydown', function(event) {
		event.preventDefault();
		var popup = $('#appsettings_popup');
		if(popup.length === 0) {
			$('body').prepend('<div class="popup hidden" id="appsettings_popup"></div>');
			popup = $('#appsettings_popup');
			popup.addClass($('#appsettings').hasClass('topright') ? 'topright' : 'bottomleft');
		}
		if(popup.is(':visible')) {
			if(OC.Share.droppedDown){
				OC.Share.hideDropDown();
			}
			popup.hide().remove();
		} else {
			var arrowclass = $('#appsettings').hasClass('topright') ? 'up' : 'left';
			var url = OC.generateUrl('apps/calendar/calendarsettingsindex');
			$.ajax({
				type : 'GET',
				url : url,
				success : function(data) {
					popup.html(data);
					
					popup.prepend('<span class="arrow '+arrowclass+'"></span><h2>'+t('core', 'Settings')+'</h2><a class="close svg"></a>').show();
					popup.find('.close').bind('click', function() {
						if(OC.Share.droppedDown){
							OC.Share.hideDropDown();
						}
						popup.remove();
					});
					$.getScript(OC.filePath('calendar', 'js', 'settings.js'))
						.fail(function(jqxhr, settings, e) {
							throw e;
						});
					
					
					popup.show();
					
					
				}
			});
		}
		
	});

	//Calendar.Util.rebuildCalendarDim();

	$('#tasknavActive').on('click', function(event) {

		event.stopPropagation();
		var checkedTask = 'false';
		if ($(this).hasClass('button-info')) {
			$(this).removeClass('button-info');
			$('#rightCalendarNav').addClass('isHiddenTask');
			$('#rightCalendarNav').html('');
			Calendar.Util.rebuildCalendarDim();
			checkedTask = 'false';
		} else {
			$(this).addClass('button-info');
			$('#rightCalendarNav').removeClass('isHiddenTask');
			Calendar.Util.rebuildTaskView();
			checkedTask = 'true';
		}
		$.post(OC.generateUrl('apps/calendar/calendarsettingssettasknavactive'), {
			checked : checkedTask
		});

	});

	$('#calendarnavActive').on('click', function(event) {

		event.stopPropagation();
		var checkedCal = false;
		if ($(this).hasClass('button-info')) {
			$(this).removeClass('button-info');
			$('#app-navigation').addClass('isHiddenCal');
			$('#leftcontent').html('');
			Calendar.Util.rebuildCalendarDim();
			checkedCal = false;
		} else {
			$(this).addClass('button-info');
			$('#app-navigation').removeClass('isHiddenCal');
			
			checkedCal = true;
		}
		$.post(OC.generateUrl('apps/calendar/calendarsettingssetcalendarnavactive'), {
			checked : checkedCal
		},function(data){
			if(checkedCal ===true){
				Calendar.Util.rebuildCalView();
			}
		});

	});

	
	$('#editCategoriesList').on('click', function() {
		$(this).tipsy('hide');
		OC.Tags.edit('event');
	});
  
	$('#categoryCalendarList').hide();
	$('#showCategory').click(function() {
			if (! $('#categoryCalendarList').is(':visible')) {
			$('h3[data-id="lCategory"] i.ioc-chevron-down').removeClass('ioc-rotate-270');
			$('#categoryCalendarList').show('fast');
		} else {
			$('#categoryCalendarList').hide('fast');
			$('h3[data-id="lCategory"] i.ioc-chevron-down').addClass('ioc-rotate-270');
		}
	});

});

$(window).bind('hashchange', function() {
	Calendar.Util.checkShowEventHash();
});

