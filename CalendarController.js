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
    
    
    
})
