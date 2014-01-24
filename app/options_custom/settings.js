window.addEvent("domready", function () {
    var api      = new FreshbooksApi();
    var staffs   = api.getData('staffs');
    var projects = api.getData('projects');
    var tasks    = api.getData('tasks');

    jQuery.each(manifest['settings'], function(key, options){
      if(projects && projects.length >0 && options.name === 'defaultProject') {
        jQuery.each(projects, function(_, project){
          manifest['settings'][key]['options'].push({
            "value": project.project_id,
            "text": project.name
          });
        });
      } else if(staffs && staffs.length >0 && options.name === 'defaultStaff') {
        jQuery.each(staffs, function(_, staff){
          manifest['settings'][key]['options'].push({
            "value": staff.staff_id,
            "text": staff.first_name + ' ' + staff.last_name
          });
        });
      } else if(tasks && tasks.length >0 && options.name === 'defaultTask') {
        jQuery.each(tasks, function(_, task){
          manifest['settings'][key]['options'].push({
            "value": task.task_id,
            "text": task.name
          });
        });
      }
    });

    new FancySettings.initWithManifest(function (settings) {
        var setText = function(name, text) {
          jQuery(settings.manifest[name].element).text(text);
        }

        function updateImportDescription() {
          var text = '';
          if(projects && tasks && staffs){
            text += 'You have ' + projects.length + ' projects, ' + tasks.length;
            text += ' tasks, and ' + staffs.length + ' staffs. No action needed.';
          } else {
            text += 'Action needed. No data imported.'
          }
          setText('importDescription', text);
        }
        updateImportDescription();


        settings.manifest.importAll.addEvent('action', function() {

          setText('importDescription', 'Loading...');
          jQuery.when(api.getStaffs(), api.getProjects(), api.getTasks()).done(
            function(recStaffs, recProjects, recTasks){

              // Used to map out the belongsTo ids from the keys passed in
              function mapIds(array, pluralKey, singularKey) {
                var results = []
                jQuery.each(array, function(_, item){
                  if(item[pluralKey] && item[pluralKey][singularKey]) {
                    jQuery.each(item[pluralKey][singularKey], function(_, entity) {
                      results.push(Number(entity[singularKey+'_id']));
                    });
                  }
                });
                return results;
              }
              // creates the array of items that are associated with the
              // parentArray passed in
              function buildItemsArray(parentArray, itemsArray, pluralKey, singularKey) {
                var mappedIds = mapIds(parentArray, pluralKey, singularKey);
                    results = [];
                jQuery.each(itemsArray, function(_, item){
                  if(mappedIds.contains(Number(item[singularKey+'_id']))) {
                    results.push(item);
                  }
                });
                return results;
              }

              staffs = [];
              jQuery.each(recStaffs[0], function(_, staff) {
                if(staff.projects && staff.projects.project) {
                  staffs.push(staff);
                }
              });
              projects = buildItemsArray(staffs, recProjects[0], 'projects', 'project')
              tasks    = buildItemsArray(projects, recTasks[0], 'tasks', 'task')
              api.storeData('staffs', staffs);
              api.storeData('projects', projects);
              api.storeData('tasks', tasks);
              updateImportDescription();

            }
          );

        });

    });

});
