/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
module.exports = {
  "ui": false,
  "files": "build/index.html",
  "watchEvents": [
    "change"
  ],
  "watch": false,
  "ignore": [],
  "single": false,
  "watchOptions": {
    "ignoreInitial": true
  },
  "server": {
    "baseDir": "build",
    "serveStaticOptions": {
      "extensions": ["html"]
    }
  },
  "proxy": false,
  "port": 7777,
  "middleware": false,
  "serveStatic": [],
  "ghostMode": false,
  "logLevel": "info",
  "logPrefix": "Browsersync",
  "logConnections": false,
  "logFileChanges": true,
  "logSnippet": true,
  "rewriteRules": [],
  "open": "local",
  "browser": "default",
  "cors": false,
  "xip": false,
  "hostnameSuffix": false,
  "reloadOnRestart": false,
  "notify": true,
  "scrollProportionally": true,
  "scrollThrottle": 0,
  "scrollRestoreTechnique": "window.name",
  "scrollElements": [],
  "scrollElementMapping": [],
  "reloadDelay": 0,
  "reloadDebounce": 500,
  "reloadThrottle": 500,
  "plugins": [],
  "injectChanges": false,
  "startPath": null,
  "minify": true,
  "host": null,
  "localOnly": true,
  "codeSync": true,
  "timestamps": false,
  "socket": {
    "socketIoOptions": {
      "log": false
    },
    "socketIoClientConfig": {
      "reconnectionAttempts": 50
    },
    "path": "/browser-sync/socket.io",
    "clientPath": "/browser-sync",
    "namespace": "/browser-sync",
    "clients": {
      "heartbeatTimeout": 5000
    }
  },
  "tagNames": {
    "less": "link",
    "scss": "link",
    "css": "link",
    "jpg": "img",
    "jpeg": "img",
    "png": "img",
    "svg": "img",
    "gif": "img",
    "js": "script"
  },
  "injectNotification": false
};
