const { Ioc } = require('../ioc/ioc');
const log = require('electron-log');
const { app } = require('electron');
const path = require('path');

async function performTaskAsync() {
    Ioc.registerAll();

    const indexer = Ioc.get('Indexer');
    const workerProxy = Ioc.get('WorkerProxy');
    const logger = Ioc.get('Logger');

    log.transports.file.resolvePath = () => path.join(workerProxy.applicationDataDirectory(), 'logs', 'Dopamine.log');

    try {
        if (workerProxy.task() === 'outdated') {
            await indexer.indexCollectionIfOutdatedAsync();
        } else if (workerProxy.task() === 'always') {
            await indexer.indexCollectionAlwaysAsync();
        } else if (workerProxy.task() === 'albumArtwork') {
            await indexer.indexAlbumArtworkOnlyAsync();
        }
    } catch (e) {
        logger.error(e, 'Unexpected error', 'IndexingWorker', 'performTaskAsync');
    }
}

performTaskAsync().then(() => {
    const workerProxy = Ioc.get('WorkerProxy');
    workerProxy.postMessage('Done');
});
