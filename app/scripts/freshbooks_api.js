var FreshbooksApi = function() {
  this.apiUrl = localStorage['store.settings.apiUrl'];
  this.authToken = localStorage['store.settings.authToken'];
}
FreshbooksApi.prototype.generateUrl = function(path) {
  var base     = defaults.appUrl + '/' + path,
      authInfo = '?api_url=' + this.apiUrl + '&auth_token=' + this.authToken;

  return base + authInfo;
}
FreshbooksApi.prototype.getProjects = function() {
  return $.getJSON(this.generateUrl('projects'));
}
FreshbooksApi.prototype.getTasks = function() {
  return $.getJSON(this.generateUrl('tasks'));
}
FreshbooksApi.prototype.getStaff = function() {
  return $.getJSON(this.generateUrl('staffs'));
}
FreshbooksApi.prototype.createTimeEntry = function(data) {
  return $.post(this.generateUrl('time_entries'), { time_entry: data });
}

