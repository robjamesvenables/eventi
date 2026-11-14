// Install test only: lets Chrome offer 'Add to home screen' for /install-test.html. Passes every request straight through.
self.addEventListener('install',function(){self.skipWaiting();});
self.addEventListener('fetch',function(){});
