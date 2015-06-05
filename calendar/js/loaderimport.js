/**
 * Copyright (c) 2012 Georg Ehrke <ownclouddev at georgswebsite dot de>
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */

var Calendar = Calendar || {};

Calendar.Import =  {
	Store:{
		file: '',
		path: '',
		id: 0,
		method: '',
		overwrite: 0,
		calname: '',
		calcolor: '',
		progresskey: '',
		percentage: 0,
		isDragged : false
	},
	Dialog:{
		open: function(filename){
			OC.addStyle('calendar', 'import');
			Calendar.Import.Store.file = filename;
			Calendar.Import.Store.path = $('#dir').val();
			$('body').append('<div id="calendar_import"></div>');
			$('#calendar_import').load(OC.generateUrl('apps/calendar/getimportdialogtplcalendar'), {filename:Calendar.Import.Store.file, path:Calendar.Import.Store.path, isDragged:Calendar.Import.Store.isDragged},function(){
					Calendar.Import.Dialog.init();
			});
		},
		close: function(){
			Calendar.Import.reset();
			$('#calendar_import_dialog').dialog('destroy').remove();
			$('#calendar_import_dialog').remove();
		},
		init: function(){
			//init dialog
			$('#calendar_import_dialog').dialog({
				width : 500,
				resizable: false,
				close : function() {
					Calendar.Import.Dialog.close();
				}
			});
			//init buttons
			$('#calendar_import_done').click(function(){
				Calendar.Import.Dialog.close();
			});
			$('#calendar_import_submit').click(function(){
				Calendar.Import.Core.process();
			});
			$('#calendar_import_mergewarning').click(function(){
				$('#calendar_import_newcalendar').attr('value', $('#calendar_import_availablename').val());
				Calendar.Import.Dialog.mergewarning($('#calendar_import_newcalendar').val());
			});
			$('#calendar_import_calendar').change(function(){
				if($('#calendar_import_calendar option:selected').val() == 'newcal'){
					$('#calendar_import_newcalform').slideDown('slow');
					Calendar.Import.Dialog.mergewarning($('#calendar_import_newcalendar').val());
				}else{
					$('#calendar_import_newcalform').slideUp('slow');
					$('#calendar_import_mergewarning').slideUp('slow');
				}
			});
			$('#calendar_import_newcalendar').keyup(function(){
				Calendar.Import.Dialog.mergewarning($.trim($('#calendar_import_newcalendar').val()));
			});
			$('#calendar_import_newcalendar_color').miniColors({
				letterCase: 'uppercase'
			});
			$('.calendar-colorpicker-color').click(function(){
				var str = $(this).attr('rel');
				str = str.substr(1);
				$('#calendar_import_newcalendar_color').attr('value', str);
				$(".color-picker").miniColors('value', '#' + str);
			});
			//init progressbar
			$('#calendar_import_progressbar').progressbar({value: Calendar.Import.Store.percentage});
			Calendar.Import.Store.progresskey = $('#calendar_import_progresskey').val();
		},
		mergewarning: function(newcalname){
			$.post(OC.generateUrl('apps/calendar/checkcalendarexistsimport'), {calname: newcalname}, function(data){
				if(data.message == 'exists'){
					$('#calendar_import_mergewarning').slideDown('slow');
				}else{
					$('#calendar_import_mergewarning').slideUp('slow');
				}
			});
		},
		update: function(){
			if(Calendar.Import.Store.percentage == 100){
				return false;
			}
			$.post(OC.generateUrl('apps/calendar/importeventscalendar'), {progresskey: Calendar.Import.Store.progresskey, getprogress: true}, function(data){
 				if(data.status == 'success'){
 					if(data.percent == null){
	 					return false;
 					}
 					
 					Calendar.Import.Store.percentage = parseInt(data.percent);
					$('#calendar_import_progressbar').progressbar('option', 'value', parseInt(data.percent));
					if(data.percent < 100 ){
						window.setTimeout('Calendar.Import.Dialog.update()', 100);
					}else{
						$('#calendar_import_done').css('display', 'block');
						
					}
				}else{
					$('#calendar_import_progressbar').progressbar('option', 'value', 100);
					$('#calendar_import_progressbar > div').css('background-color', '#FF2626');
					$('#calendar_import_status').html(data.message);
				}
			});
			return 0;
		},
		warning: function(selector){
			$(selector).addClass('calendar_import_warning');
			$(selector).focus(function(){
				$(selector).removeClass('calendar_import_warning');
			});
		}
	},
	Core:{
		process: function(){
			var validation = Calendar.Import.Core.prepare();
			if(validation){
				$('#calendar_import_form').css('display', 'none');
				$('#calendar_import_process').css('display', 'block');
				$('#calendar_import_newcalendar').attr('readonly', 'readonly');
				$('#calendar_import_calendar').attr('disabled', 'disabled');
				$('#calendar_import_overwrite').attr('disabled', 'disabled');
				Calendar.Import.Core.send();
				window.setTimeout('Calendar.Import.Dialog.update()', 250);
			}
		},
		send: function(){
			
			$.post(OC.generateUrl('apps/calendar/importeventscalendar'),
			{progresskey: Calendar.Import.Store.progresskey, method: String (Calendar.Import.Store.method), overwrite: String (Calendar.Import.Store.overwrite), calname: String (Calendar.Import.Store.calname), path: String (Calendar.Import.Store.path), file: String (Calendar.Import.Store.file), id: String (Calendar.Import.Store.id), calcolor: String (Calendar.Import.Store.calcolor),isDragged:String (Calendar.Import.Store.isDragged)}, function(data){
				if(data.status == 'success'){
					$('#calendar_import_progressbar').progressbar('option', 'value', 100);
					Calendar.Import.Store.percentage = 100;
					$('#calendar_import_done').css('display', 'block');
					$('#calendar_import_status').html(data.message);
					
					if(Calendar.Import.Store.isDragged === true){
						
						if(data.eventSource !== ''){
							$('#fullcalendar').fullCalendar('addEventSource', data.eventSource);
							Calendar.Util.rebuildCalView();
						}else{
							$('#fullcalendar').fullCalendar('refetchEvents');
						}
					}
				}else{
					$('#calendar_import_progressbar').progressbar('option', 'value', 100);
					$('#calendar_import_progressbar > div').css('background-color', '#FF2626');
					$('#calendar_import_status').html(data.message);
				}
			});
		},
		prepare: function(){
			Calendar.Import.Store.id = $('#calendar_import_calendar option:selected').val();
			
			if($('#calendar_import_calendar option:selected').val() == 'newcal'){
				Calendar.Import.Store.method = 'new';
				Calendar.Import.Store.calname = $.trim($('#calendar_import_newcalendar').val());
				if(Calendar.Import.Store.calname == ''){
					Calendar.Import.Dialog.warning('#calendar_import_newcalendar');
					return false;
				}
				Calendar.Import.Store.calcolor = $.trim($('#calendar_import_newcalendar_color').val());
				if(Calendar.Import.Store.calcolor == ''){
					Calendar.Import.Store.calcolor = $('.calendar-colorpicker-color:first').attr('rel');
				}
			}else{
				Calendar.Import.Store.method = 'old';
				Calendar.Import.Store.overwrite = $('#calendar_import_overwrite').is(':checked') ? 1 : 0;
			}
			return true;
		}
	},
	reset: function(){
		Calendar.Import.Store.file = '';
		Calendar.Import.Store.path = '';
		Calendar.Import.Store.id = 0;
		Calendar.Import.Store.method = '';
		Calendar.Import.Store.overwrite = 0;
		Calendar.Import.Store.calname = '';
		Calendar.Import.Store.progresskey = '';
		Calendar.Import.Store.percentage = 0;
	}
};

$(document).ready(function(){
	if(typeof FileActions !== 'undefined'){
		FileActions.register('text/calendar','importCalendar',  OC.PERMISSION_READ, '', Calendar.Import.Dialog.open);
		FileActions.setDefault('text/calendar','importCalendar');
	};
});
