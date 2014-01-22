window.addEvent("domready", function () {
    var api = new FreshbooksApi();

    new FancySettings.initWithManifest(function (settings) {
        var setText = function(name, text) {
          jQuery(settings.manifest[name].element).text(text);
        }
        var text = '';

        function setProjects() {
          var projects = api.getData('projects');
          if(projects && projects.length > 0) {
            text = 'Currently imported ' + projects.length + ' projects';
          } else {
            text = 'You haven\'t imported any.'
          }
          setText('projectsDescription', text);
        }

        function setTasks() {
          var tasks = api.getData('tasks');
          if(tasks && tasks.length > 0) {
            text = 'Currently imported ' + tasks.length + ' projects';
          } else {
            text = 'You haven\'t imported any.'
          }
          setText('tasksDescription', text);
        }

        function setStaffs() {
          var staffs = api.getData('staffs');
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
          api.getStaff().then(function(staff){
            api.storeData('staffs', staff);
            setStaffs();
          });
          setText('staffsDescription', 'Loading...');
        });
        settings.manifest.importProjects.addEvent('action', function() {
          api.getProjects().then(function(projects){
            api.storeData('projects', projects);
            setProjects();
          });
          setText('projectsDescription', 'Loading...');
        });
        settings.manifest.importTasks.addEvent('action', function() {
          api.getTasks().then(function(tasks){
            api.storeData('tasks', tasks);
            setTasks();
          });
          setText('tasksDescription', 'Loading...');
        });
    });

});
