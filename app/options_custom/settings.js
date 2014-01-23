window.addEvent("domready", function () {
    var api = new FreshbooksApi();
        projects = api.getData('projects');
        tasks = api.getData('tasks');
        staffs = api.getData('staffs');

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
        var text = '';

        function setProjects() {
          if(projects && projects.length > 0) {
            text = 'Currently imported ' + projects.length + ' projects';
          } else {
            text = 'You haven\'t imported any.'
          }
          setText('projectsDescription', text);
        }

        function setTasks() {
          if(tasks && tasks.length > 0) {
            text = 'Currently imported ' + tasks.length + ' projects';
          } else {
            text = 'You haven\'t imported any.'
          }
          setText('tasksDescription', text);
        }

        function setStaffs() {
          if(staffs && staffs.length > 0) {
            text = 'Currently imported ' + staffs.length + ' staff';
          } else {
            text = 'You haven\'t imported any.'
          }
          setText('staffsDescription', text);
        }
        setProjects();
        setTasks();
        setStaffs();

        settings.manifest.importStaff.addEvent('action', function() {
          api.getStaff().then(function(gotStaffs){
            staffs = jQuery(gotStaffs).filter(function(_, staff) {
              return staff.projects != null;
            });
            api.storeData('staffs', staffs);
            setStaffs();
          });
          setText('staffsDescription', 'Loading...');
        });
        settings.manifest.importProjects.addEvent('action', function() {
          api.getProjects().then(function(gotProjects){
            projects = gotProjects;
            api.storeData('projects', gotProjects);
            setProjects();
          });
          setText('projectsDescription', 'Loading...');
        });
        settings.manifest.importTasks.addEvent('action', function() {
          api.getTasks().then(function(gotTasks){
            tasks = gotTasks;
            api.storeData('tasks', gotTasks);
            setTasks(tasks);
          });
          setText('tasksDescription', 'Loading...');
        });
    });

});
