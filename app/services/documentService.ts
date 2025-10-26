import * as DocumentPicker from 'expo-document-picker';
import { DocumentPickerMultiResult, PickResult } from './types';

export async function pickDocument(): Promise<PickResult & { raw: DocumentPickerMultiResult | null }> {
  const result: DocumentPickerMultiResult = await DocumentPicker.getDocumentAsync({
    type: 'application/pdf',
    copyToCacheDirectory: true,
  }) as DocumentPickerMultiResult;

  if (result.assets && result.assets.length > 0) {
    const asset = result.assets[0];
    return {
      canceled: false,
      uri: asset.uri,
      name: asset.name,
      size: asset.size,
      mimeType: asset.mimeType || 'application/pdf',
      raw: result,
    };
  }

  return { canceled: true, raw: result };
}
