var Timer = function() {
  this.seconds    = 0;
  this.minutes    = 0;
  this.hours      = 0.0;
  this.notes      = '';
  this.project_id = project_id;
  this.staff_id   = staff_id;
  this.task_id    = task_id;
  this.running    = false;
}
Timer.prototype.setSeconds = function(seconds) {
  this.seconds = seconds;
  this.minutes = this.seconds / 60;
  this.hours = this.minutes / 60;
}
// taken from jquery.stopwatch formatting
Timer.prototype.formatted = function() {
  function pad2(number) {
    return (number < 10 ? '0' : '') + number;
  }
  function defaultFormatMilliseconds(seconds) {
      var x = seconds, minutes, hours;
      seconds = Math.floor(x % 60)
      x /= 60;
      minutes = Math.floor(x % 60);
      x /= 60;
      hours = Math.floor(x % 24);
      return [pad2(hours), pad2(minutes), pad2(seconds)].join(':');
  }
  return defaultFormatMilliseconds(this.seconds);
}
