import { IMock, Mock } from 'typemoq';
import { Desktop } from '../../app/core/io/desktop';
import { Logger } from '../../app/core/logger';
import { BaseAlbumArtworkRepository } from '../../app/data/repositories/base-album-artwork-repository';
import { BaseTrackRepository } from '../../app/data/repositories/base-track-repository';
import { FileMetadataFactory } from '../../app/metadata/file-metadata-factory';
import { BaseAlbumArtworkCacheService } from '../../app/services/album-artwork-cache/base-album-artwork-cache.service';
import { AlbumArtworkAdder } from '../../app/services/indexing/album-artwork-adder';
import { AlbumArtworkGetter } from '../../app/services/indexing/album-artwork-getter';
import { BaseSnackBarService } from '../../app/services/snack-bar/base-snack-bar.service';

export class AlbumArtworkAdderMocker {
    constructor() {
        this.albumArtworkAdder = new AlbumArtworkAdder(
            this.albumArtworkCacheServiceMock.object,
            this.albumArtworkRepositoryMock.object,
            this.trackRepositoryMock.object,
            this.fileMetadataFactoryMock.object,
            this.snackBarServiceMock.object,
            this.loggerMock.object,
            this.albumArtworkGetterMock.object);
    }

    public desktopMock: IMock<Desktop> = Mock.ofType<Desktop>();
    public albumArtworkCacheServiceMock: IMock<BaseAlbumArtworkCacheService> = Mock.ofType<BaseAlbumArtworkCacheService>();
    public albumArtworkRepositoryMock: IMock<BaseAlbumArtworkRepository> = Mock.ofType<BaseAlbumArtworkRepository>();
    public trackRepositoryMock: IMock<BaseTrackRepository> = Mock.ofType<BaseTrackRepository>();
    public fileMetadataFactoryMock: IMock<FileMetadataFactory> = Mock.ofType<FileMetadataFactory>();
    public snackBarServiceMock: IMock<BaseSnackBarService> = Mock.ofType<BaseSnackBarService>();
    public loggerMock: IMock<Logger> = Mock.ofType<Logger>();
    public albumArtworkGetterMock: IMock<AlbumArtworkGetter> = Mock.ofType<AlbumArtworkGetter>();
    public albumArtworkAdder: AlbumArtworkAdder;
}
