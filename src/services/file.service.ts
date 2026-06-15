import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export const fileService = {
  async downloadToDocuments(url: string, fileName: string) {
    if (!FileSystem.documentDirectory) {
      throw new Error('El almacenamiento de documentos no esta disponible.');
    }

    const targetUri = `${FileSystem.documentDirectory}${fileName}`;
    const result = await FileSystem.downloadAsync(url, targetUri);

    return result.uri;
  },

  async writeTextDocument(fileName: string, content: string) {
    if (!FileSystem.documentDirectory) {
      throw new Error('El almacenamiento de documentos no esta disponible.');
    }

    const targetUri = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(targetUri, content);
    return targetUri;
  },

  async shareFile(uri: string, dialogTitle = 'Compartir archivo') {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Compartir archivos no esta disponible en este dispositivo.');
    }

    await Sharing.shareAsync(uri, { dialogTitle });
  },
};
