const contecaManager = require('./contecaManager');
const apiManager = require('./apiManager');

contecaManager.createServer(8989);
apiManager.startAPIService(3000);