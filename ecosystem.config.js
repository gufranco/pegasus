module.exports = {
  apps: [
    {
      name: 'pegasus',
      script: 'app.js',
      exec_mode: 'cluster',
      instances: -1,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      merge_logs: true,
    },
  ],
};
