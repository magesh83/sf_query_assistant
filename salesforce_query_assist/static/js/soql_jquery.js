function updateDataTableSelectAllCtrl(table){
   var $table             = table.table().node();
   var $chkbox_all        = $('tbody input[type="checkbox"]', $table);
   var $chkbox_checked    = $('tbody input[type="checkbox"]:checked', $table);
   var chkbox_select_all  = $('thead input[name="select_all"]', $table).get(0);

   // If none of the checkboxes are checked
   if($chkbox_checked.length === 0){
      chkbox_select_all.checked = false;
      if('indeterminate' in chkbox_select_all){
         chkbox_select_all.indeterminate = false;
      }

   // If all of the checkboxes are checked
   } else if ($chkbox_checked.length === $chkbox_all.length){
      chkbox_select_all.checked = true;
      if('indeterminate' in chkbox_select_all){
         chkbox_select_all.indeterminate = false;
      }

   // If some of the checkboxes are checked
   } else {
      chkbox_select_all.checked = true;
      if('indeterminate' in chkbox_select_all){
         chkbox_select_all.indeterminate = true;
      }
   }
}

   var dummy_vals ={"data" : [ ['123456789'] ]};
     $(document).ready(function() {
   // Array holding selected row IDs
   var rows_selected = [];
   var out_arr = [[]];
   var errcapt = {};
	// In the queryhist tab if a query is clicked that text is updated in SOQL Textfield in Query tab 
       // This functionality is implemented partially only
	$('#qhist_html a').click(function () {
		console.log($(this).text());
		function refresh_query(data){$('#post-text').val(data);		}
		refresh_query($(this).text());
	    });
   var table = $('#collistdt').DataTable({
      // 'ajax': 'https://api.myjson.com/bins/1us28',
	// "data" : dummy_vals,
         "scrollY":        "200px",
         "scrollX":        "100px",
        "scrollCollapse": true,
        "paging":         false,
      'columnDefs': [{
         'targets': 0,
         'searchable':false,
         'orderable':false,
         'width':'1%',
         'className': 'dt-body-center',
         'render': function (data, type, full, meta){
             return '<input type="checkbox">';
         }
      }],
     "language": {
      "emptyTable": "Please select a table name to view its columns"
    }, 
      // 'order': [1, 'asc'],
      'rowCallback': function(row, data, dataIndex){
         // Get row ID
         var rowId = data[0];

         // If row ID is in the list of selected row IDs
         if($.inArray(rowId, rows_selected) !== -1){
            $(row).find('input[type="checkbox"]').prop('checked', true);
            $(row).addClass('selected');
         }
      }
   });

	$('.nav-tabs a[href="#query"]').click(function(){
		    $('.nav-tabs a[href="#query"]').tab('show')
		});

	$('.nav-tabs a[href="#qhist_html"]').click(function(){
		    $('.nav-tabs a[href="#qhist_html"]').tab('show')
			refresh_tab();
	$('#qhist_html a').click(function () {
		console.log($(this).text());
		function refresh_query(data){$('#post-text').val(data);		}
		refresh_query($(this).text());
	    });
		});
	$('.nav-tabs a[href="#qanswer_html"]').click(function(){
		    $('.nav-tabs a[href="#qanswer_html"]').tab('show')
		});

	$('.nav-tabs a[href="#query"]').tab('show');

	function refresh_query(data){$('#post-text').val(data);		}
	$('#qhist_html a').click(function () {
	console.log("I'm here");
		refresh_query($(this).text());
	    });
	


		function getCookie(name) {
				var cookieValue = null;
				if (document.cookie && document.cookie !== '') {
					var cookies = document.cookie.split(';');
					for (var i = 0; i < cookies.length; i++) {
						var cookie = jQuery.trim(cookies[i]);
						// Does this cookie string begin with the name we want?
						if (cookie.substring(0, name.length + 1) === (name + '=')) {
							cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
							break;
						}
					}
				}
				return cookieValue;
			}
		var csrftoken = getCookie('csrftoken');

         var ref= $('#qhist_table').DataTable( {
             "processing": true,
			 dom: 'Blfrtip',
			buttons: [
				'copyHtml5', 'excelHtml5',  'csvHtml5'
				],
             "ajax": {
                 "processing": true,
                 "url": "qhist/qhist_ajax_url",
                 "dataSrc": ""
             },


             "columns": [
					 { "data": "fields.query" , "width": "20%" ,
					  "render": function ( data, type, full, meta ) {
								return '<a class="querydata" href="#">'+data+'</a>';}},
					 { "data": "fields.qTable" },
					 { "data": "fields.qRows" },
					 { "data": "fields.qResult" },
					 { "data": "fields.qTimetaken" },
					 { "data": "fields.qTime" },
					 { "data": "fields.qEnv" }
                 ],
				 "order": [[ 5, "desc" ]]

				 } );
		 function refresh_tab(){
				ref.ajax.reload();}
		$('#qhistrefresh').click(function() {
			
			refresh_tab();
		});
		// $('.nav-tabs a[href="#qhist_html"]').click(function(){
			

		// 	function refresh_query(data){
		// 	$('#post-text').val(data);
		// 	}
	// $('.querydata').click(function () {
		// refresh_query($(this).text());
    // });
		// 		// refresh_tab();
	
		// });
		$('#post-form').on('submit', function(event){
			$('#qSubmit').prop('disabled', true);
			$('*').css('cursor','wait');
			event.preventDefault();
			//console.log("form submitted!");
			function create_post() {
				//console.log("create post is working!") // sanity check
				//console.log($('#post-text').val())
				};
			create_post();
			var element = $(this);
			//console.log(element);
			function csrfSafeMethod(method) {
					// these HTTP methods do not require CSRF protection
					return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
			}
			$.ajaxSetup({
				beforeSend: function(xhr, settings) {
					if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
						xhr.setRequestHeader("X-CSRFToken", csrftoken);
					}
				}
			});
			
			$.ajax({
			url: "qresult/query_ajax_url",
			type:'POST',
			data : { csrfmiddlewaretoken : csrftoken, query : $('#post-text').val(), env : $("#newsfenv").val(), queryall : $("#queryallcheckbox").is(':checked')}, 
			success: function(json){
							//alert(response);
							// console.log($("#queryallcheckbox").is(':checked')); 
							//refresh_tab();
					if (json.error) {
							errcapt = json;
							console.log(json.error_msg);
									alert(json.error_msg)
							$('*').css('cursor','auto');
							$('#qSubmit').prop('disabled', false);
							}
                    else
					{
						var tableHeaders,tableData;
						$.each(json.columns, function(i, val){
                        tableHeaders += "<th>" + val + "</th>";
                    });
						$.each(json.data, function(i, val){
						tableData += "<tr>" ;
						$.each(val, function(i, new_val){
                        tableData += "<td>" + new_val + "</td>";
                    });
						tableData += "</tr>" ;
                        
                    }
					);
                     
                    $("#tableDiv").empty();
                    $("#tableDiv").append('<table id="displayTable" class="display" cellspacing="0" width="100%"><thead><tr>' + tableHeaders + '</tr></thead><tbody>' + tableData + '</tbody></table>');
                    //$('#displayTable').dataTable(json);
					$('#displayTable').DataTable( {
					dom: 'Blfrtip',
					responsive: true,
					 fixedHeader: true,
					"lengthMenu": [ [100, -1], [100, "All"] ],
        			buttons: [
				'copyHtml5', 
				{
           			 extend: 'excelHtml5',
		                 exportOptions: {
		                 orthogonal: 'sort'
			 		            },
			            customizeData: function ( data ) {
			                for (var i=0; i<data.body.length; i++){
			                for (var j=0; j<data.body[i].length; j++ ){
                        		data.body[i][j] = '\u200C' + data.body[i][j];
			                    }
			                }
		            }               
		            }, 
				 'csvHtml5'
				]});
					
					if(json.qRows > json.data.length){
						alert(" Displaying " + json.data.length + " rows out of total " + json.qRows + " rows")
						}
					$('.nav-tabs a[href="#qanswer_html"]').tab('show')
					}		$('*').css('cursor','auto');
							$('#qSubmit').prop('disabled', false);
				},
			error: function(json){
							$('*').css('cursor','auto');
							alert("error");
							$('#qSubmit').prop('disabled', false);
						}
						
		});
			
		});

/* This is for selecting column list */
			$('.multiselect').css('resize', 'both');
	$('#colquery').click(function()  {
	var ids=""
	var cnt=0
	var noColSelectIds=""
	$.each(rows_selected, function(index, rowId){	
		noColSelectIds= noColSelectIds +","+ rowId ;
	});					
		if (cnt==0)
	{
		$('#post-text').val("select " + noColSelectIds.slice(1) + " from "  + $('#tabnamelist').val() +" ")
	}
	else
	{
		$('#post-text').val("select " + ids.slice(1) + " from "  + $('#tabnamelist').val() +" ")
	}
	});
	//$('#colselect').click(function() 
	$('#tabnamelist').focusout(function()
	{
		 $('#colselect').prop('disabled', 'true');
		 rows_selected  = [];
		 $('*').css('cursor','wait');
		function csrfSafeMethod(method) {
					// these HTTP methods do not require CSRF protection
					return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
			}
			$.ajaxSetup({
				beforeSend: function(xhr, settings) {
					if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
						xhr.setRequestHeader("X-CSRFToken", csrftoken);
					}
				}
			});
		//console.log("clicked");
		if ($('#tabnamelist').val() =="")
		{
			alert ("Please select a table")
			$('*').css('cursor','auto');
			$('#colselect').prop('disabled', false);
		}
		else
		{
			$.ajax({
				url: "qcollist/collist_ajax_url",
				type:'POST',
				dataType: "json",
				data : { csrfmiddlewaretoken : csrftoken, table_name : $('#tabnamelist').val() ,  env : $("#newsfenv").val()}, 
				success: function(json)
					{
						colData=""
						//console.log(json)
					if (json.error) 
						{
							alert(json.error_msg);
							$("#collist").html();
							$('*').css('cursor','auto');
							$('#colselect').prop('disabled', false);
						}
					else
						{
							// collistdt_values = json;
							$('#colselect').prop('disabled', false);
							//console.log(json.data)
							out_arr = [[]];
							$.each(json.column_names, function(i, val){
							//console.log(val)
							var in_arr = [];
							in_arr.push(i);
							in_arr.push(val);
							out_arr.push(in_arr);
							
							colData += "<label><input type=\"checkbox\" class=\"cbmulti\"  name=\"option[]\" value=\"" + val + "\" />" + val + "</label>"

							});
							dummy_vals.data = out_arr;
							$("#collist").html(colData);
							$('#collistdt').dataTable().fnClearTable();
							out_arr.shift();
							$('#collistdt').dataTable().fnAddData(out_arr);
							}
								$('*').css('cursor','auto');
							},	
						    error: function (xhRequest, ErrorText, thrownError) {

							function simpleObjInspect(oObj, key, tabLvl)
								{
								    key = key || "";
								    tabLvl = tabLvl || 1;
								    var tabs = "";
								    for(var i = 1; i < tabLvl; i++){
									tabs += "\t";
								    }
								    var keyTypeStr = " (" + typeof key + ")";
								    if (tabLvl == 1) {
									keyTypeStr = "(self)";
								    }
								    var s = tabs + key + keyTypeStr + " : ";
								    if (typeof oObj == "object" && oObj !== null) {
									s += typeof oObj + "\n";
									for (var k in oObj) {
									    if (oObj.hasOwnProperty(k)) {
										s += simpleObjInspect(oObj[k], k, tabLvl + 1);
									    }
									}
								    } else {
									s += "" + oObj + " (" + typeof oObj + ") \n";
								    }
								    return s;
								}
								alert("Failed to process promotion correctly, please try again");
								console.log('xhRequest: ' + xhRequest + "\n");
								console.log(simpleObjInspect(xhRequest ));
								console.log('ErrorText: ' + ErrorText + "\n");
								console.log('thrownError: ' + thrownError + "\n");
								    }
											});
										}
									
									});



								 //var table = col_refresh(collistdt_values);
								   $('#collistdt tbody').on('click', 'input[type="checkbox"]', function(e){
								      var $row = $(this).closest('tr');

								      // Get row data
								      var data = table.row($row).data();

								      // Get row ID
								      var rowId = data[1];

								      // Determine whether row ID is in the list of selected row IDs 
								      var index = $.inArray(rowId, rows_selected);

								      // If checkbox is checked and row ID is not in list of selected row IDs
								      if(this.checked && index === -1){
									 rows_selected.push(rowId);

								      // Otherwise, if checkbox is not checked and row ID is in list of selected row IDs
								      } else if (!this.checked && index !== -1){
									 rows_selected.splice(index, 1);
								      }

								      if(this.checked){
									 $row.addClass('selected');
								      } else {
									 $row.removeClass('selected');
								      }

								      // Update state of "Select all" control
								      updateDataTableSelectAllCtrl(table);

								      // Prevent click event from propagating to parent
								      e.stopPropagation();
								   });

								   // Handle click on table cells with checkboxes
								   $('#collistdt').on('click', 'tbody td, thead th:first-child', function(e){
								      $(this).parent().find('input[type="checkbox"]').trigger('click');
								   });

								   // Handle click on "Select all" control
								   $('thead input[name="select_all"]', table.table().container()).on('click', function(e){
								      if(this.checked){
									 $('#collistdt tbody input[type="checkbox"]:not(:checked)').trigger('click');
								      } else {
									 $('#collistdt tbody input[type="checkbox"]:checked').trigger('click');
								      }

								      // Prevent click event from propagating to parent
								      e.stopPropagation();
								   });

								   // Handle table draw event
								   table.on('draw', function(){
								      // Update state of "Select all" control
								      updateDataTableSelectAllCtrl(table);
								   });
		});
