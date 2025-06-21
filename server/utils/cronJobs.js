const cron = require('node-cron');
const Event = require('../models/Event');
const User = require('../models/User');

const startCronJobs = () => {
  // Update event statuses daily at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('Running daily event status update...');
      
      const now = new Date();
      
      // Mark events as completed if end date has passed
      await Event.updateMany(
        { 
          endDate: { $lt: now },
          status: { $ne: 'completed' }
        },
        { status: 'completed' }
      );

      console.log('Event status update completed');
    } catch (error) {
      console.error('Error updating event statuses:', error);
    }
  });

  // Clean up expired sessions weekly
  cron.schedule('0 0 * * 0', async () => {
    try {
      console.log('Running weekly cleanup...');
      
      // Add any cleanup tasks here
      
      console.log('Weekly cleanup completed');
    } catch (error) {
      console.error('Error during weekly cleanup:', error);
    }
  });

  console.log('Cron jobs started');
};

module.exports = { startCronJobs };