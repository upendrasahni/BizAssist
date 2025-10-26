export interface PickResult {
  canceled: boolean;
  uri?: string;
  name?: string;
  size?: number;
  mimeType?: string;
}

export interface DocumentPickerAsset {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
  lastModified?: number;
}

export interface DocumentPickerMultiResult {
  canceled: boolean;
  assets: DocumentPickerAsset[];
}

export type UploadedFileMeta = {
  name: string;
  mimeType?: string;
  sizeBytes?: number;
};

export interface UserContext {
  name: string;
  email: string;
  userId: string;
  loginTime: string;
}
