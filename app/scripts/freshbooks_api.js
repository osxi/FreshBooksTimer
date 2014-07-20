var defaults = {
  appUrl: 'https://freshbooks-api-node.herokuapp.com'
};

var FreshbooksApi = function() {
  this.apiUrl    = localStorage.getItem('store.settings.apiUrl');
  this.authToken = localStorage.getItem('store.settings.authToken');
};

FreshbooksApi.prototype.generateUrl = function(path) {
  var base     = defaults.appUrl + '/' + path,
      authInfo = '?api_url=' + this.apiUrl + '&auth_token=' + this.authToken;

  return base + authInfo;
};

FreshbooksApi.prototype.getProjects = function() {
  return jQuery.getJSON(this.generateUrl('projects'));
};

FreshbooksApi.prototype.getTasks = function() {
  return jQuery.getJSON(this.generateUrl('tasks'));
};

FreshbooksApi.prototype.getStaffs = function() {
  return jQuery.getJSON(this.generateUrl('staffs'));
};

FreshbooksApi.prototype.createTimeEntry = function(data) {
  return jQuery.post(this.generateUrl('time_entries'), { time_entry: data });
};

FreshbooksApi.prototype.storeData = function(key, data) {
  return localStorage.setItem('store.data.' + key, JSON.stringify(data));
};

FreshbooksApi.prototype.getData = function(key) {
  return JSON.parse(localStorage.getItem('store.data.'+key));
};

