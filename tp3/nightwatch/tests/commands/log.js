/**
 * Logs a message.
 *
 * @param message   The message to log.
 */
 exports.command  = function(message) {
    this.perform(function() {
      console.log(message)
    });
    return this;
  };
  