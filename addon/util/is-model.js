import { isDocumentModel } from './mark-model';

export default instance => instance && instance.constructor[isDocumentModel] === true;
