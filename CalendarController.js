({
	doInit : function(component, event, helper) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth(); //January is 0!
        var yyyy = today.getFullYear();
      // get first day of month
        var today = new Date(yyyy, mm, 1); 
        component.set("v.currentMonth", today);
        var selected = component.get("v.selectedDept");
       helper.retrievePickList(component);
        helper.retrieveEventList(component, mm +1, yyyy, selected);
	},  // end function
    
    
    lastMonth : function(component, event, helper) {
        var currentMonth = component.get('v.currentMonth');
        currentMonth = new Date(currentMonth);
        
        currentMonth = currentMonth.setMonth(currentMonth.getMonth() -1);
        currentMonth = new Date(currentMonth);
        component.set('v.currentMonth', currentMonth);
        var month = currentMonth.getMonth() +1;
        var year = currentMonth.getFullYear() ;
        var selected = component.get("v.selectedDept");
        helper.retrieveEventList(component, month, year);
	},
    
 
    nextMonth : function(component, event, helper) {
        var currentMonth = component.get('v.currentMonth');
        currentMonth = new Date(currentMonth);
        
        currentMonth = currentMonth.setMonth(currentMonth.getMonth() +1);
        currentMonth = new Date(currentMonth);
        component.set('v.currentMonth', currentMonth);
        var month = currentMonth.getMonth() +1;
        var year = currentMonth.getFullYear() ;  
        var selected = component.get("v.selectedDept");
        helper.retrieveEventList(component, month, year);
        
	},


    updateDepartment : function(component, event, helper) {  
        var selected = component.find("pickId").get("v.value");
        component.set('v.selectedDept', selected);
        console.log('result' + selected);
    	var currentMonth = component.get('v.currentMonth');
        currentMonth = new Date(currentMonth);
        var month = currentMonth.getMonth() +1;
        var year = currentMonth.getFullYear() ;
        helper.createCalendar(component);        
    },
    
    
    newEvent: function(component, event, helper) {
        var eventModal = component.find('newEventModal');
    	 $A.util.removeClass(eventModal, "hideModal");    
    },
    
   newEventCancel: function(component, event, helper) {
       var eventModal = component.find('newEventModal');
       $A.util.addClass(eventModal, "hideModal");    
    },    
    
    
    newEventSubmit: function(component, event, helper) {
     	console.log('in the new event function');
       var newEvent = component.get("v.newEvent");
       var selectedStatus = component.find("newEvent").find('statusPickId').get("v.value"); 
       console.log('selected Status=' + selectedStatus);
       newEvent.Status__c = selectedStatus;        
      
        var selectedDept = component.find("newEvent").find('eventDeptPickId').get("v.value"); 
        console.log('selected dept=' + selectedDept);
        if (selectedDept == 'Any') {selectedDept = null;} 
        newEvent.Department__c = selectedDept;

      	newEvent.DurationInMinutes = 60;
       console.log('newEvent = ' + JSON.stringify(newEvent));
        var action = component.get("c.getNewEvent");
       		action.setParams({"newEvent": newEvent});
            action.setCallback(this, function(response){
                var state = response.getState();
                if (component.isValid() && state === "SUCCESS") {
                    var returned =response.getReturnValue();
                    console.log("SUCCESS - : " + JSON.stringify(returned));
                    var eventModal = component.find('newEventModal');
                    $A.util.addClass(eventModal, "hideModal");
                    var eventList = component.get('v.eventList');
                    eventList.push(returned);
                    component.set('v.eventList', eventList);
                    helper.createCalendar(component);
                 }
            });
            $A.enqueueAction(action);        


    },  // end new event function
    
    
    
    editEvent: function(component, event, helper) {
        console.log('event recieved');
        var updatedEvent = event.getParam('eventPackage');
        component.set('v.selectedEvent', updatedEvent);
        var eventModal = component.find('editEventModal');
    	 $A.util.removeClass(eventModal, "hideModal");         
//        console.log('event recieved' + JSON.stringify(updatedEvent));
     },
    
    
    
    editEventSubmit: function(component, event, helper) {
      console.log('in the new event function');
       var newEvent = component.get("v.selectedEvent");
        var oldId = newEvent.Id;
        console.log('reportingCheck event ' + newEvent.Reporting_Calendar__c);  
       var selectedStatus = component.find("editEvent").find('statusPickId').get("v.value"); 
       console.log('selected Status=' + selectedStatus);
       newEvent.Status__c = selectedStatus;   
        
       var reportingCheck = component.find("editEvent").find('reportingCheck').get("v.value"); 
       console.log('reportingCheck =' + reportingCheck);        
      
        var selectedDept = component.find("editEvent").find('eventDeptPickId').get("v.value"); 
        console.log('selected dept=' + selectedDept);
        if (selectedDept == 'Any') {selectedDept = null;} 
        newEvent.Department__c = selectedDept;

      	newEvent.DurationInMinutes = 60;
       console.log('newEvent = ' + JSON.stringify(newEvent));
        var action = component.get("c.getEditEvent");
       		action.setParams({"newEvent": newEvent});
            action.setCallback(this, function(response){
                var state = response.getState();
                if (component.isValid() && state === "SUCCESS") {
                    var returned =response.getReturnValue();
                    console.log("SUCCESS - : " + JSON.stringify(returned));
                    var eventModal = component.find('editEventModal');
                    $A.util.addClass(eventModal, "hideModal");
                    
                     // loop through event List and update the changed event
                    var eventList = component.get('v.eventList');
                    
                    for (var i = 0; i < eventList.length; i ++)
                    {
                        if (eventList[i].Id == oldId) 
                        {
                        	eventList[i] = returned; 
                            if (returned.Reporting_Calendar__c == false) { eventList.splice(i, 1); }
                        }
                    }

                    component.set('v.eventList', eventList);
                    helper.createCalendar(component);
                 }
            });
            $A.enqueueAction(action);        


    },  // end new event function    
    
    editEventCancel: function(component, event, helper) {
       var eventModal = component.find('editEventModal');
       $A.util.addClass(eventModal, "hideModal");    
    },       
    
})
