import { RNFetchBlobConfig, FetchBlobResponse } from './../../node_modules/rn-fetch-blob/index.d';
import RNFetchBlob from 'rn-fetch-blob';
import { Platform } from 'react-native';
import { PlatformEnum } from './constants';
import { newGUID } from './utils';
import ImageResizer from 'react-native-image-resizer';

export const downloadImage = async (fileUrl: string | null | undefined, progress?: (fileFinished: string | null | undefined) => void): Promise<string | undefined> => {
    return new Promise<string | undefined>(async (resolve, reject) => {
        if (!fileUrl || !fileUrl.startsWith('http')) {
            resolve(undefined);
            if (progress)
                progress(fileUrl);
        }
        else {
            fileUrl = fileUrl.replace(/\\/g, '/');
            const { config, fs } = RNFetchBlob;
            const ext = getExtention(fileUrl);
            const filename = `image_${getFileName(fileUrl)}.${ext}`;
            const downloadBaseFolder = (Platform.OS == PlatformEnum.ANDROID ? fs.dirs.DownloadDir : fs.dirs.LibraryDir) + '/FordEvents';
            try { await createFolder(downloadBaseFolder); } catch (err) { }

            const downloadPath = `${downloadBaseFolder}/${filename}`;
            // check if file already exists
            let fileExists = false;
            try {
                fileExists = await isPathExist(downloadPath);
            } catch (error) {
                console.log("Error to check if file exists:", error);
                fileExists = false;
            }
            if (fileExists) {
                console.log("El archivo a descargar ya existe:", downloadPath);
                resolve(downloadPath);
                if (progress)
                    progress(fileUrl);
            }
            else {
                const options: RNFetchBlobConfig = {
                    overwrite: true,
                    fileCache: false,
                    path: downloadPath,
                    //trusty: true,
                    timeout: 25000,
                    addAndroidDownloads: {
                        useDownloadManager: true,
                        mediaScannable: true,
                        notification: false,
                        path: downloadPath,
                        mime: getMimeTypeFromExtension(ext)
                    },
                };
                console.log('Descargando archivo:', fileUrl);
                config(options)
                    .fetch('GET', fileUrl)
                    .then((res: FetchBlobResponse) => {
                        const filePath = res.path();
                        console.log('Archivo descargado:', filePath);
                        if (progress)
                            progress(fileUrl);
                        resolve(filePath);
                    }).catch((error: any) => {
                        console.log('Error al descargar archivo:', fileUrl)
                        if (progress)
                            progress(fileUrl);
                        resolve(undefined);
                    });
            }
        }
    });
}

export const downloadFile = (fileUrl: string | null | undefined, progress?: (fileFinished: string | null | undefined) => void): Promise<string | undefined> => {
    return new Promise<string | undefined>(async (resolve, reject) => {
        if (!fileUrl || !fileUrl.startsWith('http')) {
            resolve(undefined);
            if (progress)
                progress(fileUrl);
        }
        else {
            fileUrl = fileUrl.replace(/\\/g, '/');
            const { config, fs } = RNFetchBlob;
            const ext = getExtention(fileUrl);
            const filename = `file_${getFileName(fileUrl)}.${ext}`;
            const downloadBaseFolder = (Platform.OS == PlatformEnum.ANDROID ? fs.dirs.DownloadDir : fs.dirs.LibraryDir);
            try { await createFolder(downloadBaseFolder); } catch (err) { }

            const downloadPath = `${downloadBaseFolder}/${filename}`;
            // check if file already exists
            let fileExists = false;
            try {
                fileExists = await isPathExist(downloadPath);
            } catch (error) {
                console.log("Error to check if file exists:", error);
                fileExists = false;
            }
            if (fileExists) {
                console.log("El archivo a descargar ya existe:", downloadPath);
                resolve(downloadPath);
                if (progress)
                    progress(fileUrl);
            }
            else {
                const options: RNFetchBlobConfig = {
                    overwrite: true,
                    fileCache: false,
                    path: downloadPath,
                    //trusty: true,
                    timeout: 25000,
                    addAndroidDownloads: {
                        useDownloadManager: true,
                        mediaScannable: true,
                        notification: false,
                        path: downloadPath,
                        mime: getMimeTypeFromExtension(ext)
                    },
                };
                console.log('Descargando archivo:', fileUrl);
                config(options)
                    .fetch('GET', fileUrl)
                    .then((res: FetchBlobResponse) => {
                        const filePath = res.path();
                        console.log('Archivo descargado:', filePath);
                        if (progress)
                            progress(fileUrl);
                        resolve(filePath);
                    }).catch((error: any) => {
                        console.log('Error al descargar archivo:', fileUrl)
                        if (progress)
                            progress(fileUrl);
                        resolve(undefined);
                    });
            }
        }
    });
}

export const downloadFileAsBase64 = async (fileUrl: string | null | undefined, progress?: (fileFinished: string | null | undefined) => void): Promise<string | undefined> => {
    return new Promise<string | undefined>(async (resolve, reject) => {
        if (!fileUrl || !fileUrl.startsWith('http')) {
            resolve(undefined);
            if (progress)
                progress(fileUrl);
        }
        else {
            fileUrl = fileUrl.replace(/\\/g, '/');
            console.log('Descargando archivo:', fileUrl);
            const response = await fetch(fileUrl);
            if (response.ok) {
                const blob = await response.blob();
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onload = () => {
                    if (progress)
                        progress(fileUrl);
                    resolve(reader.result as string)
                };
                reader.onerror = error => {
                    console.log(`downloadFileAsBase64 - error to download ${fileUrl}:`, error);
                    if (progress)
                        progress(fileUrl);
                    resolve(undefined)
                };
            } else {
                if (progress)
                    progress(fileUrl);
                resolve(undefined);
            }
        }
    });
}

export const writeFileFromImageBase64 = (base64Image: string): Promise<string | undefined> => {
    return new Promise<string | undefined>(async (resolve) => {
        console.log('Image to save:', base64Image.slice(0, 50))
        const Base64Code = base64Image
            .replace(`data:image/png;base64,`, "")
            .replace(`data:image/jpeg;base64,`, "");
        const mimeType = getMimeTypeFromBase64(Base64Code);
        const { fs } = RNFetchBlob;
        const downloadBaseFolder = (Platform.OS == PlatformEnum.ANDROID ? fs.dirs.DCIMDir : fs.dirs.LibraryDir) + '/FordEventsSignatures';
        try { await createFolder(downloadBaseFolder); } catch (err) { }

        const filename = newGUID() + '.' + mimeType.split('/').pop();
        const path = `${downloadBaseFolder}/${filename}`;
        fs.writeFile(path, Base64Code, 'base64')
            .then((res) => {
                console.log(`La imagen ${path} se guardó correctamente: `, JSON.stringify(res));
                resolve(path);
            })
            .catch((error) => {
                console.log(`Error al escribir el archivo de imagen ${path}: `, JSON.stringify(error))
                resolve(undefined);
            });
    });
}

export const removeFile = async (path: string): Promise<boolean> => {
    return new Promise<boolean>(async (resolve) => {
        const { fs } = RNFetchBlob;
        fs.unlink(path)
            .then((res) => {
                console.log(`El archivo ${path} se eliminó correctamente: `, JSON.stringify(res));
                resolve(true);
            })
            .catch((error) => {
                console.log(`Error al eliminar el archivo ${path}: `, JSON.stringify(error))
                resolve(false);
            });
    });
}

export const resizeImage = async (imgPath: string, newWidth: number, newHeight: number, quality: number = 100): Promise<string | undefined> => {
    return new Promise<string | undefined>(async (resolve) => {
        const { fs } = RNFetchBlob;
        const downloadBaseFolder = (Platform.OS == PlatformEnum.ANDROID ? fs.dirs.DCIMDir : fs.dirs.LibraryDir) + '/FordEventsSignatures';
        //const path = `${downloadBaseFolder}/${newGUID()}-resized.jpg`;
        ImageResizer.createResizedImage(imgPath, newWidth, newHeight, 'JPEG', quality, 0, downloadBaseFolder)
            .then(response => resolve(response.path))
            .catch(error => {
                console.log('resizeImage:', error);
                resolve(undefined)
            })
    });
}

export const readFileAsBase64 = async (filePath: string | undefined): Promise<any> => {
    const { fs } = RNFetchBlob;
    return await fs.readFile(getFullPath(filePath), 'base64');
}

export const readFileAsBase64WithMimeType = async (filePath: string | undefined): Promise<any> => {
    const { fs } = RNFetchBlob;
    const result = await fs.readFile(getFullPath(filePath), 'base64');
    const mimeType = getMimeTypeFromBase64(result);
    return `data:${mimeType};base64,${result}`;
}

export const isPathExist = (path: string): Promise<boolean> => {
    const { fs } = RNFetchBlob;
    return fs.exists(path);
}

export const getFileName = (file?: string): string | undefined => {
    let nameAndExtSplit = file?.split('/')?.pop()?.split('.');
    nameAndExtSplit?.pop();
    return nameAndExtSplit?.join('_');
}

export const getExtention = (file?: string): string | undefined => {
    return file?.includes('.') ? file?.split('.').pop() : undefined;
}

export const getMimeTypeFromExtension = (ext: string | undefined): string | undefined => {
    switch (ext) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'webp':
            return 'image/webp';
        case 'mp4':
        case 'm4v':
            return 'video/mp4';
        case '3gp':
        case '3gpp':
            return 'video/3gpp';
        case 'mpeg':
        case 'mpg':
            return 'video/mpeg';
        case 'mov':
            return 'video/quicktime';
        case 'video/x-msvideo':
            return 'video/avi';
        case 'pdf':
            return 'application/pdf';
        default: return undefined;
    }
}

export const getMimeTypeFromBase64 = (base64: string | undefined): string => {
    switch (base64 ? base64[0] : '') {
        case '/':
            return 'image/jpeg';
        case 'i':
            return 'image/png';
        case 'U':
            return 'image/webp';
        case 'J':
            return 'application/pdf';
        default: return '';
    }
}

export const getFileType = (ext: string | undefined): 'image' | 'video' | 'file' => {
    switch (ext) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'webp':
            return 'image';
        case 'mp4':
        case 'm4v':
        case '3gp':
        case '3gpp':
        case 'mpeg':
        case 'mpg':
        case 'mov':
        case 'video/x-msvideo':
            return 'video';
        default: return 'file';
    }
}

export const createFolder = async (folder: string): Promise<void> => {
    const { fs } = RNFetchBlob;

    const folderExists = await fs.isDir(folder);
    if (!folderExists)
        await fs.mkdir(folder);
}

export const getFullPath = (filePath: string | null | undefined): string => {
    if (!filePath) return '';
    return `${Platform.OS === PlatformEnum.ANDROID ? 'file://' : ''}/${filePath}`;
}

export const getImageNotFoundPath = (): string => {
    return getFullPath('/assets/img/image_not_found.png')
}