({
    // calendar - helper
    
    retrievePickList : function(component) {
		var action = component.get("c.getDepartments");
       
       // action.setParams({"month": month, "year": year});
        action.setCallback(this, function(response){
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var returned =response.getReturnValue();
                console.log("SUCCESS returned: " + JSON.stringify(returned));
                component.set('v.pickList', returned);
            }
        });
        $A.enqueueAction(action);          
    },
    
    
    retrieveEventList : function(component, month, year) {
		var action = component.get("c.getEventList");
        action.setParams({"month": month, "year": year});
        action.setCallback(this, function(response){
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var returned =response.getReturnValue();
                component.set('v.eventList', returned);
                // console.log("SUCCESS returned: " + JSON.stringify(returned));
                var that = this;
                that.createCalendar(component);

            }
        });
        $A.enqueueAction(action);          
    },
    
    
    
	createCalendar : function(component) {
        var eventList = component.get('v.eventList');
        var today = component.get('v.currentMonth');
        var selectedDept = component.get('v.selectedDept');
		
        //these are labels for the days of the week
        var cal_days_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];    
        component.set('v.daysOfWeek', cal_days_labels)
        // these are human-readable month name labels, in order
        var cal_months_labels = ['January', 'February', 'March', 'April',
                         'May', 'June', 'July', 'August', 'September',
                         'October', 'November', 'December'];        
		            
        //today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth(); //January is 0!
        var yyyy = today.getFullYear();
        // get first day of month
        var firstDay = new Date(yyyy, mm, 1);
        console.log(' firstday = ' + firstDay);
				
		        
        var startingDay = firstDay.getDay();
        var nextDay = new Date(firstDay);
        component.set('v.month', cal_months_labels[mm] + ' ' + yyyy);       
        console.log(' starting day ' + startingDay);
	    
        // find number of days in month
        var monthLength = new Date(yyyy, mm, 0).getDate() +1;
        console.log (' monthLength ' + monthLength);  
				       
        // compensate for leap year
        if (mm == 2) { // February only!
        	if((yyyy % 4 == 0 && yyyy % 100 != 0) || yyyy % 400 == 0){
          		monthLength = 29;
        }
      }
        
        

 // **********************************************************************88   
    // Array of components to create
    	var newComponents = [];
        
        // put the weeks/table rows in the components array
        for (var i = 0; i < 7; i++) 
        {
			newComponents.push(["aura:html", {
            	"tag": "tr"
      		}]);              
        }
        
        for (var i = 1; i <= startingDay; i++) {
            // put the days rows in the components array
       		 newComponents.push(["c:CalendarDay", {
				"visible": false
        	 }]); 
        }           
  
 // **********************************************************************88 
 // in this section, we loop through the days of the month and create components for each day       
        for (var i = 1; i <= monthLength; i++) {  //
            var stringBody = [];
            var nextDay = nextDay.toISOString().slice(0,10);
            // console.log('nextDay ' +nextDay);
            for(var e = 0;  e < eventList.length; e ++) {
                var eventDate = new Date(eventList[e].StartDateTime);
                var eventDept = eventList[e].Department__c;
                eventDate = eventDate.toISOString().slice(0,10);
                // if the calendar day of the month matches the calendar day of the event, then add the subject of the event to the calendar day compeonet
            	if (eventDate == nextDay) {
                    if (selectedDept == 'Any') {
                    	stringBody.push(eventList[e].Subject);    
                    }
                    else if (eventDept == selectedDept) {
                        stringBody.push(eventList[e].Subject); 
                    }
            	}                
            } // end for 

            // increament day for the date variable
            var nextDay = new Date(nextDay);
            var dateValue = nextDay.getDate() + 1;
            nextDay.setDate(dateValue);
     		
            newComponents.push(["c:CalendarDay", {
				"day": i,
                 "toDoItems": stringBody
        	 }]); 
        }  
        
        for (var i = 1; i <= 5; i++) {
            // put the days rows in the components array
       		 newComponents.push(["c:CalendarDay", {
                 "visible": false
        	 }]); 
        }             
            
 // **********************************************************************88           
 
   $A.createComponents(newComponents,
        function (components, status, errorMessage) {
           if (status === "SUCCESS") {
               var pageBody = component.get("v.body");
               pageBody = [];
               for (var outer = 0; outer < 5; outer ++) {	
                    var tr = components[outer];
                    var trBody = tr.get("v.body");
                    for (var inner = 1; inner < 8; inner ++) {
                        var outerAdj = outer +0;
                    	var adj =  6 + + inner + (7 * outerAdj); 
                        var toDay = components[adj];
                        trBody.push(toDay);
                    }
                    tr.set("v.body", trBody)
                    pageBody.push(tr);
               }

				component.set("v.body", pageBody);
            }  // end success
            else // Report any error
            {
                this.displayToast("Error", "Failed to create list components.");
            }
        } // end callback function
    );     // end create component   
        		
	}
})
