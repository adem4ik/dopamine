import * as assert from 'assert';
import { IMock, It, Mock } from 'typemoq';
import { SettingsStub } from '../../core/settings/settings-stub';
import { FileMetadata } from '../../metadata/file-metadata';
import { AlbumArtworkGetter } from './album-artwork-getter';
import { EmbeddedAlbumArtworkGetter } from './embedded-album-artwork-getter';
import { ExternalAlbumArtworkGetter } from './external-album-artwork-getter';
import { OnlineAlbumArtworkGetter } from './online-album-artwork-getter';

describe('AlbumArtworkGetter', () => {
    let embeddedAlbumArtworkGetterMock: IMock<EmbeddedAlbumArtworkGetter>;
    let externalAlbumArtworkGetterMock: IMock<ExternalAlbumArtworkGetter>;
    let onlineAlbumArtworkGetterMock: IMock<OnlineAlbumArtworkGetter>;
    let settingsStub: SettingsStub;
    let albumArtworkGetter: AlbumArtworkGetter;

    beforeEach(() => {
        embeddedAlbumArtworkGetterMock = Mock.ofType<EmbeddedAlbumArtworkGetter>();
        externalAlbumArtworkGetterMock = Mock.ofType<ExternalAlbumArtworkGetter>();
        onlineAlbumArtworkGetterMock = Mock.ofType<OnlineAlbumArtworkGetter>();
        settingsStub = new SettingsStub();
        albumArtworkGetter = new AlbumArtworkGetter(
            embeddedAlbumArtworkGetterMock.object,
            externalAlbumArtworkGetterMock.object,
            onlineAlbumArtworkGetterMock.object,
            settingsStub
        );
    });

    describe('getAlbumArtwork', () => {
        it('should return undefined when fileMetaData is undefined', async () => {
            // Arrange
            settingsStub.downloadMissingAlbumCovers = true;

            // Act
            const albumArtwork: Buffer = await albumArtworkGetter.getAlbumArtworkAsync(undefined);

            // Assert
            assert.strictEqual(albumArtwork, undefined);
        });

        it('should return embedded artwork when there is embedded artwork', async () => {
            // Arrange
            settingsStub.downloadMissingAlbumCovers = true;

            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();

            embeddedAlbumArtworkGetterMock.setup((x) => x.getEmbeddedArtwork(It.isAny())).returns(() => expectedAlbumArtwork);

            // Act
            const actualAlbumArtwork: Buffer = await albumArtworkGetter.getAlbumArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, expectedAlbumArtwork);
        });

        it('should return external artwork when there is no embedded artwork but there is external artwork', async () => {
            // Arrange
            settingsStub.downloadMissingAlbumCovers = true;

            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();

            embeddedAlbumArtworkGetterMock.setup((x) => x.getEmbeddedArtwork(It.isAny())).returns(() => undefined);
            externalAlbumArtworkGetterMock.setup((x) => x.getExternalArtworkAsync(It.isAny())).returns(async () => expectedAlbumArtwork);

            // Act
            const actualAlbumArtwork: Buffer = await albumArtworkGetter.getAlbumArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, expectedAlbumArtwork);
        });

        it('should return online artwork when settings require downloading missing covers when there is no embedded and no external artwork but there is online artwork', async () => {
            // Arrange
            settingsStub.downloadMissingAlbumCovers = true;

            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();

            embeddedAlbumArtworkGetterMock.setup((x) => x.getEmbeddedArtwork(It.isAny())).returns(() => undefined);
            externalAlbumArtworkGetterMock.setup((x) => x.getExternalArtworkAsync(It.isAny())).returns(async () => undefined);
            onlineAlbumArtworkGetterMock.setup((x) => x.getOnlineArtworkAsync(It.isAny())).returns(async () => expectedAlbumArtwork);

            // Act
            const actualAlbumArtwork: Buffer = await albumArtworkGetter.getAlbumArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, expectedAlbumArtwork);
        });

        it('should return undefined when settings do not require downloading missing covers when there is no embedded and no external artwork but there is online artwork', async () => {
            // Arrange
            const expectedAlbumArtwork = Buffer.from([1, 2, 3]);
            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();

            embeddedAlbumArtworkGetterMock.setup((x) => x.getEmbeddedArtwork(It.isAny())).returns(() => undefined);
            externalAlbumArtworkGetterMock.setup((x) => x.getExternalArtworkAsync(It.isAny())).returns(async () => undefined);
            onlineAlbumArtworkGetterMock.setup((x) => x.getOnlineArtworkAsync(It.isAny())).returns(async () => expectedAlbumArtwork);

            // Act
            const actualAlbumArtwork: Buffer = await albumArtworkGetter.getAlbumArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, undefined);
        });

        it('should return undefined when there is no embedded and no external and no online artwork', async () => {
            // Arrange
            settingsStub.downloadMissingAlbumCovers = true;

            const fileMetaDataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();

            embeddedAlbumArtworkGetterMock.setup((x) => x.getEmbeddedArtwork(It.isAny())).returns(() => undefined);
            externalAlbumArtworkGetterMock.setup((x) => x.getExternalArtworkAsync(It.isAny())).returns(async () => undefined);
            onlineAlbumArtworkGetterMock.setup((x) => x.getOnlineArtworkAsync(It.isAny())).returns(async () => undefined);

            // Act
            const actualAlbumArtwork: Buffer = await albumArtworkGetter.getAlbumArtworkAsync(fileMetaDataMock.object);

            // Assert
            assert.strictEqual(actualAlbumArtwork, undefined);
        });
    });
});